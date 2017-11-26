<template>
    <div @click="pickupExpert()" class="col-md-4 col-sm-4 col-xs-12">
        <div class="prm-item-specialist text-center">
            <div class="thumb">
                <img :src="expert.account.avatar_url" alt="">
            </div>
            <h3 class="name-specialist">{{expert.account.name}}</h3>
            <p class="position">{{expert.occupation}}</p>
            <p class="label-specialist"><i class="ti-tag"></i>{{expert.occupation_type}}</p>
        </div>
    </div>
</template>

<script>

  import {post} from '../../helpers/request';

  export default {
    props: ['expert'],

    methods: {

      pickupExpert() {
        let url = window.constant.routes.verify_pickup_expert;
        let data = {
          'expert_id': this.expert._id
        };

        post(url, data).then(response => {

          let expertData = response.data.data;
          let receiverData = {
            receiverId: expertData.expertId,
            receiverName: expertData.expertName,
            receiverAvatar: expertData.expertAvatar,
            receiverEmail: expertData.expertEmail
          };
          let expertInfo = {
            expertTitle: expertData.expertTitle,
            expertSubTitle: expertData.expertSubTitle,
            expertOccupation: expertData.expertOccupation,
            expertOccupationType: expertData.expertOccupationType,
            expertLike: expertData.expertLike,
            expertRate: expertData.expertRate
          };
          this.$store.commit('updateReceiverData', receiverData);
          this.$store.commit('updateExpertInfo', expertInfo);
          this.$store.commit('resetMessages');

          if (this.$store.state.isLogin) {
            this.$router.push({name: 'user_chat'});
          } else {
            this.$router.push({name: 'expert_detail'});
          }
        }).catch(err => {
          console.log("error to verify pickup expert: " + err);
        });

      }
    }
  }
</script>