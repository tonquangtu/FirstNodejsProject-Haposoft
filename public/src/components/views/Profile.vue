<template>
<div class="main-container">
  <section class="prm-profile-specialist">
    <div class="container">
      <div class="prm-title-03">
        <h3>プロフィール</h3>
      </div>
      <form v-el:form-update enctype="multipart/form-data" class="profile-detail" v-on:submit.prevent="updateProfile()">
        <div class="avatar">
          <div class="thumb">
            <img :src="info.avatar" alt="">
          </div>
          <input type="file" style="visibility: hidden;" @change="onAvatarChange">
          <button @click="uploadAvatar()">
            <i class="ti-plus"></i>
            アップロード
          </button>
        </div>
        <div class="account">
          <label>ユーザー名</label>
          <input type="text" disabled="disable" v-model="info.name"> 
        </div>
        <div class="email">
          <label>通知メールアドレス（メッセージ受信の際、通知します）</label>
          <input type="email" v-model="info.email">
        </div>
        <div class="about-me">
          <label>プロフィール</label>
          <textarea cols="30" rows="5" placeholder="プロフィール" v-model="info.profile"></textarea>
        </div>
        <div v-if="$store.state.role === 'expert'">
          <div class="position">
            <label>職業・肩書き</label>
            <input type="text" placeholder="職業や肩書きをご記入ください" v-model="info.occupation">
          </div>
          <div class="strong-point">
            <label for="">専門を一つ選択してください</label>
            <ul class="clearfix">
              <li>
                <a href="#" @click.prevent="selectOccupationType('ビジネス')" :class="{ active: $store.state.occupationType === 'ビジネス' }">
                  ビジネス
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="selectOccupationType('法律')" :class="{ active: $store.state.occupationType === '法律' }">
                  法律
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="selectOccupationType('投資・マネー')" :class="{ active: $store.state.occupationType === '投資・マネー' }">
                  投資・マネー
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="selectOccupationType('IT')" :class="{ active: $store.state.occupationType === 'IT' }">
                  IT
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="selectOccupationType('健康')" :class="{ active: $store.state.occupationType === '健康' }">
                  健康
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="selectOccupationType('税・会計')" :class="{ active: $store.state.occupationType === '税・会計' }">
                  税・会計
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="selectOccupationType('生活全般')" :class="{ active: $store.state.occupationType === '生活全般' }">
                  生活全般
                </a>
              </li>
            </ul>
          </div>
          <div class="question">
            <label>相談者へのメッセージ</label>
            <textarea cols="30" rows="5" placeholder="例）会社法やM&Aに関わる法律のことは何でもご相談ください！" v-model="info.title"></textarea>
          </div>
          <div class="note">
            <label>相談者への注意事項</label>
            <textarea cols="30" rows="5" placeholder="例）ご相談の際は、背景などできるだけ詳細にご記入ください。" v-model="info.subTitle"></textarea>
          </div>
        </div>

        <div class="submit-btn text-center">
          <button type="submit" class="global-btn style-02">更新</button>
        </div>
      </form>
      <div class="your-url" v-if="$store.state.role === 'expert'">
        <h4>あなたのURL</h4>
        <input type="text" value="https://premi-um.com/hrtkfm/">
        <p>twitterやFacebook、ホームページなどでURLを知らせましょう。</p>
      </div>
      <div class="consultation" v-if="$store.state.role === 'expert'">
        <h3>相談を受ける際の注意事項</h3>
        <p>・相談者はメッセージを送るごとにお金を払います。できるだけ少ないメッセージで有益な相談になるよう、心がけましょう。</p>
        <p>・できるだけ早く返信しましょう。7日間返信がない場合はチケットバックされます。</p>
        <p>・相談者へのちょっとした確認などは「返信を無料にする」オプションを使い、相談者の負担を軽減しましょう。</p>
      </div>
    </div>
    <div id="back-top" class="pull-right"><i class="ti-arrow-circle-up"></i></div>
    <div class="clearfix"></div>
  </section>

</div>
</template>
<script>
import {post} from '../../helpers/request';
import axios from 'axios';

export default {
  data() {
    return {
      info: {
        avatar: this.$store.state.myAvatar,
        name: this.$store.state.myName,
        email: this.$store.state.myEmail,
        profile: this.$store.state.myProfile,
        occupation: this.$store.state.occupation,
        occupationType: this.$store.state.occupationType,
        title: this.$store.state.expertTitle,
        subTitle: this.$store.state.expertSubTitle
      }
    }
  },

  methods: {
    updateProfile() {
      axios(
        {
          method: 'POST',
          url: '/users/update-profile', 
          data: this.info,
          // headers: {
            // 'Content-Type': 'multipart/x-www-form-urlencoded'
            // 'Content-Type': 'multipart/form-data'
          // }
        }
        ).then(response => {
          this.$store.commit('updateProfile', this.info);
          if (this.$store.state.role === 'expert') {
            this.$store.commit('updateExpertInfo', this.info);
          }
          this.$router.push({name: 'home'});
        }).catch(err => {
          console.log("Update profile failure");
        })
    },

    selectOccupationType(type) {
      this.info.occupationType = type;
    },

    onAvatarChange(event) {
      let files = event.target.files || event.dataTransfer.files;
      if(!files.length) return;
      this.createImage(files[0]);
    },

    createImage(file) {
      let image = new Image();
      let reader = new FileReader();

      let vm = this;

      reader.onload = (e) => {
        vm.info.avatar = e.target.result;
      }

      reader.readAsDataURL(file);
    },

    removeImage(event) {
      this.info.avatar = '';
    },

    uploadAvatar() {
      this.$el.querySelector('input[type=file]').click();
    }
  }
}
</script>