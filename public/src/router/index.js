import VueRouter from 'vue-router';
import Home from '../components/views/Home.vue'
import About from '../components/views/About.vue'
import TermOfUse from '../components/views/TermOfUse.vue'
import RegisterExpert from '../components/views/RegisterExpert.vue'
import PickupExpert from '../components/views/PickupExpert.vue'
import ExpertDetail from '../components/chat/ExpertDetail.vue'
import UserChatDetail from '../components/chat/UserChatDetail.vue'
import BuyTicket from '../components/views/BuyTicket.vue'
import PaymentHistory from '../components/views/PaymentHistory.vue'
import Profile from '../components/views/Profile.vue'
import store from '../store'

let routes = [
  {
    path: '/', name: 'home', component: Home,
  },
  {
    path: '/about', name: 'about', component: About,
  },
  {
    path: '/term-of-use', name: 'term_of_use', component: TermOfUse,
  },
  {
    path: '/expert-detail',
    name: 'expert_detail',
    component: ExpertDetail,
    beforeEnter: (to, from, next) => {
      console.log('expert-detail-before-enter: ' + store.state.isLogin);
      if (from.path === '/user-chat') {
        if (store.state.isLogin) {
          next({name: 'pickup_expert'});
          return;
        }
      }
      next();
    }
  },
  {
    path: '/user-chat',
    name: 'user_chat',
    component:UserChatDetail,
    beforeEnter: (to, from, next) => {
      if (store.state.isLogin === false) {
        next({name:'home'});
        return;
      }
      next();
    }
  },
  {
    path: '/register-expert', name: 'register_expert', component: RegisterExpert,
  },
  {
    path: '/pickup-expert',
    name: 'pickup_expert',
    component: PickupExpert,
  },
  {
    path: '/buy-ticket', name: 'buy_ticket', component: BuyTicket,
  },
  {
    path: '/payment-history', name: 'payment-history', component: PaymentHistory
  },
  {
    path: '/profile', name: 'profile', component: Profile
  }

];

export default new VueRouter({
  routes
});