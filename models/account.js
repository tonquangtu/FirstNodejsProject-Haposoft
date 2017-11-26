var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountsSchema = mongoose.Schema({

  name: {type: String, required: true, min: 3, max: 50},

  avatar_url: {type: String, required: true, min: 1},

  provider: {type: String, required: true, enum: ['facebook', 'twitter']},

  provider_id: {type: String, required: true},

  email: {type: String},

  profile: {type: String},

  role: {type:String, required: true, enum: ['user', 'expert']}

});

module.exports = mongoose.model('accounts', AccountsSchema);