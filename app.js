const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
global.helpers = require('./helpers/helpers.js');
global.constant = require('./config/constant');
let passport = require('passport');

let app = express();

global.helpers.dbConnect();

// const multer  = require('multer');

// app.use(multer({
//   dest: 'uploads/',
//   onFileUploadStart(file) {
//     console.log(file.originalname + ' is starting ...')
//   },
//   onFileUploadComplete(file) {
//     console.log(file.fieldname + ' uploaded to  ' + file.path)
//   }
// }));

// let multer  = require('multer');
// 
// app.use(multer({ // https://github.com/expressjs/multer
//   dest: './public/uploads/', 
//   limits : { fileSize:100000 },
//   rename: function (fieldname, filename) {
//     return filename.replace(/\W+/g, '-').toLowerCase();
//   },
//   onFileUploadData: function (file, data, req, res) {
//     // file : { fieldname, originalname, name, encoding, mimetype, path, extension, size, truncated, buffer }
//     var params = {
//       Bucket: 'premi-um',
//       Key: file.name,
//       Body: data
//     };

//     s3.putObject(params, function (perr, pres) {
//       if (perr) {
//         console.log("Error uploading data: ", perr);
//       } else {
//         console.log("Successfully uploaded data to myBucket/myKey");
//       }
//     });
//   }
// }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(global.helpers.session);

// place this codes before router
app.use(passport.initialize());
app.use(passport.session());
require('./security/authentication.js')(passport);

const index = require('./routes/index');
const users = require('./routes/users');
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;