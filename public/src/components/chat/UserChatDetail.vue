<template>
    <div class="main-container">
        <div class="main-container signed">
            <div v-if="showAlert" class="prm-alert">
                <div class="container">
                    <p>メッセージ受信を通知するため、メールアドレスを登録しましょう。</p>
                    <i class="ti-close" @click="closeAlert()"></i>
                </div>
            </div>
            <section class="prm-profile">
                <div class="profile-detail clearfix">
                    <div class="container">
                        <div class="avatar">
                            <img :src="expertAvatar" alt="">
                        </div>
                        <div class="content">
                            <h3 class="name">{{expertName}}</h3>
                            <h4 class="position"><i class="ti-tag"></i>{{expertOccupation}}</h4>
                            <p class="group-label">
                                <span>{{expertOccupationType}}</span>
                                <span @click="showExpertProfile()">プロフィール<i class="ti-plus"></i></span>
                            <p v-if="isShowExpertProfile">{{expertProfile}}</p>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="group-social">
                    <div class="container">
                        <ul class="clearfix">
                            <li class="twitter"><a href="#"><i class="ti-twitter"></i></a></li>
                            <li class="count-likes" @click="likeExpert()">
                                <span>{{expertLike}} Likes</span>
                                <i class="ti-heart" v-bind:class="{'red-heart': isLike}"></i>
                            </li>
                            <li class="count-mail">
                                <span>1,000円 / 1通</span>
                                <i class="ti-email"></i>
                            </li>
                            <li class="count-ratting" onclick="showReview()">
                                <span>{{expertRate}}レビュー</span>
                                <i class="ti-star"></i>
                            </li>
                        </ul>
                    </div>
                </div>
                <messages></messages>
            </section>
            <div id="show-review">
                <div class="review-content">
                    <i class="ti-close" onclick="this.parentElement.parentElement.classList.remove('active')"></i>
                    <h3 class="title">レビュー</h3>
                    <h4 class="total-view">23 レビュー</h4>
                    <div class="averaged-ratting">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star-o"></i>
                    </div>
                    <ul class="review-statistical">
                        <li>
                            <div class="list-star">
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0"
                                     aria-valuemax="100"
                                     style="width: 70%;">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="list-star">
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0"
                                     aria-valuemax="100"
                                     style="width: 20%;">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="list-star">
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0"
                                     aria-valuemax="100"
                                     style="width: 20%;">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="list-star">
                                <i class="fa fa-star-o"></i>
                                <i class="fa fa-star-o"></i>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                                     aria-valuemax="100"
                                     style="width: 0%;">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="list-star">
                                <i class="fa fa-star-o"></i>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0"
                                     aria-valuemax="100"
                                     style="width: 0%;">
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="your-review text-center">
                        <p>レビューする</p>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="global-btn style-02">送信する</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Messages from './Messages.vue';
  import Notifications from './Notifications';
  import Header from '../includes/Header.vue';
  import {post} from '../../helpers/request';
  import {get} from '../../helpers/request';

  export default {

    data() {
      return {
        expertName: '',
        expertAvatar: '',
        expertLike: this.$store.state.expertLike,
        expertRate: this.$store.state.expertRate,
        alertMessage: this.$store.state.alertMessage,
        expertProfile: this.$store.state.expertProfile,
        expertOccupation: this.$store.state.expertOccupation,
        expertOccupationType: this.$store.state.expertOccupationType,
        isShowExpertProfile: false,
        isLike: '',
      }
    },

    created() {
      get(`/users/expert-like-check?user_id=${this.$store.state.myId}&expert_id=${this.$store.state.receiverId}`)
        .then(response => {
          if (response !== null)
            this.isLike = response.data.like;
        }).catch(err => {
      })

      if (this.$store.state.role === window.constant.role.user_role) {
        this.expertName = this.$store.state.receiverName;
        this.expertAvatar = this.$store.state.receiverAvatar;
      } else {
        this.expertName = this.$store.state.myName;
        this.expertAvatar = this.$store.state.myAvatar;
      }
    },

    methods: {
      closeAlert() {
        this.$store.commit('updateAlertMessage', null);
      },

      showExpertProfile() {
        this.isShowExpertProfile = !this.isShowExpertProfile;
      },

      likeExpert() {
        this.isLike = !this.isLike;
        post('/users/like-expert', {
          user_id: this.$store.state.myId,
          expert_id: this.$store.state.receiverId,
          like: this.isLike
        }).then(response => {
          console.log(response);
          this.$store.state.expertLike = response.data.likes;
          this.expertLike = response.data.likes;
        }).catch(err => {
          this.isLike = !this.isLike;
          console.log(err);
        })
      }

    },

    computed: {
      showAlert: function () {
        return this.$store.state.showAlertMessage;
      }
    },

    components: {
      'messages': Messages,
      'notifications': Notifications
    }
  }

</script>

