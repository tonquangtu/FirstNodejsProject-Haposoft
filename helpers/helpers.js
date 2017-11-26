const mongoose = require('mongoose');
let expressSession = require('express-session');
let MongoStore = require('connect-mongo')(expressSession);
let multer = require('multer');

let sessionStore = configSessionStore();
let session = configSession();

let storage = getUploadStorage();

let uploader = multer({storage: storage}).array('files', 5);

exports.dbConnect = function () {
  // config database
  let DB_URL = process.env.DB_URL;
  mongoose.connect(DB_URL, {
    useMongoClient: true,
  });
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error'));
};


exports.session = session;

exports.sessionStore = sessionStore;

exports.uploadStorage = storage;


function configSessionStore() {

  return new MongoStore({
    url: process.env.DB_URL,
    autoRemove: 'native', // default
    ttl: 3 * 24 * 60 * 60 // = 14 days. Default
    // touchAfter: 24 * 3600 // lazy update after 24h
  });
}

function configSession() {

  return expressSession({
    key: process.env.session_key,
    secret: process.env.session_secret, // session secret
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000}
  });
}

function getUploadStorage() {

  return multer.diskStorage({

    destination: (req, file, callback) => {
      callback(null, '/public/upload');
    },

    filename: (req, file, callback) => {
      console.log(file);
      callback(null, file.originalname);
    }
  });
}

