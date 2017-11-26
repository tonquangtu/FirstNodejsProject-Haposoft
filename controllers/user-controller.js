let Account = require('../models/account');
let Expert = require('../models/expert');
let User = require('../models/user');
let Message = require('../models/message');
let async = require('async');
const mongoose = require('mongoose');
let multer = require('multer');

const Schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PICKUP_EXPERTS_LIMIT = 15;

exports.userAfterAuth = (req, res, next) => {

  let dataSession = req.session.passport.user;
  let accountId = dataSession.account._id;
  let role = dataSession.account.role;
  let expertId = '';
  let loginSuccess = false;
  let haveExpert = false;

  if (dataSession.expert_id) {

    expertId = dataSession.expert_id;
    async.parallel(
      {
        expert: function (callback) {
          Expert.findOne({'_id': expertId})
            .populate('account')
            .exec(callback)
        },

        user: function (callback) {
          User.findOne({'account': accountId})
            .populate('account')
            .exec(callback);
        }
      },
      function (err, results) {

        if (err) return next(err);

        if (results.user) {
          loginSuccess = true;
        }
        if (results.expert) {
          haveExpert = true;
        }

        res.render('user-after-auth2', {
          loginSuccess: loginSuccess,
          haveExpert: haveExpert,
          role: role,
          user: results.user,
          expert: results.expert
        });
      }
    );
  } else {

    User.findOne({'account': accountId}, (err, user) => {

      if (err) return next(err);

      if (user) {
        loginSuccess = true;
      }

      res.render('user-after-auth', {
        loginSuccess: loginSuccess,
        role: role,
        user: user,
      });

    }).populate('account');
  }

};

exports.expertAfterAuth = (req, res, next) => {

  let dataSession = req.session.passport.user;
  let accountId = dataSession.account._id;
  let role = dataSession.account.role;

  let userId = '';
  let loginSuccess = false;
  let haveUser = false;

  if (dataSession.user_id) {

    userId = dataSession.user_id;
    async.parallel({

      expert: function (callback) {

        Expert.findOne({'account': accountId})
          .populate('account')
          .exec(callback)
      },

      user: function (callback) {

        User.findOne({'_id': userId})
          .populate('account')
          .exec(callback)
      }

    }, function (err, results) {

      if (err) return next(err);

      if (results.expert) {
        loginSuccess = true;
      }
      if (results.user) {
        haveUser = true;
      }

      res.render('expert-after-auth2', {
        loginSuccess: loginSuccess,
        haveUser: haveUser,
        role: role,
        expert: results.expert,
        user: results.user
      });
    });

  } else {

    Expert.findOne({'account': accountId}, (err, expert) => {

      if (err) return next(err);

      if (expert) {
        loginSuccess = true;
      }

      res.render('expert-after-auth', {
        loginSuccess: loginSuccess,
        role: role,
        expert: expert,
      });

    }).populate('account');
  }
};


exports.beforeChat = (req, res, next) => {

  res.render('before-signing-in');

};

exports.buyTicket = (req, res, next) => {
  console.log(req.body);
  let expMonth = req.body.exp_date.split('/')[0];
  let expYear = req.body.exp_date.split('/')[1];
  stripe.customers.create({
    email: 'james@gmail.com'
  }).then(function(customer){
    return stripe.customers.createSource(customer.id, {
      source: {
        object: 'card',
        exp_month: expMonth,
        exp_year: expYear,
        number: req.body.number,
        cvc: req.body.cvc
      }
    });
  }).then(function(source) {
    return stripe.charges.create({
      amount: req.body.amount,
      currency: 'jpy',
      customer: source.customer,
      description: 'Buy ticket'
    });
  }).then(function(charge) {
    res.json({
      message: 'Success'
    })
  }).catch(function(err) {
    let message = 'Server Error';
    let status = 500;
    let data = {
      param: ''
    };
    console.log('err: ', err)
    switch (err.type) {
      case 'StripeCardError':
        // A declined card error
        message = err.message; // => e.g. "Your card's expiration year is invalid."
        status = 422;
        data.param = err.param;
        break;
      case 'StripeInvalidRequestError':
        // Invalid parameters were supplied to Stripe's API
        break;
      case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        break;
      case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
        break;
      case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        break;
      case 'StripeRateLimitError':
        // Too many requests hit the API too quickly
        break;
    }
    res.status(status).json({
      message: message,
      data: data
    })
  });
};

