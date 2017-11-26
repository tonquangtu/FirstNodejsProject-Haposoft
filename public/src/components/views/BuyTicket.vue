<template>
    <div class="main-container bg-01">
        <section class="prm-price-setting">
            <div class="container">
                <div class="prm-title-03">
                    <h3>料金設定</h3>
                </div>
                <div class="content">
                    <div class="text-center">
                        <h3>現在の設定　1,000円 / 1通</h3>
                        <div class="custom-select">
                            <p>
                                <select v-model="amount">
                                    <option value="1000">1,000円</option>
                                    <option value="2000">2,000円</option>
                                    <option value="3000">3,000円</option>
                                    <option value="4000">4,000円</option>
                                </select>
                            </p>
                            <span>※相談者が支払う1通あたりの料金</span>
                        </div>
                        <button class="global-btn style-02" @click="showPayment = true">設定</button>
                    </div>
                    <payment :amount="amount" v-if="showPayment" @close="showPayment = false" @success="buySuccess"></payment>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Payment from '../includes/Payment.vue'
    export default {
      components: {
        'payment': Payment
      },
      data() {
        return {
          showPayment: false,
          amount: 1000
        }
      },
      methods: {
        buySuccess() {
        }
      }
    }
</script>