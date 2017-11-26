var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewsSchema = Schema({

  user_id: {type: Schema.ObjectId, ref: 'users', required: true},

  expert_id: {type: Schema.ObjectId, ref: 'experts', required: true},

  like: {type: Boolean},

  rate: {type: Number, default: 0}
});

module.exports = mongoose.model('reviews', ReviewsSchema);