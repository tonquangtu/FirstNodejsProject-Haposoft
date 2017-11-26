var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessagesSchema = Schema({

  user_id: {type: Schema.ObjectId, ref: 'users', required: true},

  expert_id: {type: Schema.ObjectId, ref: 'experts', required: true},

  contents: [
    {
      text: {type: String},
      media: {
        urls: [{type: String}],
        description: {type: String}
      },
      type: {type: Number},
      sender_id: {type: Schema.ObjectId, required: true},
      status: {type:String, default: 'sending', enum : ['sending','sent','seen', 'fail']},
      created_at: {type: Date, default: Date.now},
      updated_at: {type: Date, default: Date.now},
      deleted_at: {type: Date, default: Date.now}
    }
  ],
  last_message_at: {type: Date, default: Date.now}

});

module.exports = mongoose.model('messages', MessagesSchema);