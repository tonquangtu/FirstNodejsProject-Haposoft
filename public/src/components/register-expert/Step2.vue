<template>
  <div class="container">
    <div class="prm-title-03">
      <h3>申請</h3>
    </div>
    <div class="step-by-step">
      <p class="text-center">相談を受け付けるために正しくご記入の上、申請してください。</p>
      <ul class="clearfix">
        <li><span>step1</span></li>
        <li class="active"><span>step2</span></li>
        <li><span>step3</span></li>
      </ul>
    </div>
    <h4 class="title-action text-center">専門を一つ選択してください</h4>
    <div class="strong-point">
      <ul class="clearfix">
        <li><a href="#" @click.prevent="selectType('ビジネス')" :class="{ active: stepOccupationType === 'ビジネス' }">ビジネス</a></li>
        <li><a href="#" @click.prevent="selectType('法律')" :class="{ active: stepOccupationType === '法律' }">法律</a></li>
        <li><a href="#" @click.prevent="selectType('投資・マネー')" :class="{ active: stepOccupationType === '投資・マネー' }">投資・マネー</a></li>
        <li><a href="#" @click.prevent="selectType('IT')" :class="{ active: stepOccupationType === 'IT' }">IT</a></li>
        <li><a href="#" @click.prevent="selectType('健康')" :class="{ active: stepOccupationType === '健康' }">健康</a></li>
        <li><a href="#" @click.prevent="selectType('税・会計')" :class="{ active: stepOccupationType === '税・会計' }">税・会計</a></li>
        <li><a href="#" @click.prevent="selectType('生活全般')" :class="{ active: stepOccupationType === '生活全般' }">生活全般</a></li>
      </ul>
    </div>
    <div class="clearfix">
      <button class="global-btn style-02 pull-left" @click="prev">戻る</button>
      <button class="global-btn style-02 pull-right" @click="next">次へ</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['occupationType'],
  data() {
    return {
      stepOccupationType: this.occupationType,
      error: false
    }
  },
  watch: {
    stepOccupationType: function (val) {
      this.$emit('updateOccupationType', val);
    }
  },
  mounted() {
    if (!this.stepOccupationType) {
      this.stepOccupationType = 'ビジネス';
    }
  },
  methods: {
    selectType(type) {
      this.stepOccupationType = type;
    },
    next() {
      if (!this.stepOccupationType) {
        this.error = true;
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