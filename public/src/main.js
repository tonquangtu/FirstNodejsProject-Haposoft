import Vue from 'vue'
import App from './App.vue'
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router'
import router from './router/index'
import VueTimeago from 'vue-timeago'
import store from './store'
import { sync } from 'vuex-router-sync'

import '../stylesheets/style.scss';
import '../stylesheets/bootstrap-theme.min.css';

require('./constant');
require('../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
window.$ = require('jquery');
Vue.use(VeeValidate);
Vue.use(VueRouter);

sync(store, router);

Vue.use(VueTimeago, {

  name: 'timeago',
  locale: 'vi-VN',
  locales: {
    'vi-VN': require('vue-timeago/locales/vi-VN.json')
  }
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});

// for test, comment that if deploy
store.commit('resetData');

