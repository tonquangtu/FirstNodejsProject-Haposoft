const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UsersSchema = mongoose.Schema({
  account: {type: Schema.ObjectId, ref: 'accounts', required: true},
  balance: {type: Number, required: true, default: 0, min: 0},
  customer_id: {type: String},
  charges_money: [
    {
      amount: {type: Number, required: true, min: 0},
      time: {type: Date, required: true, default: Date.now}
    }
  ]
});


module.exports = mongoose.model('users', UsersSchema);