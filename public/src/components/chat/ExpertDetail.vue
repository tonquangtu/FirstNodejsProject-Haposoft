<template>
    <div class="main-container">
        <section class="prm-profile">
            <div class="profile-detail clearfix">
                <div class="container">
                    <div class="avatar">
                        <img :src="expert.account.avatar_url" alt="">
                    </div>
                    <div class="content">
                        <h3 class="name">{{expert.account.name}}</h3>
                        <h4 class="position"><i class="ti-tag"></i>{{expert.occupation_type}}</h4>
                        <p class="group-label">
                            <span>{{expert.occupation}}</span>
                            <span>プロフィール</span>
                            <button><i class="ti-plus"></i></button>
                        </p>
                    </div>
                </div>
            </div>
            <div class="group-social ">
                <div class="container">
                    <ul class="clearfix">
                        <li class="twitter"><a href="#"><i class="ti-twitter"></i></a></li>
                        <li class="count-likes">
                            <span>{{expert.like}} Likes</span>
                            <i class="ti-heart"></i>
                        </li>
                        <li class="count-mail">
                            <span>1,000円 / 1通</span>
                            <i class="ti-email"></i>
                        </li>
                        <li class="count-ratting">
                            <span>{{expert.rate}}レビュー</span>
                            <i class="ti-star"></i>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="chat-area">
                <div class="container">
                    <ul>
                        <li class="host clearfix">
                            <div class="avatar">
                                <img :src="expert.account.avatar_url" alt="">
                            </div>
                            <div class="chat-detail">
                                <p>{{expert.title}}</p>
                                <a @click="showSubTitle()">注意事項<i class="ti-plus"></i></a>
                                <p v-if="subTitle">
                                  {{expert.sub_title}}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <div class="text-center margin-top-50">
            <a  id="login" class="global-btn style-02" @click.prevent="showLoginLayout()" href="#">サインイン</a>

            <user-login v-if="showLogin" @close="showLogin = false"></user-login>
        </div>

    </div>
</template>

<script>

import Login from '../includes/Login.vue'
import {get} from '../../helpers/request';

export default {

  components: {
    'user-login': Login
  },

  data() {
    return {
      showLogin: false,
      expert: '',
      subTitle: false
    }
  },

  methods: {
    showLoginLayout() {
      this.showLogin = true;
    },

    showSubTitle() {
      this.subTitle = !this.subTitle;
    }
  },

  created() {
    get('/users/current-expert')
      .then(response => {
        this.expert = response.data
      }).catch( err => {
        this.errors.push(err);
      });
  },

  computed: {
    path: function() {
      return this.$route.path;
    }
  }
}

</script>
