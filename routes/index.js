const express = require('express');
const path = require('path');
const userController = require('../controllers/user-controller');
const loginController = require('../controllers/login-controller');
const passport = require('passport');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET About page
router.get('/about', function(req, res, next) {
  res.render('index/about');
});

router.get('/login', userController.beforeChat);

router.get('/user-after-auth', loginController.isLoggedIn, userController.userAfterAuth);

router.get('/expert-after-auth', loginController.isLoggedIn, userController.expertAfterAuth);

// send to facebook to do the authentication
router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

// custom callback after login
router.get('/auth/facebook/callback', loginController.facebookCallback);

// send to twitter to do the authentication
router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

// custom callback after login
router.get('/auth/twitter/callback', loginController.twitterCallback);

router.get('/socket.io-file-client.js', (req, res, next) => {
  res.sendFile('socket.io-file-client.js', {root: path.join(__dirname, '../node_modules/socket.io-file-client')});
});


module.exports = router;
