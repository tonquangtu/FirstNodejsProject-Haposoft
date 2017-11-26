<template>
    <div>
        <a href="#" class="notification" @click.prevent="viewNotifications()">
            <i class="ti-bell"></i>
            <span v-if="$store.state.haveNewNotification"></span>
        </a>
        <!---->
        <ul id="list-notification" :class="activeNotification" style="overflow-y: scroll; height:200px;">
            <li v-for="notification in $store.state.notifications"
                @click.prevent="showDetailNotification(notification)">
                <a href="#">
                    <i class="noti-detail">{{notification.partnerName}}</i>
                    <!--<span class="time"></span>-->
                    <timeago class="time" :since="notification.lastMessageAt" :maxtime="86400 * 365"
                             :auto-update="60 * 30"></timeago>
                </a>
            </li>
            <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" v-if="activeNotification === 'active'">
                <span slot="no-more">
                  専門家はこれ以上見つかりません。
                </span>
            </infinite-loading>
        </ul>

    </div>
</template>

<script>
  import {post} from '../../helpers/request'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {

    components: {
      'infinite-loading': InfiniteLoading
    },

    data() {
      return {
        activeNotification: null,
        nomore: false
      }
    },

    methods: {

      viewNotifications() {
        if (this.$store.state.isLogin) {
          this.$store.commit('changeNotificationStatus', false);
          if (!this.activeNotification) {
            this.activeNotification = 'active';
          } else {
            this.activeNotification = null;
          }
//          if (this.$store.state.isLogin && this.$store.state.notifications.length === 0) {
////          this.fetchNotifications();
//          }
        }
      },

      showDetailNotification(notification) {

        let url = window.constant.routes.update_partner;
        let data = {
          'partner_id': notification.partnerId,
          'partner_role': notification.partnerRole
        };

        post(url, data).then(response => {

          let partner = response.data.data;
          let receiver = {
            receiverId: partner.partnerId,
            receiverName: partner.partnerName,
            receiverAvatar: partner.partnerAvatar,
            receiverEmail: partner.partnerEmail
          };
          this.$store.commit('updateReceiverData', receiver);
          this.$store.commit('resetMessages');
          if (partner.partnerRole === window.constant.role.expert_role) {
            let expertInfo = {
              expertTitle: partner.expertTitle,
              expertSubTitle: partner.expertSubTitle,
              expertOccupation: partner.expertOccupation,
              expertOccupationType: partner.expertOccupationType,
              expertLike: partner.expertLike,
              expertRate: partner.expertRate
            };
            this.$store.commit('updateExpertInfo', expertInfo);
          }
          this.$router.push({name: 'user_chat'});
        }).catch(err => {
          console.log('show detail notification error: ' + err);
        });
      },

      onInfinite() {
        if (this.$store.state.isLogin) {
          if (!this.nomore) {
            setTimeout(() => {
              this.fetchNotifications();
            }, 1000);

          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
        } else {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
        }
      },

      fetchNotifications() {

        let lastNotificationAt = -1;
        let length = this.$store.state.notifications.length;
        if (length > 0) {
          lastNotificationAt = this.$store.state.notifications[length - 1].lastMessageAt;
        }
        let url = window.constant.routes.load_notifications;
        let data = {'last_notification_at': lastNotificationAt};
        post(url, data).then((response) => {
          this.$store.commit('addNotifications', response.data.data);
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          this.nomore = response.data.data.length === 0;

        }).catch(err => {
          console.log('error to load notification: ' + err);
        });
      }
    }
  }


</script>