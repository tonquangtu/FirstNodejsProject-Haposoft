const Account = require('../models/account');
const User = require('../models/user');
const Expert = require('../models/expert');
let passport = require('passport');
let constant = global.constant;

exports.login = (req, profile, done) => {

  if (!req.data) {
    req.data = {};
  }

  if (req.data.account) {
    updateAccount(req.data, profile, done);
  } else {

    let data = req.data;
    Account.findOne(
      {
        'provider_id': profile.id,
        'provider': profile.provider
      },
      (err, account) => {

        if (err)
          return done(err);

        if (account) {
          data.account = account;
          updateAccount(data, profile, done);
        } else {
          createNewAccount(data, profile, done);
        }
      });
  }

};

exports.facebookAuth = () => {

  passport.authenticate('facebook', { scope : ['public_profile', 'email'] });
};

exports.twitterAuth = () => {

  passport.authenticate('twitter', { scope : 'email' });
};

exports.facebookCallback = (req, res, next) => {

  passport.authenticate('facebook', (err, data, info) => {

    redirectAfterLogin(req, res, next, data, err);
  })(req, res, next);
};

exports.twitterCallback = (req, res, next) => {

  passport.authenticate('twitter', (err, data, info) => {

    redirectAfterLogin(req, res, next, data, err);
  })(req, res, next);
};

// route middleware to ensure user is logged in
exports.isLoggedIn = (req, res, next) => {

  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
};

function createNewAccount(data, profile, done) {
  console.log('createNewAccount');
  let newAccount = new Account({
    name: profile.displayName,
    avatar_url: (profile.photos.length > 0 ? profile.photos[0].value : ''),
    provider: profile.provider,
    provider_id: profile.id,
    email: (profile.emails.length > 0 ? profile.emails[0].value : ''),
    role: constant.role.user_role,
  });
  newAccount.save((err) => {

    if (err)
      return done(err);

    data.account = newAccount;
    createNewUser(newAccount, data, done);
  });
}

function createNewUser(account, data, done) {
  console.log('createNewUser');
  let newUser = new User({
    account: account,
    balance: 0,
    customer_id: '',
    charges_money: []
  });
  newUser.save((err) => {
    if (err)
      return done(err);

    data.user_id = newUser.id;
    return done(null, data);
  });
}

function redirectAfterLogin(req, res, next, data, err) {

  if (err) { return next(err); }

  if (!data || !data.account) { return res.redirect('/login'); }

  req.logIn(data, function(err) {

    if (err) { return next(err); }

    if (data.account.role === constant.role.user_role) {
      if (req.session.expert_id && !data.expert_id) {
        console.log('co expert id khi login');
        data.expert_id = req.session.expert_id;
      }
      // data.expert_id = "59af6d0c39b05211682c3b8d";
      // data.user_id = "59af6d0b39b05211682c37a5";
      return res.redirect('/user-after-auth');

    } else {
      // data.user_id = "59af6d0b39b05211682c37a5";
      // data.expert_id = "59af6d0c39b05211682c3b8d";
      return res.redirect('/expert-after-auth');
    }
  });
}

function updateAccount(data, profile, done) {

  let account = data.account;
  let isChange = false;

  if (account.name !== profile.displayName) {
    account.name = profile.displayName;
    isChange = true;
  }

  if (account.provider_id !== profile.id) {
    account.provider_id = profile.id;
    isChange = true;
  }

  if (account.email === undefined)
    account.email = '';

  if (account.avatar_url === undefined)
    account.avatar_url = ''; // default avatar

  if (profile.emails.length > 0) {
    if (account.email !== profile.emails[0].value) {
      account.email = profile.emails[0].value;
      isChange = true;
    }
  }

  if (profile.photos.length > 0) {
    if (account.avatar_url !== profile.photos[0].value) {
      account.avatar_url = profile.photos[0].value;
      isChange = true;
    }
  }

  if (isChange) {
    account.save(function (err) {
      if (err)
        return done(err);

      findUserOrExpert(data, done);
    });

  } else {
    findUserOrExpert(data, done);
  }
}

function findUserOrExpert(data, done) {

  if (data.account.role === global.constant.role.user_role) {
    User.findOne({account: data.account.id}, (err, user) => {

      if (err)
        return done(err);
      if (user) {
        data.user_id = user.id;
        return done(null, data);
      }
      return done(null, data);
    });

  } else {
    Expert.findOne({account: data.account.id}, (err, expert) => {

      if (err)
        return done(err);

      data.expert_id = expert.id;
      return done(null, data);
    });
  }


}