let Message = require('../models/message');
let Expert = require('../models/expert');
let User = require('../models/user');

let socketIo = require('socket.io');
let passportSocketIo = require('passport.socketio');
let cookieParser = require('cookie-parser');
let mailSender = require('./mail');
let SocketIoFile = require('socket.io-file');
let path = require('path');

let rooms = [];
let helpers = global.helpers;
let constant = global.constant;
let io;
let uploader;

module.exports = function (server) {

  io = socketIo(server);
  setupAuthorization();

  setupEvent();

};

function setupAuthorization() {

  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: process.env.session_key,
    secret: process.env.session_secret,
    store: helpers.sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  }));
}

function setupEvent() {

  io.on('connection', (socket) => {

    console.log('socket connected');

    addRoom(socket);

    socket.on(constant.socket_event.message_from_client, (data) => {
      console.log('message_from_client');
      handleReceiveMessage(socket, data);
    });


    socket.on(constant.socket_event.notify_received_message, (dataStatusFromClient) => {
      handleUpdateMessageStatus(socket, dataStatusFromClient);
    });

    socket.on(constant.socket_event.seen_all_messages, (data) => {
      handleUpdateAllMessageStatus(socket, data);
    });

    setupUploader(socket);

  });
}

function setupUploader(socket) {

  let options = {
    uploadDir: 'public/upload',
    accepts: ['audio/mpeg', 'audio/mp3', 'image/png', 'image/jpeg'],
    maxFileSize: 4194304, 				// 4 MB
    chunkSize: 10240,
    transmissionDelay: 0,
    overwrite: true,
    rename: function (filename) {
      var file = path.parse(filename);
      return file.name.split(" ").join("_") + "_" + (new Date().getTime()) + file.ext;
    }
  };

  uploader = new SocketIoFile(socket, options);

  uploader.on('start', (fileInfo) => {
    console.log('Start uploading');
  });

  uploader.on('stream', (fileInfo) => {
    // let percentLoaded = (fileInfo.wrote / fileInfo.size) * 100;
    // console.log('Loading: ' + percentLoaded);
  });

  uploader.on('complete', (fileInfo) => {
    console.log('Upload completed');
    handleFileUpload(socket, fileInfo);


    console.log(fileInfo);
  });

  uploader.on('error', (err) => {
    console.log('Error!', err);
  });

  uploader.on('abort', (fileInfo) => {
    console.log('Aborted: ', fileInfo);
  });

}

function onAuthorizeSuccess(data, accept) {

  console.log('successful connection to socket.io');
  accept();
}

function onAuthorizeFail(data, message, error, accept) {

  console.log('Fail to authenticate socket: ' + message);
  // if(error)  throw new Error(message);

  if (error)
    console.log(message);

  return accept(new Error(message));
}

function addRoom(socket) {

  console.log(socket.request.user);
  let roomId = getMyRoomId(socket.request.user);
  socket.join(roomId);
  if (rooms.indexOf(roomId) === -1) {
    rooms.push(roomId);
  }
  console.log('user ' + roomId + ' had joined room');
}


function handleReceiveMessage(socket, data) {

  if (!socket.request.user.expert_id || !socket.request.user.user_id) {
    reloadSession(socket.request.sessionID, (err, session) => {
      if (session && session.passport && session.passport.user) {
        socket.request.user = session.passport.user;
      }
      saveAndSendMessage(socket, data);
    });
  } else {
    saveAndSendMessage(socket, data);
  }
}

function handleFileUpload(socket, file) {

  if (!socket.request.user.expert_id || !socket.request.user.user_id) {
    reloadSession(socket.request.sessionID, (err, session) => {
      if (session && session.passport && session.passport.user) {
        socket.request.user = session.passport.user;
      }
      receiveFile(socket, file);
    });
  } else {
    receiveFile(socket, file);
  }
}

function receiveFile(socket, file) {

  let now = new Date();
  let urls = [];
  let data = {
    text: null,
    media: {
      urls: [file.name],
      description: ''
    },
    type: global.constant.type.media,
    time: now,
    status: global.constant.sent_status.sending,
    clientId: now
  };

  // saveAndSendMessage(socket, data);\
  // to do

}

