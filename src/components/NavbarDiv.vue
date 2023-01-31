<template>
  <nav class="navbar">
    
    <div class="navbar__logo">
      <img src="../assets/logo.png" width="25">
      <router-link class="navbar__router" to="/">PROJECT01</router-link>
    </div>
    
    <ul class="navbar__menu" :class="menu">

      <li><router-link class="routerlink" to="/">HOME</router-link></li>
      <li><router-link class="routerlink" to="/market">MARKET</router-link></li>
      <li><router-link class="routerlink" to="/upload">UPLOAD</router-link></li>
      <li><router-link class="routerlink" to="/chat">CHAT</router-link></li>
      <li><router-link class="routerlink" to="/mypage">MYPAGE</router-link></li>
    </ul>


    <ul class="navbar__icons" :class="icons">
      <li v-if="loginUserInfo == undefined">
        <router-link to="/login">LOGIN</router-link>
      </li>
      <li v-else>
        <a @click="userLogout()">LOGOUT</a>
      </li>
      
      <li><a @click="cartClick"><i class="bi bi-cart-fill"></i></a></li>
      <!-- 추후에 라우터 링크로 수정 -->
    </ul>

    <a href="#" class="navbar__toogleBtn" @click="clickToggleBtn(this.menu, this.icons)"><i class="bi bi-list"></i></a>
  </nav>
</template>


<script>
export default {
  name: 'NavbarDiv',

  data() {
    return {
      menu : '',
      icons : '',
      loginUserInfo : localStorage.getItem('user'),
    }
  },
  methods: {
    clickToggleBtn(menu,icons){
      if(menu == ''){
        this.menu = 'active'
      }else{
        this.menu = ''
      }
      if(icons == ''){
        this.icons = 'active'
      }else{
        this.icons = ''
      }
    },

    userLogout(){
      var firebase = this.$store.state.firebase;
      
      firebase.auth().signOut();
      localStorage.removeItem('user');
      //로그아웃시 스토리지 삭제(로컬스토리지 정보는 위조가 가능하기 때문에 임시로 사용)
      //alert('로그아웃');
      this.$router.push('/').then(()=>{
        this.$router.go(0);
      })
    },
    cartClick(){
      //나중에 라우터 링크로 수정예정 임시안내
      alert('미개발 기능입니다')
    }
  },
  watch:{
    
  }
}
</script>

<style>
  :root{
    --text-color:#f0f4f5;
    --background-color : #263343;
    --accent-color : #d49466;
  }
  body {
    margin:0;
  }
  .navbar__router{
    text-decoration: none;
    color:var(--text-color);
  }
  
  .routerlink {
    text-decoration: none;
    color:var(--text-color);
  }

  .navbar__icons a {
    text-decoration: none;
    color:var(--text-color);
    cursor: pointer;
  }
  .navbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background:var(--background-color);
    padding: 8px 12px;
  }

  .navbar__logo{
    font-size: 20px;
    color:var(--text-color);
    display: flex;
  }
  .navbar__logo a:hover{
    color: var(--accent-color)
  }
  .navbar__menu{
    display: flex;
    list-style: none;
    padding-left: 0;
    align-items: center;
  }
  .navbar__menu li {
    padding:8px 12px;
  }

  .navbar__menu li:hover {
    background-color: var(--accent-color);
    border-radius: 4px;
  }

  .navbar__icons{
    list-style: none;
    color:var(--text-color);
    display: flex;
    align-items: center;
    padding-left: 0;
  }
  .navbar__icons li {
    padding: 8px 10px;
  }
  .navbar__icons i {
    font-size: 20px;
  }
  .navbar__toogleBtn{
    color: var(--text-color);
    font-size: 24px;
    position: absolute;
    right: 32px;
    display: none;
  }
  .navbar__toogleBtn:hover{
    color: var(--accent-color)
  }

  @media screen and (max-width: 768px) {
    .navbar {
      flex-direction: column;
      align-items: flex-start;
      padding:8px 24px;
    }
    .navbar__menu{
      display: none;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .navbar__menu li{
      width:100%;
      text-align: center;
    }
    .navbar__icons{
      display: none;
      justify-content: center;
      width: 100%;
    }
    .navbar__toogleBtn{
      display: block;
    }
    .navbar__menu.active,
    .navbar__icons.active {
      display:flex;
    }
  }
</style>