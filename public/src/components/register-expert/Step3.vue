<template>
  <div class="container">
    <div class="prm-title-03">
      <h3>申請</h3>
    </div>
    <div class="step-by-step">
      <p class="text-center">相談を受け付けるために正しくご記入の上、申請してください。</p>
      <ul class="clearfix">
        <li><span>step1</span></li>
        <li><span>step2</span></li>
        <li class="active"><span>step3</span></li>
      </ul>
    </div>
    <h4 class="title-action text-center">相談者へのメッセージ</h4>
    <textarea :class="{'is-danger': errorTitle }" cols="30" rows="5" v-model="stepTitle" placeholder="例）会社法やM&Aに関わる法律のことは何でもご相談ください！"></textarea>
    <div v-show="errorTitle" class="help is-danger">職業や肩書きをご記入ください</div>
    <h4 class="title-action text-center">相談者への注意事項</h4>
    <textarea :class="{'is-danger': errorSubTitle }" cols="30" rows="5" v-model="stepSubTitle" placeholder="例）ご相談の際は、背景などできるだけ詳細にご記入ください。"></textarea>
    <div v-show="errorSubTitle" class="help is-danger">職業や肩書きをご記入ください</div>
    <div class="clearfix">
      <button class="global-btn style-02 pull-left" @click="prev">戻る</button>
      <button class="global-btn style-02 pull-right" @click="next">申請する</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title', 'subTitle'],
    data() {
      return {
        stepTitle: this.title,
        stepSubTitle: this.subTitle,
        errorTitle: false,
        errorSubTitle: false
      }
    },
    watch: {
      stepSubTitle: function (val) {
        this.$emit('updateSubTitle', val);
      },
      stepTitle: function (val) {
        this.$emit('updateTitle', val);
      },
    },
    mounted() {

    },
    methods: {
      next() {
        let validate = true;
        if (!this.stepTitle) {
          this.errorTitle = true;
          validate = false;
        } else {
          this.errorTitle = false;
        }
        if (!this.stepSubTitle) {
          this.errorSubTitle = true;
          validate = false;
        } else {
          this.errorSubTitle = false;
        }
        if (!validate) {
          return;
        }
        this.$emit('nextStep');
      },
      prev() {
        this.$emit('prevStep');
      }
    }
  }
</script>