exports.loadChatHistories = (req, res, next) => {

  let pagingHistory = -1;
  if (req.body.paging_history !== undefined) {
    if (req.body.paging_history === 0) {
      pagingHistory = new Date().getTime();
    } else if (req.body.paging_history !== -1) {
      pagingHistory = new Date(req.body.paging_history).getTime();
    }
  }

  let dataSession = req.session.passport.user;
  let userId = dataSession.user_id;
  let expertId = dataSession.expert_id;
  let role = dataSession.account.role;
  let requestSenderId = (role === 'user' ? userId : expertId);
  let chatLoadLimit = global.constant.chat_load_limit;

  if (pagingHistory <= 0) {
    sendResponse(res, global.constant.error_message.not_found_history, null, 404);
    return;
  }

  Message.findOne({'user_id': userId, 'expert_id': expertId},
    function (err, message) {
      if (err) {
        sendResponse(res, global.constant.error_message.error_load_history, null, 500);
        return;
      }

      if (!message || !message.contents || message.contents.length === 0) {
        sendResponse(res, global.constant.error_message.not_found_history, null, 404);
        return;
      }

      let messagesLength = message.contents.length;
      let filters = [];
      for (let i = 0; i < messagesLength; i++) {
        if (pagingHistory > new Date(message.contents[i].created_at)) {
          filters.push(message.contents[i]);
        }
      }

      let contents = filters.sort((before, after) => {
        return new Date(after.created_at).getTime() - new Date(before.created_at).getTime();
      });

      if (filters.length === 0) {
        sendResponse(res, global.constant.error_message.not_found_history, null, 404);
        return;
      }

      let length = filters.length > chatLoadLimit ? chatLoadLimit : filters.length;
      let histories = [];
      console.log(length);
      for (let i = 0; i < length; i++) {
        histories.push({
          from: (contents[i].sender_id == requestSenderId ? 'me' : 'from_partner'),
          text: contents[i].text,
          media: contents[i].media,
          type: contents[i].type,
          time: contents[i].created_at,
          status: contents[i].status,
          senderRole: (contents[i].sender_id == userId ? 'user' : 'expert')
        });
      }
      console.log(histories.length);
      let next = filters.length <= chatLoadLimit ? -1 : histories[length -1].time;
      let response = {
        data: histories,
        next: next
      };
      sendResponse(res, global.constant.message.success, response, 200);
    });
};

exports.pickupExpert = (req, res, next) => {

  let sort = {};
  let occupationTypes = req.query.occupation_type;
  let page = parseInt(req.query.page);

  if (typeof(page) === "undefined") {
    page = 1;
  }

  let query = {};

  if (typeof(occupationTypes) !== 'undefined') {
    query = {occupation_type: {"$in": occupationTypes}};
  }

  switch (req.query.sort) {
    case '0':
      sort.like = -1;
      break;
    case '1':
      sort.rate = -1;
      break;
    case '2':
    default:
      sort = {like: -1};
      break;
  }

  let pickupExpertOffset = ((page - 1) * PICKUP_EXPERTS_LIMIT);

  Expert.find(query, (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.length === 0) {
      //Empty Array should return HTTP 204 No Content
      res.status(204)
    }
    res.json(results)

  }).sort(sort).limit(PICKUP_EXPERTS_LIMIT).skip(pickupExpertOffset).populate('account');
};

exports.verifyPickupExpert = function (req, res, next) {

  let expertId = req.body.expert_id;
  let message;
  let status;
  let data = {};

  console.log('verify pickup: ' + expertId);

  if (expertId) {

    Expert.findOne({'_id': expertId}, (err, expert) => {

      if (expert) {
        if (req.session.passport && req.session.passport.user) {
          req.session.passport.user.expert_id = expert.id;
        } else {
          req.session.expert_id = expert.id;
        }

        status = 200;
        message = global.constant.message.success;
        data = {
          expertId: expert.id,
          expertName: expert.account.name,
          expertAvatar: expert.account.avatar_url,
          expertEmail: expert.account.email,

          expertTitle: expert.title,
          expertSubTitle: expert.sub_title,
          expertOccupation:expert.occupation,
          expertOccupationType: expert.occupation_type,
          expertLike: expert.like,
          expertRate: expert.rate
        };

      } else {
        message = global.constant.error_message.not_found_expert;
        status = 404;
      }
      res.status(status).json({
        message: message,
        data: data
      });
    }).populate('account');

  } else {

    status = 404;
    message = global.constant.error_message.expert_id_invalid;
    res.status(status).json({
      message: message,
      data: {}
    });
  }

};

