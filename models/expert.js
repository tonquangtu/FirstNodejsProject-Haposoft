var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ExpertsSchema = mongoose.Schema({

  account: {type: Schema.ObjectId, ref: 'accounts', required: true},

  title: {type: String, required: true},

  sub_title: {type: String},

  occupation: {type: String, required: true},

  occupation_type: {
    type: String,
    required: true,
    // add enum
  },

  benefit: {type: Number, required: true, min: 0},

  benefit_details: [
    {
      user_id: {type: Schema.ObjectId, ref: 'users', required: true},
      amount: {type: Number, required: true, min: 0},
      time: {type: Date, default: Date.now, required: true},
    },
  ],

  like: {type: Number, required: true, default: 0, min: 0},
  rate: {type: Number, required: true, default: 0, min: 0}
});

module.exports = mongoose.model('experts', ExpertsSchema);