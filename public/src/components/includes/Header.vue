<template>
    <header class="prm-main-header clearfix">
        <div class="main-menu hidden-sm hidden-md hidden-lg menu-user">
            <button id="show-menu" class="toggle-menu" @click="showMenu">
                <span></span>
                <span></span>
                <span></span>
                <i class="ti-close"></i>
            </button>
            <div id="sub-menu" class="sub-menu">
                <div class="search-header">
                    <input type="text">
                    <i class="ti-search"></i>
                </div>
            </div>
        </div>
        <h1 class="main-logo">
            <a href="#"><img src="images/Premi-um.svg" alt=""></a>
        </h1>
        <!--Khi chưa login sẽ không có thành phần này-->
        <div class="hamburger-menu hidden-xs">
            <button type="button" @click="showHamburgerMenu"><i class="ti-menu"></i></button>
            <ul id="hamburger-menu-content" v-if="$store.state.role === 'user'">
                <li>
                  <router-link :to="{name: 'profile'}">プロフィール</router-link>
                </li>
                <li><a href="#">相談履歴</a></li>
                <li><a href="#">チケット</a></li>
                <li><a href="#">お気に入り</a></li>
                <li><a href="#" @click="logout()">ログアウト</a></li>
            </ul>
            <ul id="hamburger-menu-content" v-else-if="$store.state.role === 'expert'">
                <li>
                    <router-link :to="{name: 'profile'}">プロフィール</router-link>
                </li>
                <li><a href="#">相談履歴</a></li>
                <li><a href="#">チケット</a></li>
                <li><a href="#">お気に入り</a></li>
                <li>
                    <router-link :to="{name: 'about'}">ABOUT</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'pickup_expert'}">Pick up</router-link>
                </li>
                <li><a href="#">専門家申請</a></li>
                <li><a @click="logout()">ログアウト</a></li>
            </ul>
        </div>
        <!--@click.prevent="loadNotifications()"-->
        <notifications></notifications>

        <div class="search-header-pc hidden-xs">
            <i class="ti-search" @click="showInputSearch()"></i>
            <input id="input-search-header" type="text" placeholder="Search...">
        </div>
        <ul class="main-menu-pc hidden-xs">
            <li>
                <router-link to="about">ABOUT</router-link>
            </li>
            <li>
                <router-link :to="{name: 'pickup_expert'}">Pick up</router-link>
            </li>
            <li v-if="$store.state.role !== 'user' && $store.state.role !== 'expert'">
              <a href="#" @click.prevent="$emit('login')">サインイン</a>
            </li>
            <li v-if="$store.state.role !== 'expert'">
                <router-link :to="{name: 'register_expert'}">専門家申請</router-link>
            </li>
        </ul>
    </header>
</template>

<script>

import {post} from '../../helpers/request'
import Notifications from '../chat/Notifications'
import {custom} from '../../mixins/custom';

export default {
  mixins: [custom],
  components: {
    'notifications': Notifications
  },

  methods: {
    logout() {
      this.$store.commit('resetData');
      this.$router.push({name: 'home'});
    }
  }
}
</script>