exports.currentExpert = (req, res, next) => {

  let expertId = '';

  if (req.session.passport && req.session.passport.user) {
    expertId = req.session.passport.user.expert_id;
  } else {
    expertId = req.session.expert_id;
  }
  Expert.findOne({'_id': expertId}, (err, expert) => {
    if (err) {
      return next(err);
    }

    res.json(expert);
  }).populate('account')
};

exports.registerExpert = (req, res, next) => {

  if (req.session.passport && req.session.passport.user) {
    Account.findOneAndUpdate(
      {'_id': req.session.passport.user.account._id},
      {role: 'expert'},
      (err, account) => {
        if (err) return next(err);
        Expert.findOne({'account': account._id}, (err, expert_check) => {
          if (expert_check === null) {
            let expert = new Expert({
              account: account._id,
              title: req.body.title,
              sub_title: req.body.subTitle,
              occupation: req.body.occupation,
              occupation_type: req.body.occupationType,
              benefit: 0
            });
            expert.save(err => {
              if (err) console.log('expert create fail: ' + err);
              res.json({message: 'Register expert completed'});
            });
          }
        })
      }
    )
  } else {
    console.log('no login session')
  }
};

exports.loadNotifications = (req, res, next) => {

  let session = req.session.passport.user;
  let lastNotificationAt = new Date();
  if (req.body.last_notification_at && req.body.last_notification_at !== -1) {
    lastNotificationAt = req.body.last_notification_at;
  }

  let myId = getMyId(session);
  let limitPerPage = global.constant.notification_limit;
  let role = session.account.role;
  let query = {};
  let selector = '';
  let populateObject = '';
  let status = 200;
  let message = '';
  let data = [];

  if (role === global.constant.role.user_role) {
    query = {'user_id': myId};
    selector = 'expert_id last_message_at';
    populateObject = 'expert_id';
  } else {
    query = {'expert_id': myId};
    selector = 'user_id last_message_at';
    populateObject = 'user_id';
  }

  Message
    .find(query)
    .where('last_message_at').lt(lastNotificationAt)
    .populate({path: populateObject, select: 'account', populate: {path: 'account', select: 'name role'}})
    .limit(limitPerPage)
    .sort({last_message_at: -1})
    .select(selector)
    .exec((err, results) => {

      if (err) {
        console.log(err);
        status = 404;
        message = global.constant.error_message.server_error;
        res.status(status).json({
          message: message,
          data: data
        });
        return;
      }
      console.log(results.length);
      status = 200;
      if (role === global.constant.role.user_role) {
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            data.push({
              partnerId: results[i].expert_id.id,
              partnerName: results[i].expert_id.account.name,
              partnerRole: results[i].expert_id.account.role,
              lastMessageAt: results[i].last_message_at
            });
          }
        }

      } else {
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            data.push({
              partnerId: results[i].user_id.id,
              partnerName: results[i].user_id.account.name,
              partnerRole: results[i].user_id.account.role,
              lastMessageAt: results[i].last_message_at,
            });
          }
        }
      }

      res.status(status).json({
        message: global.constant.message.success,
        data: data
      });

    });
};

exports.updatePartner = (req, res, next) => {

  let partnerId = req.body.partner_id;
  let partnerRole = req.body.partner_role;
  let status = 200;
  let message = '';
  let data = {};

  let session = req.session.passport.user;
  if (session.account.role === global.constant.role.user_role) {

    session.expert_id = partnerId;
    Expert.findById(partnerId, (err, expert) => {
      if (err || !expert) {
        console.log(err);
        message = global.constant.error_message.not_found_expert;
        status = 404;
      } else {
        status = 200;
        message = global.constant.message.success;
        data = {
          partnerId: partnerId,
          partnerName: expert.account.name,
          partnerAvatar: expert.account.avatar_url,
          partnerRole: global.constant.role.expert_role,
          partnerEmail: expert.account.email,

          expertTitle: expert.title,
          expertSubTitle: expert.sub_title,
          expertOccupation: expert.occupation,
          expertOccupationType: expert.occupation_type,
          expertLike: expert.like,
          expertRate: expert.rate,
          expertProfile: expert.account.profile
        }
      }
      res.status(status).json({
        message: message,
        data: data
      });

    }).populate('account');

  } else if (partnerRole === global.constant.role.user_role) {

    session.user_id = partnerId;
    User.findById(partnerId, (err, user) => {
      if (err || !user) {
        message = global.constant.error_message.not_found_user;
        status = 404;
      } else {
        status = 200;
        message = global.constant.message.success;
        data = {
          partnerId: partnerId,
          partnerName: user.account.name,
          partnerAvatar: user.account.avatar_url,
          partnerRole: global.constant.role.user_role,
          partnerEmail: user.account.email
        }
      }
      res.status(status).json({
        message: message,
        data: data
      });
    }).populate('account');

  } else {

    session.partner_id = partnerId;
    session.partner_role = partnerRole;
    res.status(404).json({
      message: 'Expert not allow choose other expert',
      data: {}
    });
  }

};

