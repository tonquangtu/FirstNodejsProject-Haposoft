// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth' : {
    'clientID'        : process.env.fb_client_id, // your App ID
    'clientSecret'    : process.env.fb_client_secret, // your App Secret
    'callbackURL'     : process.env.fb_callback,
    'profileFields'   : ['id', 'displayName', 'email', 'photos']

  },

  'twitterAuth' : {
    'consumerKey'        : process.env.twitter_consumer_key,
    'consumerSecret'     : process.env.twitter_consumer_secret,
    'callbackURL'        : process.env.twitter_callback
  },

  'googleAuth' : {
    'clientID'         : 'your-secret-clientID-here',
    'clientSecret'     : 'your-client-secret-here',
    'callbackURL'      : 'your google callback'
  }

};
