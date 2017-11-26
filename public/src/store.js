import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    isLogin: false,
    myId: null,
    myName: null,
    myAvatar: null,
    myEmail: null,
    role: null,
    myProfile: null,

    receiverId: null,
    receiverName: null,
    receiverAvatar: null,
    receiverEmail: null,

    expertTitle: null,
    expertSubTitle: null,
    expertOccupation: null,
    expertOccupationType: null,
    expertLike: null,
    expertProfile: null,
    expertRate: null,

    addedMessages: [],
    receivedMessages: [],
    notifications: [],
    haveNewNotification: false,
    showAlertMessage: null
  },

  plugins: [createPersistedState()],

  mutations: {

    resetData(state) {
      state.isLogin = false;
      state.myId = null;
      state.myName = null;
      state.myAvatar = null;
      state.role = null;
      state.myEmail = null;
      state.myProfile = null;
      state.receiverId = null;
      state.receiverName = null;
      state.receiverAvatar = null;
      state.receiverEmail = null;

      state.expertTitle = null;
      state.expertSubTitle = null;
      state.expertOccupation = null;
      state.expertOccupationType = null;
      state.expertLike = null;
      state.expertRate = null;
      state.expertProfile = null;

      state.addedMessages = [];
      state.receivedMessages = [];
      state.notifications = [];
      state.showAlertMessage = null;
      state.haveNewNotification = false;
    },

    login(state, loginData) {
      state.isLogin = true;
      state.myId = loginData.myId;
      state.myName = loginData.myName;
      state.myProfile = loginData.myhProfile;
      state.myAvatar = loginData.myAvatar;
      state.role = loginData.role;
      state.myEmail = loginData.myEmail;
    },

    updateReceiverData(state, receiverData) {
      console.log('store: updateReceiverData: ' + receiverData.receiverId);
      state.receiverId = receiverData.receiverId;
      state.receiverName = receiverData.receiverName;
      state.receiverAvatar = receiverData.receiverAvatar;
      state.receiverEmail = receiverData.receiverEmail;
    },

    updateProfile(state, profile) {
      state.myName = profile.name;
      state.myEmail = profile.email;
      state.myProfile = profile.profile;
    },

    updateExpertTitle(state, expertTitle) {
      state.expertTitle = expertTitle;
    },

    updateExpertInfo(state, expert) {
      state.expertTitle = expert.expertTitle;
      state.expertSubTitle = expert.expertSubTitle;
      state.expertOccupation = expert.expertOccupation;
      state.expertOccupationType = expert.expertOccupationType;
      state.expertLike = expert.expertLike;
      state.expertRate = expert.expertRate;
      state.expertProfile = expert.expertProfile;
    },

    updateRole(state, role) {
      state.role = role;
    },

    logout(state) {
      resetData(state);
    },

    resetReceivedMessages(state) {
      state.receivedMessages = [];
    },

    addNotifications(state, addNotifications) {
      if (addNotifications) {
        console.log('length notification: ' + addNotifications.length);
        for (let i = 0; i < addNotifications.length; i++) {
          state.notifications.push(addNotifications[i]);
        }
      }
    },

    receiveNewNotification(state, notification) {
      if (notification) {
        let length = state.notifications.length;
        for (let i = 0; i < length; i++) {
          if (notification.partnerId === state.notifications[i].partnerId) {
            state.notifications.splice(i, 1);
            break;
          }
        }
        state.notifications.unshift(notification);
        this.commit('changeNotificationStatus', true);
      }
    },

    updateAlertMessage(state, isShowAlert) {
      state.showAlertMessage = isShowAlert;
    },

    changeNotificationStatus(state, status) {
      state.haveNewNotification = status;
    },

    processNewMessage(state, data) {

      data.time = new Date();
      if (data.senderId == state.myId) {
        data.from = window.constant.message_source.me;
        data.status = window.constant.sent_status.sending;
        data.senderAvatar = state.myAvatar;
      } else {
        data.from = window.constant.message_source.from_partner;
        data.status = window.constant.sent_status.seen;
        data.senderAvatar = state.receiverAvatar;
      }

      if (state.route.path === window.constant.routes.user_chat) {
        if (data.senderId == state.myId) {
          this.commit('addMessageToLayout', data);

        } else  {
          if (!state.myEmail || state.myEmail === '') {
            state.showAlertMessage = true;
          }
          if (data.senderId == state.receiverId) {
            this.commit('addMessageToLayout', data);
            state.receivedMessages.push(data);
          } else {
            let notification = {
              partnerId: data.senderId,
              partnerName: data.senderName,
              partnerRole: data.senderRole,
              lastMessageAt: data.time
            };
            this.commit('receiveNewNotification', notification);
          }
        }

      } else if (data.senderId != state.myId) {
        let notification = {
          partnerId: data.senderId,
          partnerName: data.senderName,
          partnerRole: data.senderRole,
          lastMessageAt: data.time
        };
        this.commit('receiveNewNotification', notification);
        // state.notifications.push(notification);
      }
    },

    addMessageToLayout(state, data) {
      let newContent = {
        avatar_url: data.senderAvatar,
        layoutType: (data.senderRole === window.constant.role.user_role ? 'client' : 'host'),
        text: data.text,
        media: data.media,
        type: data.type,
        time: data.time,
        status: data.status,
        from: data.from,
        clientId: data.clientId
      };
      state.addedMessages.push(newContent);
    },

    addMessageToTopLayout(state, data) {
      let newContent = {
        avatar_url: data.senderAvatar,
        layoutType: (data.senderRole === window.constant.role.user_role ? 'client' : 'host'),
        text: data.text,
        media: data.media,
        type: data.type,
        time: data.time,
        status: data.status,
        from: data.from,
        clientId: data.clientId
      };
      state.addedMessages.unshift(newContent);
    },

    updateMessageStatusLocal(state, data) {

      let length = state.addedMessages.length;
      for (let i = 0; i < length; i++) {
        let content = state.addedMessages[i];
        if (content && content.from === window.constant.message_source.me) {
          if (content.clientId === data.clientId) {
            content.status = data.status;
            console.log('status: ' + data.status);
          }
        }
      }
    },

    updateAllMessageStatus(state, data) {

      if (state.receiverId === data.senderId) {

        let length = state.addedMessages.length;
        for (let i = 0; i < length; i++) {
          if (state.addedMessages[i].from === window.constant.message_source.me &&
            state.addedMessages[i].status !== window.constant.sent_status.seen &&
            state.addedMessages[i].status !== window.constant.sent_status.fail) {

            state.addedMessages[i].status = data.status;
          }
        }
      }
    },

    resetMessages(state) {
      state.addedMessages = [];
      state.receivedMessages = [];
    },

  }


});