exports.expertLikeCheck = (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    Review.findOne({user_id: req.query.user_id, expert_id: req.query.expert_id}, (err, review) => {
      if (err) return next(err);
      res.json(review);
    });
  }
}

exports.likeOrUnlikeExpert = (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    review = Review.findOne({
      user_id: req.body.user_id,
      expert_id: req.body.expert_id
    }, (err, review) => {
      if (err) console.log('like fail: ' + err);
      if (review == null){
        new Review({
          user_id: req.body.user_id,
          expert_id: req.body.expert_id,
          like: req.body.like
        }).save(err => {
          Expert.findOne({_id: req.body.expert_id}, (err, expert) => {
            if (expert) {
              expert.like += 1;
              expert.save(e => {
                res.json({
                  message: 'LikeOrUnlike expert completed',
                  data: {
                    likes: expert.like
                  }
                });
              })
            }
          })
        });
      } else {
        review.update({like: req.body.like}, err => {
          Expert.findOne({_id: req.body.expert_id}, (err, expert) => {
            if (expert) {
              expert.like += 1;
              expert.save(e => {
                res.json({
                  message: 'LikeOrUnlike expert completed',
                  data: {
                    likes: expert.like
                  }
                });
              })
            }
          })
        });
      }
    })
  }
}

function getMyId(session) {
  return (session.account.role === global.constant.role.user_role ? session.user_id : session.expert_id);
}

function sendResponse(res, message, data, status) {
  res.status(status).json({
    message: message,
    data: data
  });
}

exports.updateProfile = (req, res, next) => {
  console.log("file here:");
  console.log(req.file);
  console.log(req.files);

  let file = req.file;

  if (req.session.passport && req.session.passport.user) {

    console.log('before update');
    uploadToS3(file, (uploadErr, data) => {
      if (uploadErr) {
        console.log(uploadErr);
        return next(uploadErr);
      }
      console.log('upload file ok');
      Account.findOneAndUpdate(
        { _id: req.session.passport.user.account._id}, 
        { name: req.body.name, 
          avatar_url: data.Location,
          mail: req.body.email, 
          profile: req.body.profile
        },
        (err, account) => {
          if (err) return next(err);
          console.log('update account ok');
          if (account.role === 'expert') {
            Expert.findOneAndUpdate(
              { account: account._id }, 
              { occupation: req.body.occupation, 
                occupation_type: req.body.occupationType, 
                title: req.body.title, 
                sub_title: req.body.subTitle
              },
              (error, expert) => {
                console.log('update expert ok');
                if (err) return next(error)
              }
            );
          }
          res.json({message: 'Profile update completed'})
        });
      console.log('upload file last')
    })
  } else {
    console.log('no login session')
  }
};

function uploadToS3(file, callback) {
  console.log('upload 1')
  // Load File Stream module
  let fs = require('fs');
  console.log(file);
  // Load the photo from disk
  let body = fs.createReadStream(file.path);
  // Create file name
  let date = new Date();
  let key = file.name;
  // Load AWS module
  let AWS = require('aws-sdk');
  AWS.config.update({
    accessKeyID: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
  })
  
  // Create S3 Object, set content type to image and add Read permission to Everyone
  let s3obj = new AWS.S3({params: {Bucket: 'premi-um', Key: key, ContentType: 'image/jpeg', ACL: 'public-read'}});
    // Upload to S3
  s3obj.upload({Body: body}).on('httpUploadProgress', function(evt) {
  }).send(function(err, data) {
    if (err) {
      callback('Error occurred.');
    } else {
      // Remove file after uploaded to S3
      fs.unlink(file.path);
      callback(null, data);
    }
  });
}

exports.handleUploadFile = (req, res) => {

  let uploader = global.helpers.uploader;

  uploader(req, res, (err) => {

    if (err) {
      console.log(err);
      return;
    }

    res.end('Your Files Uploaded');
    console.log(req.files);

  });



};