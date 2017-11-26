var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

var configAuth = require('../config/login-auth');
var loginController = require('../controllers/login-controller');

module.exports = function (passport) {

  // Passport session setup.
  passport.serializeUser(function(data, done) {
    done(null, data);
  });

  passport.deserializeUser(function(data, done) {
    done(null, data);
  });

  // facebook authenticate
  var fbConfigAuth = configAuth.facebookAuth;
  fbConfigAuth.passReqToCallback = true;
  passport.use(new FacebookStrategy(

    fbConfigAuth,

    function (req, token, refreshToken, profile, done) {

      //asynchronous
      process.nextTick(function () {

        // console.log(profile);
        // console.log(profile.picture[0].value);
        // var user = {};
        // user.id = profile.id;
        // return done(null, user);
        loginController.login(req, profile, done);

      });
    }
  ));

  // twitter authenticate
  var twitterConfigAuth = configAuth.twitterAuth;
  twitterConfigAuth.passReqToCallback = true;
  twitterConfigAuth.includeEmail = true;
  passport.use(new TwitterStrategy(

    twitterConfigAuth,

    function (req, token, tokenSecret, profile, done) {

      process.nextTick(function () {

        // console.log(profile);
        loginController.login(req, profile, done);
      });
    }
  ));

};