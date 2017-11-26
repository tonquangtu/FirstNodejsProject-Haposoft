<template>
    <div class="has-filter-content text-right">
        <button class="filter-specialist" @click="showFilter()"><img src="images/filter.png" alt=""></button>
        <div id="filter-content" v-bind:class="{active: isFilter}">
            <i class="ti-close" @click="closeFilter()"></i>
            <h3 class="text-center">フィルター</h3>
            <h4 class="prm-title-02">専門</h4>
            <ul class="checkbox-group clearfix">
                <li>
                  <input type="checkbox" v-model="occupationTypes" value="ビジネス">
                  <label>ビジネス</label>
                </li>
                <li>
                  <input type="checkbox" v-model="occupationTypes" value="法律">
                  <label>法律</label>
                </li>
                <li>
                  <input type="checkbox" v-model="occupationTypes" value="投資・マネー">
                  <label>投資・マネー</label>
                </li>
                <li>
                  <input type="checkbox" v-model="occupationTypes" value="テクノロジー">
                  <label>テクノロジー</label>
                </li>
                <li>
                  <input type="checkbox" v-model="occupationTypes" value="税・会計">
                  <label>税・会計</label>
                </li>
                <li>
                  <input type="checkbox" v-model="occupationTypes" value="健康">
                  <label>健康</label>
                </li>
                <li>
                  <input type="checkbox" v-model="occupationTypes" value="生活全般">
                  <label>生活全般</label>
                </li>
            </ul>
            <h4 class="prm-title-02">並び順</h4>
            <ul class="radio-group clearfix">
                <li>
                  <input type="radio" v-model="sort" value='0'>
                  <label>Like</label>
                </li>
                <li>
                  <input type="radio" v-model="sort" value='1'>
                  <label>レビュー</label>
                </li>
                <li>
                  <input type="radio" v-model="sort" value='2'>
                  <label>新着</label>
                </li>
            </ul>
            <div class="text-center">
                <button class="global-btn style-02" @click="pickupExpertByFilter()">適用する</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    isFilter: false,
    occupationTypes: [],
    sort: 0
  }),

  methods: {
    showFilter() {
      this.isFilter = true;
    },

    closeFilter() {
      this.isFilter = false;
    },

    pickupExpertByFilter(){
      // sort = 0 => by likes num
      // sort = 1 => by reviews num
      // sort = 3 => by times
      axios.get("/users/pickup-expert", {
          params: {
            occupation_type: this.occupationTypes,
            sort: this.sort
          }}
        ).then(response => {
          this.$emit('updateExperts', response.data);
          this.isFilter = false;
        })
        .catch(err => {
          this.errors.push(err)
        })
    }
  }
}
</script>