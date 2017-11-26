<template>
    <div id="login-layout">
        <div class="login-layout-content text-center">
            <i id="close" class="ti-close" @click="$emit('close')"></i>
            <h3>サインイン</h3>
            <div class="login-social">
                <p>
                    <a href="#" class="login-twitter" @click.prevent="twitterLogin()">
                        <i class="ti-twitter-alt"></i>
                        twitterでサインイン
                    </a>
                </p>
                <p>
                    <a href="#" class="login-facebook" @click.prevent="facebookLogin()">
                        <i class="ti-facebook"></i>
                        Facebookでサインイン
                    </a>
                </p>
            </div>
            <p>
                <router-link to="term_of_use">利用規約</router-link>
                に同意の上、サインインしてください
            </p>
        </div>
    </div>
</template>

<script>

  import {EventBus} from '../../event-bus'

  export default {
    methods: {
      facebookLogin() {
        this.authenticate('facebook');
      },

      twitterLogin() {
        this.authenticate('twitter');
      },

      authenticate(provider) {

        window.authenticateCallback = (loginData) => {
          console.log(loginData);

          let redirectPathName = 'home';
          if (loginData && loginData.success) {

            this.$store.commit('login', loginData);
            if (loginData.receiverId) {
              this.$store.commit('updateReceiverData', loginData);
            }

            if (loginData.expertTitle) {
              let expertInfo = {
                expertTitle: loginData.expertTitle,
                expertSubTitle: loginData.expertSubTitle,
                expertOccupation: loginData.expertOccupation,
                expertOccupationType: loginData.expertOccupationType,
                expertLike: loginData.expertLike,
                expertRate: loginData.expertRate
              };
              this.$store.commit('updateExpertInfo', expertInfo);
            }

            this.$emit('close');
            EventBus.$emit(window.constant.bus_events.init_socket);
            if (this.$route.path == window.constant.routes.expert_detail) {
              redirectPathName = 'user_chat';
            }
            this.$router.push({name: redirectPathName});

          } else {
            console.log('Login fail');
          }
        };

        window.open('/auth/' + provider, '', 'width=400 height=400');
      }
    }
  }

</script>