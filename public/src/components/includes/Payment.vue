<template>
    <div id="option-buy-ticket">
        <div class="buy-ticket-content">
            <p class="text-left close-btn"><i class="ti-close" @click="$emit('close')"></i></p>
            <h3 class="text-center">チケット購入</h3>
            <h4 class="text-center">現在の保有額　0円</h4>
            <div class="custom-select text-center">
                <p>
                    <select v-model="paymentAmount">
                        <option value="1000">1,000円</option>
                        <option value="2000">2,000円</option>
                        <option value="3000">3,000円</option>
                        <option value="4000">4,000円</option>
                    </select>
                </p>
            </div>
            <div class="text-center show-option"><span></span>
                <p>相談者が支払う1通あたりの料金</p></div>
            <div class="group-option">
                <div class="row">
                    <div class="col-md-6 col-sm-12 col-xs-12 show-input">
                        <input type="text" v-validate="'required'" :class="{'is-danger': errors.has('number') || error.invalid_number }"
                               name="number" v-model="number" placeholder="クレジットカード番号">
                        <div v-show="errors.has('number')" class="help is-danger">{{ errors.first('number') }}</div>
                        <div v-if="error.number" class="help is-danger">Card number is incorrect</div>
                    </div>
                    <div class="col-md-6 col-sm-12 col-xs-12 show-input">
                        <input type="text" v-model="name" placeholder="クレジットカード名義">
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-6 show-input">
                        <masked-input type="text" v-validate="'required'" :class="{'is-danger': errors.has('expDate') }"
                                      name="expDate" v-model="expDate" mask="11/1111" placeholder="有効期限"/>
                        <div v-show="errors.has('expDate')" class="help is-danger">{{ errors.first('expDate') }}</div>
                        <div v-if="error.exp_month || error.exp_year" class="help is-danger">Expiration date is incorrect</div>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-6 show-input">
                        <input type="text" v-validate="'required'" :class="{'is-danger': errors.has('cvc') }"
                               name="cvc" v-model="cvc" placeholder="セキュリティコード">
                        <div v-show="errors.has('cvc')" class="help is-danger">{{ errors.first('cvc') }}</div>
                        <div v-if="error.cvc" class="help is-danger">CVC is incorrect</div>
                    </div>
                </div>
                <p class="total-price text-right">
                    <span>合計</span>
                    <span class="total">{{ paymentAmount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") }}円</span>
                </p>
            </div>
            <button type="button" @click="buyTicket">購入する</button>
        </div>
        <loading v-if="loading"></loading>
    </div>
</template>

<script>
  import Loading from './Loading.vue'
  import MaskedInput from 'vue-masked-input'
  import {get, post} from '../../helpers/request'

  export default {
    components: {
      'loading': Loading,
      MaskedInput
    },
    props: ['amount'],
    data() {
      return {
        loading: false,
        paymentAmount: this.amount,
        number: '',
        name: '',
        expDate: '',
        cvc: '',
        error: {},
        msgList: [
          {

          }
        ]
      }
    },
    methods: {
      buyTicket() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            let url = window.constant.routes.buy_ticket;
            let data = {
              amount: this.paymentAmount,
              number: this.number,
              name: this.name,
              exp_date: this.expDate,
              cvc: this.cvc
            };
            this.loading = true;
            post(url, data).then(res => {
              this.loading = false;
              this.$emit('success');
            }).catch(err => {
              this.loading = false;
              console.log(err.response.data);
              this.error = {};
              if (err.response.status === 422) {
                this.error[err.response.data.data.param] = err.response.data.message
              }
            })
          }
        })
      }
    }
  }
</script>