function handleUpdateAllMessageStatus(socket, data) {

  if (!socket.request.user.expert_id || !socket.request.user.user_id) {
    reloadSession(socket.request.sessionID, (err, session) => {
      if (session && session.passport && session.passport.user) {
        socket.request.user = session.passport.user;
      }
      updateAllMessageStatus(socket, data);
    });
  }
}

function updateAllMessageStatus(socket, data) {
  let socketSession = socket.request.user;
  let partnerRoomId = getPartnerRoomId(socketSession);
  let myId = getSenderId(socketSession);
  let userId = socketSession.user_id;
  let expertId = socketSession.expert_id;

  if (data.receiver_id === partnerRoomId) {

    Message.findOne({
      'user_id': userId,
      'expert_id': expertId
    }, (err, message) => {

      if (err) {
        return;
      }

      let isChange = false;
      let contents = [];
      try {
        contents = message.contents;
      }
      catch(err){}
      if (contents.length > 0) {
        for (let i = 0; i < contents.length; i++) {

          if (contents[i].status !== global.constant.sent_status.seen && contents[i].status !== global.constant.sent_status.fail) {
            contents[i].status = global.constant.sent_status.seen;
            isChange = true;
          }
        }
      }
      if (isChange) {
        message.save(err => {
          if (err) {
            return;
          }

          let updateData = {
            senderId: myId,
            status: global.constant.sent_status.seen
          };
          io.to(partnerRoomId).emit(global.constant.socket_event.update_all_message_status, updateData);

        });
      }
    });
  }
}

// save data
function saveAndSendMessage(socket, data) {

  if (data.type === global.constant.type.text) {
    if (!data.text || data.text.trim() === '') {
      handleError(socket, data.clientId, 'text empty');
      return;
    }
  }

  let socketSession = socket.request.user;
  let senderId = getSenderId(socketSession);
  Message.findOne({
    'user_id': socketSession.user_id,
    'expert_id': socketSession.expert_id

  }, function (err, message) {

    if (err) {
      handleError(socket, data.clientId, err);
      return;
    }

    let now = new Date();
    let content = {
      text: data.text,
      media: data.media,
      type: data.type,
      sender_id: senderId,
      status: constant.sent_status.sent,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };

    if (message) {
      message.last_message_at = now;
      message.contents.push(content);
      message.save(function (err) {

        if (err) {
          handleError(socket, data.clientId, err);
          return;
        }

        let newMsgId = message.contents[message.contents.length - 1].id;
        sendMessage(socket, data, newMsgId);
      });

    } else {
      let newMessage = new Message({

        user_id: socketSession.user_id,
        expert_id: socketSession.expert_id,
        contents: [{
          text: data.text,
          media: data.media,
          type: data.type,
          sender_id: senderId,
          status: constant.sent_status.sent,
          created_at: now,
          updated_at: now,
          deleted_at: null
        }],
        last_message_at: now
      });

      newMessage.save(function (err) {
        if (err) {
          handleError(socket, data.clientId, err);
          return;
        }
        sendMessage(socket, data, newMessage.contents[0].id);
      });
    }
  });

}

function sendMessage(socket, data, msgId) {

  let socketSession = socket.request.user;
  let partnerRoomId = getPartnerRoomId(socketSession);
  let myRoomId = getMyRoomId(socketSession);

  data.senderId = getSenderId(socketSession);
  data.messageId = msgId;
  data.senderRole = socketSession.account.role;
  data.senderName = socketSession.account.name;

  // check partner online or not, after then send to all partner
  if (rooms.indexOf(partnerRoomId) !== -1) {
    io.to(partnerRoomId).emit(constant.socket_event.message_from_server, data);
  }

  // send to all sender except me (tab sender)
  socket.broadcast.to(myRoomId).emit(constant.socket_event.message_from_server, data);

  // update status to all sender with status sent
  let updateStatusData = {
    clientId: data.clientId,
    status: constant.sent_status.sent
  };
  updateMessageStatusForClient(myRoomId, updateStatusData);

  sendMail(socketSession);
}

