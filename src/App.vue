<template>

  <link href="https://hangeul.pstatic.net/hangeul_static/css/nanum-barun-gothic.css" rel="stylesheet">

  <NavbarDiv class="NavbarDiv"></NavbarDiv>
  <div class="main">
    <div class="app__loginUserInfo" v-if="loginUserInfo == undefined">
      <span style="cursor: pointer;" @click="this.$router.push('/login')">비로그인</span>
    </div>
    <div class="app__loginUserInfo" v-else>
      <span>LOGIN USER</span>
      <span class="app__loginUser" @click="this.$router.push('/mypage')">
      {{ (loginUserInfo != undefined)? JSON.parse(loginUserInfo).displayName : "" }}
      </span>
    </div>

    <router-view @afterModify="changeTrigger = new Date()"></router-view>
  </div>

</template>

<script>

import NavbarDiv from './components/NavbarDiv.vue'

export default {
  name: 'App',
  components: {
    NavbarDiv,
  },
  emits:['afterModify'],
  data() {

    return {
      loginUserInfo : localStorage.getItem('user'),
      changeTrigger : '',

    }
  },
  watch:{
    changeTrigger(){
      this.loginUserInfo = localStorage.getItem('user')
    }
  }
}
</script>

<style>
  :root{
    --text-color:#f0f4f5;
    --background-color : #263343;
    --accent-color : #d49466;
    --borderline-color : #D5D5D5;
  }
  #app{
    font-family: 'NanumBarunGothic';
    margin:0;
    padding:0;
  }
  body{
    background: #EFE8D5;
  }
  .NavbarDiv{
    z-index: 9999;
  }
  .app__loginUserInfo{
    background:var(--text-color);
    padding: 10px;
    color: var(--background-color);
    text-align: end;
  }
  .app__loginUser{
    background: var(--background-color);
    color: var(--text-color);
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 5px;
  }

</style>
