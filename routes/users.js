const express = require('express');
const router = express.Router();

let multer  = require('multer');

let upload = multer({
  dest: 'uploads/',
  onFileUploadStart(file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete(file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
  }
});

let userController = require('../controllers/user-controller');
let loginController = require('../controllers/login-controller');

router.post('/buy-ticket', userController.buyTicket);

router.get('/pickup-expert', userController.pickupExpert);

router.post('/verify-pickup-expert', userController.verifyPickupExpert);

router.get('/current-expert', userController.currentExpert);

router.post('/register-expert', userController.registerExpert);

router.post('/update-profile', upload.single('avatar'), userController.updateProfile);

router.post('/load-chat-history', loginController.isLoggedIn, userController.loadChatHistories);

router.post('/load-notification', loginController.isLoggedIn, userController.loadNotifications);

router.post('/update-partner', loginController.isLoggedIn, userController.updatePartner);

router.post('/like-expert', userController.likeOrUnlikeExpert);

router.get('/expert-like-check', userController.expertLikeCheck);

router.post('/upload', userController.handleUploadFile);

module.exports = router;
