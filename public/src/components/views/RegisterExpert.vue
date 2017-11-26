<template>
    <div class="main-container">
        <section class="prm-specialist-register">
            <step1 v-if="step1" @updateOccupation="updateOccupation" :occupation="info.occupation"
                   @nextStep="goStep2()"></step1>
            <step2 v-if="step2" @updateOccupationType="updateOccupationType" :occupationType="info.occupationType"
                   @prevStep="prevStep1" @nextStep="goStep3()"></step2>
            <step3 v-if="step3" @updateTitle="updateTitle" @updateSubTitle="updateSubTitle" :title="info.title"
                   :subTitle="info.subTitle" @prevStep="prevStep2" @nextStep="save"></step3>
            <regist-complete v-if="completed"></regist-complete>
            <div id="back-top" class="pull-right"><i class="ti-arrow-circle-up"></i></div>
            <div class="clearfix"></div>
        </section>
    </div>
</template>

<script>
  import Step1 from '../register-expert/Step1.vue'
  import Step2 from '../register-expert/Step2.vue'
  import Step3 from '../register-expert/Step3.vue'
  import RegistComplete from '../register-expert/Complete.vue'
  import {post} from '../../helpers/request'
  export default {
    components: {
      'step1': Step1,
      'step2': Step2,
      'step3': Step3,
      'regist-complete': RegistComplete
    },
    data() {
      return {
        step1: true,
        step2: false,
        step3: false,
        completed: false,
        info: {
          occupation: '',
          occupationType: '',
          title: '',
          subTitle: ''
        }
      }
    },
    methods: {
      goStep2() {
        this.step1 = false;
        this.step2 = true;
      },
      goStep3() {
        this.step2 = false;
        this.step3 = true;
      },
      goRegisterCompleted() {
        this.step3 = false;
        this.completed = true;
      },
      prevStep1() {
       this.step1 = true;
       this.step2 = false;
      },
      prevStep2() {
        this.step2 = true;
        this.step3 = false;
      },
      updateOccupation(val) {
        this.info.occupation = val
      },
      updateOccupationType(val) {
        this.info.occupationType = val
      },
      updateTitle(val) {
        this.info.title = val
      },
      updateSubTitle(val) {
        this.info.subTitle = val
      },
      save() {
        post('users/register-expert', this.info)
          .then(response => {
            this.$store.commit('updateRole', 'expert');
            this.$store.commit('updateExpertInfo', this.info)
            // this.$router.push({name: 'home'});
            this.goRegisterCompleted();
          }).catch(err => {
            console.log(err)
          });
      }
    }
  }
</script>