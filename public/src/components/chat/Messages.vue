<template>
    <div class="chat-area" id="chat-area" v-on:scroll="onScrollMessages()">
        <ul id="list-message">
            <!--<infinite-loading v-if="showInfiniteLoading" :direction="top" :on-infinite="onInfinite"-->
            <!--ref="infiniteLoading"></infinite-loading>-->

            <li v-for="(content, index) in contents" :class="[content.layoutType, 'clearfix']">
                <div class="avatar">
                    <img :src="content.avatar_url" alt="">
                </div>
                <div class="chat-detail">

                    <p v-if="content.type === textType">{{content.text}}</p>
                    <p v-if="content.type === mediaType">{{content.media.description}}</p>
                    <a href="#">注意事項</a>

                    <ul v-if="content.type === mediaType" class="list-img">
                        <li v-for="url in content.media.urls"><img :src="url" alt=""></li>
                    </ul>

                    <footer v-if="content.type === textType && content.from != 'expert_title'"
                            class="status-chat clearfix">
                        <!--<span class="pull-left">{{msgDetail.date}} {{msgDetail.time}}</span>-->
                        <timeago class="pull-left" :since="content.time" :maxtime="86400 * 365 * 10"
                                 :auto-update="60 * 30"></timeago>
                        <span v-if="content.from === 'me'" class="pull-right">{{content.status}}</span>
                    </footer>

                </div>
            </li>
        </ul>
        <div class="input-area">
            <button class="add-image" @click="uploadImages()"><i class="ti-plus"></i></button>
            <input v-model="newInput" type="text " placeholder="コメント" id="input-text">
            <button class="submit-chat" @click="addTextMessage()">送信</button>
        </div>

        <form id="form-upload" style="display: none">
            <input type="file" id="file-chooser" multiple/>
            <input type="submit" value="upload" id="file-chooser-submit"/>
        </form>
    </div>
</template>

