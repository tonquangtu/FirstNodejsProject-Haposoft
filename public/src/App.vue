<template>
  <div>
    <site-header @login="login"></site-header>
    <user-login v-if="showLogin" @close="showLogin = false"></user-login>
    <router-view></router-view>
    <site-footer></site-footer>
  </div>
</template>

<script>
  import Footer from './components/includes/Footer.vue'
  import Header from './components/includes/Header.vue'
  import Login from './components/includes/Login.vue'
  import {EventBus} from './event-bus'
  import {custom} from './mixins/custom';

  export default {
    mixins: [custom],
    components: {
      'site-footer': Footer,
      'site-header': Header,
      'user-login': Login
    },
    data() {
      return {
        showLogin: false,
        showHeader: true,
        showFooter: true,
        tabFocused: true
      }
    },
    methods: {
      login() {
        this.showLogin = true;
      },

      initSocket() {
        if (!window.socket) {
          window.socket = io.connect(window.constant.host);
          window.uploader = new SocketIOFileClient(window.socket);
          this.registerSocketEvent();
        }
      },

      registerSocketEvent() {
        window.socket.on(window.constant.socket_event.message_from_server, (data) => {
          console.log('message from server : ' + data);
          this.receiveNewMessage(data);
        });

        window.socket.on(window.constant.socket_event.update_message_status_from_server, (data) => {
          console.log('update_message_status_from_server: ' + data);
          this.updateMessageStatusLocal(data);
        });

        window.socket.on(window.constant.socket_event.update_all_message_status, (data) => {
          console.log('update all status');
          this.updateAllMessageStatus(data);
        });
      },

      receiveNewMessage(data) {
        this.$store.commit('processNewMessage', data);
        if (this.tabFocused) {
          this.handleUpdateMessageStatusToPartner();
        }
      },

      handleUpdateMessageStatusToPartner() {

        let receivedMessages = this.$store.state.receivedMessages;
        let length = receivedMessages.length;
        if (length > 0) {
          for (let i = 0; i < length; i++) {
            this.updateMessageStatusToPartner(receivedMessages[i]);
          }
          this.$store.commit('resetReceivedMessages');
        }
      },

      updateMessageStatusToPartner(data) {

        let updateStatusData = {
          receiverId: data.senderId,
          messageId: data.messageId,
          clientId: data.clientId
        };
        window.socket.emit('notify_received_message', updateStatusData);
      },

      updateMessageStatusLocal(data) {
        this.$store.commit('updateMessageStatusLocal', data);
      },

      updateAllMessageStatus(data) {
        this.$store.commit('updateAllMessageStatus', data);
      },

      listenTabFocus() {
        $(window).focus(() => {
          this.tabFocused = true;
          this.handleUpdateMessageStatusToPartner();
        });
        
        $(window).blur(() => {
          this.tabFocused = false;
        });
      }
    },

    mounted() {
      EventBus.$on(window.constant.bus_events.init_socket, () => {
        this.initSocket();
        this.listenTabFocus();
      });

      EventBus.$on(window.constant.bus_events.remove_socket, () => {
        window.socket = null;
      })
    }


  }
</script>