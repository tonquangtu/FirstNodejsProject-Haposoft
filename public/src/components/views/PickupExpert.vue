<template>
  <div class="main-container">
    <section class="prm-list-favorite">
      <div class="container">
        <div class="prm-title-03">
          <h3>PICK UP</h3>
        </div>
        <filtering @updateExperts="updateExperts"></filtering>
        <div class="row">
          <expert v-for="expert in experts" :key="expert.account._id" :expert="expert"></expert>
          <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
            <span slot="no-more">
              専門家はこれ以上見つかりません。
            </span>
          </infinite-loading>
        </div>
      </div>
      <div id="back-top" class="pull-right"><i class="ti-arrow-circle-up"></i></div>
      <div class="clearfix"></div>
    </section>
  </div>
</template>

<script>
import {get} from '../../helpers/request';
import Expert from '../pickup-expert/Expert';
import Filter from '../pickup-expert/Filter';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {
    'expert': Expert,
    'filtering': Filter,
    'infinite-loading': InfiniteLoading,
  },

  data: () => ({
    experts: [
      {
        account: {
          avatar_url: '',
          name: '',
          occupation: '',
          occupation_type: ''
        }
      }
    ],
    isFilter: false,
    page: 1,
    nomore: false
  }),

  methods: {
    showFilter() {
      this.isFilter = true
    },

    updateExperts(val) {
      this.experts = val;
    },

    onInfinite() {
      if (this.nomore === false) {
        setTimeout(() => {
          get('/users/pickup-expert?page=' + this.page)
            .then(response => {
              if (response.status === 200) {
                this.experts = this.experts.concat(response.data);
                this.page += 1;
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
              } else {
                this.nomore = true;
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
              }
            })
            .catch(err => {
              this.errors.push(err);
            })
        }, 500)
      } else {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
      }
    }
  },

  created() {
    get('/users/pickup-expert')
      .then(response => {
        this.experts = response.data;
        this.page += 1;
      })
      .catch(err => {
        this.errors.push(err)
      })
  }
}

</script>