#! /usr/bin/env node

// Faker create database data by Ton Quang Tu
// edit dbUrl to suitable with database server
// since then run 'node populatedb' to create db and
// create fake data


var async = require('async');
var faker = require('faker');

var Account = require('./models/account');
var User = require('./models/user');
var Expert = require('./models/expert');
var Message = require('./models/message');
var Review = require('./models/review');

var dotenv = require('dotenv');
dotenv.config();

var mongoose = require('mongoose');
var dbUrl = process.env.DB_URL;
conn = mongoose.connect(dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('open', function () {
  conn.connection.db.dropDatabase(function(err, result){
    // done();
  })
});
// conn.connection.db.dropDatabase();

var accounts = [];
var users = [];
var experts = [];
var messages = [];
var reviews = [];
var maxUser = 500;
var maxExpert = 100;
var maxAccount = maxUser + maxExpert;
var maxMessage = 1000;
var maxReview = 100;
var countAcc = 0;
var countUser = 0;
var countExp = maxUser;

function accountCreate(accountParams, callback) {

  let accountDetail = {
    name: accountParams[0],
    avatar_url: accountParams[1],
    provider: accountParams[2],
    provider_id: accountParams[3],
    email: accountParams[4],
    role: accountParams[5]
  };

  let acc = new Account(accountDetail);
  acc.save(function (err) {

    if (err) {
      console.log('account create fail: ' + err);
      return;
    }

    accounts.push(acc);
    callback(null, 'accountCreate');
  });


}


function userCreate(userParams, callback) {

  let userDetail = {

    account: userParams[0],

    pay_info: {
      card_number: userParams[1],
      card_name: userParams[2],
      last_four_digits: userParams[3],
      expire_date: userParams[4],
    },

    balance: userParams[5],
    charges_money: [

      {
        amount: userParams[6],
        time: userParams[7]
      }
    ]

  };

  let user = new User(userDetail);
  user.save(function (err) {

    if (err) {
      console.log('user create fail: ' + err);
      return;
    }

    users.push(user);
    callback(null, 'userCreate');
  });
}

function expertCreate(params, callback) {

  let expertDetail = {

    account: params[0],
    title: params[1],
    sub_title: params[2],
    occupation: params[3],
    occupation_type: params[4],
    benefit: params[5],
    benefit_details: [
      {
        user_id: params[6],
        amount: params[7],
        time: params[8]
      }
    ],
    like: params[9],
    rate: params[10]
  };

  let expert = new Expert(expertDetail);
  expert.save(function (err) {

    if (err) {
      console.log('expert create fail: ' + err);
    }

    experts.push(expert);
    callback(null, 'expertCreate');
  });

}

function messageCreate(params, callback) {

  let urls = [];
  if (params[3] != null) {
    urls.push(params[3]);
  }

  let messageDetail = {
    user_id: params[0],
    expert_id: params[1],
    contents: [
      {
        text: params[2],
        media: {
          urls: urls,
          description: params[4]
        },
        type: params[5],
        sender_id: params[6],
        status: params[7],
        created_at: params[8],
        updated_at: params[9],
        deleted_at: params[10]
      }
    ],
    last_message_at: params[11]
  };

  let message = new Message(messageDetail);
  message.save(function (err) {

    if (err) {
      console.log('message create fail: ' + err);
    }

    messages.push(message);
    callback(null, 'messageCreate');
  });
}


function reviewCreate(params, callback) {

  let reviewDetail = {
    user_id: params[0],
    expert_id: params[1],
    like: params[2],
    rate: params[3]
  };

  let review = new Review(reviewDetail);
  review.save(function (err) {

    if (err) {
      console.log('review create fail: ' + err);
    }

    reviews.push(review);
    callback(null, 'reviewCreate');
  });

}

function accsFaker(cb) {

  var role;
  if (countAcc < maxUser) {
    role = 'user';
  } else {
    role = 'expert';
  }
  countAcc++;
  console.log('vao accs faker');

  async.parallel([

      function (callback) {

        let accParams = [
          faker.name.findName(),
          faker.image.avatar(),
          'facebook',
          faker.random.uuid(),
          faker.internet.email(),
          role
        ];

        accountCreate(accParams, callback);
      }
    ],

    cb);


}


function usersFaker(cb) {

  console.log('vao user faker');

  async.parallel([

      function (callback) {

        let userParams = [
          accounts[countUser++],
          faker.phone.phoneNumber(),
          faker.name.findName(),
          randomInt(1001, 9999),
          faker.date.past(),
          randomInt(1000, 10000),
          randomInt(1, 9) * 1000,
          faker.date.past()
        ];

        userCreate(userParams, callback);
      }
    ],

    cb);

}

function expertsFaker(cb) {

  console.log('vao expert faker');

  let occupation_types = ['ビジネス', '法律', '投資・マネー', 'IT', '健康', '税・会計', '生活全般'];

  async.parallel([

      function (callback) {

        let expertParams = [

          accounts[countExp++],
          faker.name.title(),
          faker.lorem.sentences(),
          faker.name.jobTitle(),
          occupation_types[Math.floor(Math.random()*occupation_types.length)],
          randomInt(100, 9999),
          users[randomInt(1, maxUser - 2)],
          randomInt(1, 9) * 1000,
          faker.date.past(),
          randomInt(10, 100),
          randomInt(1, 5)
        ];

        expertCreate(expertParams, callback);
      }
    ],

    cb);

}

function messagesFaker(cb) {

  console.log('vao messagesFaker');

  async.parallel([

      function (callback) {

        let isHaveImage = randomInt(1, 5) === 3;
        let url = null;
        let type = 1;
        let description = '';
        let text = '';
        if (isHaveImage) {
          type = 2;
          url = faker.image.technics();
          description = faker.lorem.sentences();
        } else {
          type = 1;
          text = faker.lorem.sentences();
        }

        let userIndex = randomInt(1, maxUser - 2);
        let expertIndex = randomInt(1, maxExpert - 2);
        let sender = randomInt(1, 3) === 1 ? users[userIndex] : experts[expertIndex];
        let date = faker.date.past();

        let mesParams = [
          users[userIndex],
          experts[expertIndex],
          text,
          url,
          description,
          type,
          sender,
          'seen',
          date,
          date,
          null,
          date
        ];

        messageCreate(mesParams, callback);
      }
    ],

    cb);

}

function reviewsFaker(cb) {

  console.log('vao reviewsFaker');
  async.parallel([

      function (callback) {

        let reviewParams = [
          users[randomInt(1, maxUser - 2)],
          experts[randomInt(1, maxExpert - 2)],
          randomInt(0, 2),
          randomInt(1, 6)
        ];
        reviewCreate(reviewParams, callback);
      }
    ],

    cb);

}

function deleteAllReview(cb) {

  Review.remove({}, function (err) {

    if (err) {
      console.log('can not delete review');
    } else {
      console.log('delete all review');
    }
    cb(null, 'deleteAllReview');

  });
}

function deleteAllMessage(cb) {

  Message.remove({}, function (err) {

    if (err) {
      console.log('can not delete message');
    } else {
      console.log('delete all message');
    }
    cb(null, 'deleteAllMessage');

  });
}

function deleteAllExpert(cb) {

  Expert.remove({}, function (err) {

    if (err) {
      console.log('can not delete expert');
    } else {
      console.log('delete all expert');
    }
    cb(null, 'deleteAllExpert');

  });
}

function deleteAllUser(cb) {

  User.remove({}, function (err) {

    if (err) {
      console.log('can not delete user');
    } else {
      console.log('delete all user');
    }
    cb(null, 'deleteAllUser');

  });
}

function deleteAllAccount(cb) {

  Account.remove({}, function (err) {

    if (err) {
      console.log('can not delete account');
    } else {
      console.log('delete all account');
    }
    cb(null, 'deleteAllAccount');

  });
}

function deleteAllSession(cb) {

  Account.remove({}, function (err) {

    if (err) {
      console.log('can not delete account');
    } else {
      console.log('delete all account');
    }
    cb(null, 'deleteAllAccount');

  });
}

function deleteAllDocuments(cb) {

  async.series([
      deleteAllReview,
      deleteAllMessage,
      deleteAllExpert,
      deleteAllUser,
      deleteAllAccount
    ],

    function (err, result) {
      if (err) {
        console.log('can not delete all document');
      } else {
        console.log('delete all table');
      }
      cb(null, 'deleteAllDocuments');
    });

}

var arrCalls = [];

// arrCalls.push(deleteAllDocuments);

for (let i = 0; i < maxAccount; i++) {
  arrCalls.push(accsFaker);
}

for (let i = 0; i < maxUser; i++) {
  arrCalls.push(usersFaker);
}

for (let i = 0; i < maxExpert; i++) {
  arrCalls.push(expertsFaker);
}

for (let i = 0; i < maxMessage; i++) {
  arrCalls.push(messagesFaker);
}

for (let i = 0; i < maxReview; i++) {
  arrCalls.push(reviewsFaker);
}

async.series(
  arrCalls,

  // final callback
  function (err, results) {
    if (err) {
      console.log('Final err at series: ' + err);
    }
    else {
      console.log('Successful fake data: Faker Quang Tu');
    }
    //All done, disconnect from database
    mongoose.connection.close();
  });


function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}