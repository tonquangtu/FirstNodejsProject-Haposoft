<template>
  <section class="prm-specialist-register">
    <div class="container">
      <div class="prm-title-03">
        <h3>申請</h3>
      </div>
      <div class="step-by-step">
        <p class="text-center">相談を受け付けるために正しくご記入の上、申請してください。</p>
        <ul class="clearfix">
          <li class="active"><span>step1</span></li>
          <li><span>step2</span></li>
          <li><span>step3</span></li>
        </ul>
      </div>
      <h4 class="title-action text-center">職業・肩書き</h4>
      <input :class="{'is-danger': error }" type="text" v-model="stepOccupation" placeholder="職業や肩書きをご記入ください">
      <div v-show="error" class="help is-danger">職業や肩書きをご記入ください</div>
      <div class="text-center">
        <button class="global-btn style-02" @click="next">次へ</button>
      </div>
    </div>
    <div id="back-top" class="pull-right"><i class="ti-arrow-circle-up"></i></div>
    <div class="clearfix"></div>
  </section>
</template>

<script>
export default {
  props: ['occupation'],
  data() {
    return {
      stepOccupation: this.occupation,
      error: false
    }
  },
  watch: {
    stepOccupation: function (val) {
      this.$emit('updateOccupation', val);
    }
  },
  methods: {
    next() {
      if (!this.stepOccupation) {
        this.error = true;
        return;
      }
      this.$emit('nextStep');
    }
  }
}
</script>