function updateMessageStatusForClient(roomId, updateStatusData) {

  io.to(roomId).emit(constant.socket_event.update_message_status_from_server, updateStatusData);
}

function handleError(socket, clientId, err) {

  console.log(err);
  let myRoomId = getMyRoomId(socket.request.user);
  let updateStatusData = {
    clientId: clientId,
    status: constant.sent_status.fail
  };
  updateMessageStatusForClient(myRoomId, updateStatusData);
}

function handleUpdateMessageStatus(socket, dataStatusFromClient) {

  let socketSession = socket.request.user;
  let roomId = getPartnerRoomId(socketSession);
  let userId = socketSession.user_id;
  let expertId = socketSession.expert_id;
  let messageId = dataStatusFromClient.messageId;
  let status = constant.sent_status.seen;

  let updateStatusData = {
    clientId: dataStatusFromClient.clientId,
    status: status
  };

  updateMessageStatusForClient(roomId, updateStatusData);

  updateMsgStatusDb(userId, expertId, messageId, status);
}

function updateMsgStatusDb(userId, expertId, msgId, status) {

  console.log('update message status in database: ' + msgId + ',' + status);
  Message.update(
    {'contents._id': msgId},
    {'$set': {'contents.$.status': status}},
    function (err) {
      if (err)
        console.log("can't not update read status: " + err);
      else
        console.log('update successful status');
    }
  );
}

function sendMail(socketSession) {

  let receiverId = getReceiverId(socketSession);
  let mailSubject = getMailSubject();
  let chatUrl = global.constant.host + '/user-chat/';
  let mailFrom = process.env.MAIL_FROM;
  let mailText;

  if (socketSession.account.role === global.constant.role.user_role) {
    Expert.findById(receiverId, (err, expert) => {
      if (err) {
        console.log(err);
        return;
      }
      if (expert) {
        let receiverEmail = expert.account.email;
        if (receiverEmail && receiverEmail !== '') {
          mailSubject = getMailSubject();
          chatUrl = global.constant.host + '/#/user-chat';
          mailText = getMailText(expert.account.name, chatUrl);
          mailSender.sendMail(mailFrom,receiverEmail ,mailSubject, mailText,'');
        } else {
          console.log('Expert not have email');
        }
      }
    }).populate('account');

  } else {
    User.findById(receiverId, (err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      if (user) {
        let receiverEmail = user.account.email;
        if (receiverEmail && receiverEmail !== '') {
          mailSubject = getMailSubject();
          chatUrl = global.constant.host + '/#/user-chat';
          mailText = getMailText(user.account.name, chatUrl);
          mailSender.sendMail(mailFrom,receiverEmail ,mailSubject, mailText,'');
        } else {
          console.log('User not have email');
        }
      }
    }).populate('account');
  }
}

function getMyRoomId(socketSession) {
  return socketSession.account.role === constant.role.user_role ? socketSession.user_id : socketSession.expert_id;
}

function getPartnerRoomId(socketSession) {
  return socketSession.account.role === constant.role.user_role ? socketSession.expert_id : socketSession.user_id;
}

function getSenderId(socketSession) {
  return socketSession.account.role === constant.role.user_role ? socketSession.user_id : socketSession.expert_id;
}

function getReceiverId(socketSession) {
  return socketSession.account.role === constant.role.user_role ? socketSession.expert_id : socketSession.user_id;
}

function reloadSession(sessionID, callback) {
  helpers.sessionStore.load(sessionID, callback);
}

function getMailText(receiverName, chatUrl) {
  let mailText =
    `${receiverName} 様
     送信ユーザー名“様からメッセージを受信しました。
     ${chatUrl}
        
     --------------------------------------------
        
     Premium
     ${chatUrl}`;

  return mailText;
}

function getMailSubject() {
  return 'Premium メッセージ受信のお知らせ';
}