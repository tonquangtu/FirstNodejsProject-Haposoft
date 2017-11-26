
var dotenv = require('dotenv');
dotenv.config();
var mongoose = require('mongoose');
var dbUrl = process.env.DB_URL;
conn = mongoose.connect(dbUrl);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

let Message = require('./models/message');

Message.find(
  {
    'contents' : {$elemMatch: {text: 'do con cho nhan tin di'}}}).exec((err, results) => {

  console.log(results[0].contents.length);
  for (let i = 0; i < results[0].contents.length; i++) {
    console.log(results[0].contents[i].created_at);
  }
  // results.contents.sort((a,b) => {
  //   return (new Date(b.created_at).getTime()) - (new Date(a.created_at).getTime());
  // });

  // console.log(results.contents);

});

// let dates = [new Date(2017, 10, 11), new Date(2017, 10, 12), new Date(2017, 10, 9)];
// dates.sort((a,b) => {
//   return new Date(a).getTime() - new Date(b).getTime();
// });
//
// console.log(dates);

// Message
//   .find({'user_id': '59b4ba7fba852d229f02f88b',
//   'expert_id': '59b5153d23ac7b1eafeabe66'})
//   .where('contents.created_at').lt(new Date(2017, 8,10)).exec((err, ))
// Message.find({'user_id': '59b4ba7fba852d229f02f88b','last_message_at': {$gte: new Date('2017-09-10T10:26:41.115Z')}}, (err, message) => {
//
//   console.log(message.length);
//   for (let i = 0; i < message.length; i++) {
//     console.log(message[i].last_message_at);
//   }
//
// });
//
// console.log('----------------');
//
// Message.find({'user_id': '59b4ba7fba852d229f02f88b','last_message_at': {$lte: new Date('2017-09-10T10:26:41.115Z')}}, (err, message) => {
//
//   console.log(message.length);
//   for (let i = 0; i < message.length; i++) {
//     console.log(message[i].last_message_at);
//   }
//
// });