<script>

  import {post} from '../../helpers/request';

  export default {

    data() {
      return {
        newInput: '',
        contents: [],
        myId: '',
        myName: '',
        myAvatar: '',
        receiverId: '',
        receiverName: '',
        receiverAvatar: '',
        expertTitle: '',
        role: '',
        textType: window.constant.message_type.text,
        mediaType: window.constant.message_type.media,
        isSeenAllMessage: false,
        tabFocused: true,
        isHaveHistory: true,
        loadingHistory: false,
        pagingHistory: 0
      }
    },

    created() {
      this.listenTabFocus();
    },

    methods: {

      init() {
        let state = this.$store.state;
        this.myId = state.myId;
        this.myName = state.myName;
        this.myAvatar = state.myAvatar;

        this.receiverId = state.receiverId;
        this.receiverName = state.receiverName;
        this.receiverAvatar = state.receiverAvatar;
        this.role = state.role;
        this.expertTitle = state.expertTitle;
        this.contents = state.addedMessages;

        this.setup();
      },

      setup() {
        this.loadChatHistories();
        this.listenUploadFile();
      },

      addTextMessage() {
        let newInput = this.newInput;
        if (newInput && newInput.trim() !== '') {
          let newMessage = {
            senderAvatar: this.myAvatar,
            senderRole: this.role,
            text: newInput.trim(),
            media: {},
            type: this.textType,
            time: new Date(),
            status: window.constant.sent_status.sending,
            from: window.constant.message_source.me,
            clientId: new Date().getTime()
          };
          this.$store.commit('addMessageToLayout', newMessage);
          this.sendMessage(newInput, newMessage.clientId);
        }
        this.newInput = '';
      },

      sendMessage(text, clientId) {

        let data = {
          text: text,
          media: {},
          type: this.textType,
          clientId: clientId
        };
        if (window.socket) {
          window.socket.emit('message_from_client', data);

        } else {
          let updateStatusData = {
            status: window.constant.sent_status.fail,
            clientId: clientId
          };
          this.$store.commit('updateMessageStatusLocal', updateStatusData);
        }
      },

      seenAllMessages() {
        this.isSeenAllMessage = true;
        let data = {
          receiver_id: this.$store.state.receiverId
        };
        window.socket.emit(window.constant.socket_event.seen_all_messages, data);
      },

      loadChatHistories() {

        this.loadingHistory = true;
        this.isSeenAllMessage = false;
        let url = window.constant.routes.load_histories;
        let data = {'paging_history': this.pagingHistory};

        post(url, data).then(response => {

          let results = response.data.data.data;
          this.pagingHistory = response.data.data.next;
          let length = results.length;
          for (let i = 0; i < length; i++) {

            let content = results[i];
            if (content.from === window.constant.message_source.me) {
              content.senderAvatar = this.myAvatar;
            } else {
              content.senderAvatar = this.receiverAvatar;
            }
            content.clientId = new Date(content.time).getTime();
            this.$store.commit('addMessageToTopLayout', content);
          }

          setTimeout(() => {
            this.scrollToBottom('chat-area', length);
          });

          if (this.tabFocused) {
            this.seenAllMessages();
          }

          if (this.pagingHistory < 0) {
            this.isHaveHistory = false;
            this.addExpertTitleToLayout();
          }

          this.updateLoadingHistoryStatus(false);
          console.log('load chat history success');

        }).catch(err => {

          if (err.response.status === 404) {
            this.isHaveHistory = false;
            if (!this.contents || this.contents.length === 0 || this.contents[0].from !== window.constant.message_source.expert_title) {
              this.addExpertTitleToLayout();
            }
          }
          this.updateLoadingHistoryStatus(false);
        });
      },

      onScrollMessages() {

        let scrollTop = document.getElementById('chat-area').scrollTop;
        let threshold = 100;
        if (scrollTop < threshold) {
          if (this.isHaveHistory && !this.loadingHistory) {
            console.log('load history scroll');
            this.loadChatHistories();
          }
        }
      },

      scrollToBottom(id, numItem) {

        let itemLength = 100;
        let element = document.getElementById(id);
        let to = itemLength * numItem;
//        element.scrollTop = element.scrollHeight - element.clientHeight;
        element.scrollTop = to;
//        this.animationScroll(element, to, 100);
      },

      updateLoadingHistoryStatus(status) {
        if (status) {
          this.loadingHistory = true;
        } else {
          setTimeout(() => {
            this.loadingHistory = false;
          }, 1000);
        }
      },

      addExpertTitleToLayout() {
        let expertTitleObject = {
          senderAvatar: this.role === window.constant.role.user_role ? this.receiverAvatar : this.myAvatar,
          from: window.constant.message_source.expert_title,
          text: this.expertTitle,
          media: {},
          type: window.constant.message_type.text,
          time: -1,
          status: window.constant.sent_status.seen,
          senderRole: window.constant.role.expert_role
        };
        this.$store.commit('addMessageToTopLayout', expertTitleObject);
      },

      listenTabFocus() {
        $(window).focus(() => {
          this.tabFocused = true;
          if (!this.isSeenAllMessage) {
            this.seenAllMessages();
          }
        });

        $(window).blur(() => {
          this.tabFocused = false;
        });
      },

      uploadImages() {
        let fileChooser = document.getElementById('file-chooser');
        fileChooser.click();
      },

      listenUploadFile() {
        let formUpload = document.getElementById('form-upload');
        let fileChooser = document.getElementById('file-chooser');
        let fileChooserSubmit = document.getElementById('file-chooser-submit');

        window.uploader.on('start', (fileInfo) => {
          console.log('Start uploading', fileInfo);

        });

        window.uploader.on('stream', (fileInfo) => {
          let percentSent = (fileInfo.sent / fileInfo.size) * 100;
          console.log('Streaming... sent: ' + percentSent);
        });

        window.uploader.on('complete', (fileInfo) => {
          console.log('Upload complete', fileInfo);
        });

        window.uploader.on('error', (err) => {
          console.log('Error!', err);
        });
        window.uploader.on('abort', (fileInfo) => {
          console.log('Aborted: ', fileInfo);
        });

        formUpload.onsubmit = (ev) => {
          ev.preventDefault();
          console.log('on submit form');
          window.uploader.upload(fileChooser);
        };

        fileChooser.onchange = () => {
          console.log('file chooser on change');
          if (this.checkFileUpload(fileChooser)) {

            fileChooserSubmit.click();
            this.addMediaMessage(fileChooser.files);
          } else {
            console.log('Have not enough condition to upload file');
          }
        }
      },

      checkFileUpload(fileChooser) {

        let check = false;
        let maxSizePerFile = window.constant.upload.MAX_SIZE_PER_IMAGE * 1024 * 1024;
        let acceptanceTypes = window.constant.upload.file_types;

        if (fileChooser.files.length > 0) {

          let numFile = fileChooser.files.length;
          let files = fileChooser.files;
          for (let i = 0; i < numFile; i++) {
            if (files[i].size > maxSizePerFile || acceptanceTypes.indexOf(files[i].type) === -1) {
              return false;
            }
          }
          check = true;
        }

        return check;
      },

      addMediaMessage(files) {

        let urls = [];
        let defaultUrl = window.constant.upload.default_url;
        for (let i = 0; i < files.length; i++) {
          urls.push(defaultUrl);
        }
        let newMessage = {
          senderAvatar: this.myAvatar,
          senderRole: this.role,
          text: null,
          media: {
            urls: urls,
            description: ''
          },
          type: this.mediaType,
          time: new Date(),
          status: window.constant.sent_status.sending,
          from: window.constant.message_source.me,
          clientId: new Date().getTime()
        };
        this.$store.commit('addMessageToLayout', newMessage);
      }
    },

    mounted() {

      if (this.$store.state.isLogin) {
        this.init();
      }
    }
  }

</script>