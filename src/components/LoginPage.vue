<template>
  <header>
      <h2>LOGIN</h2>
  </header>

  <div id="form">

      <div class="input-box">
          <input id="useremail" type="email" name="useremail" v-model="useremail" placeholder="아이디" @keyup="pressEnter">
          <label for="useremail">이메일</label>
      </div>

      <div class="input-box">
          <input id="password" type="password" v-model="password" placeholder="비밀번호" @keyup="pressEnter">
          <label for="password">비밀번호</label>
          <!-- <div id="register"><a :href=link>회원가입</a></div> -->
          <div id="register"><router-link to="/register">회원가입</router-link></div>
          <div id="kakao"><a href="#">카카오로그인</a></div>
      </div>
      
      
      <button :disabled="btnLogin" @click="userLogin">로그인</button>

    </div>

 
</template>

<script>
//import { mapMutations } from 'vuex';

export default {
  name:'LoginPage',
  emits:['afterModify'],
  data() {
    return {
      link : '/register',
      useremail : '',
      password : '',
      btnLogin : false,

    }
  },
  beforeCreate () { 
    if (localStorage.getItem('user') != undefined) { 
      this.$router.push('/')
      // 백엔드를 따로 작성하지 않았기 때문에 임시로 라이프사이클을 이용해 리다이렉트 처리
    } 
  },
  methods: {
    //...mapMutations(['saveLoginInfo']),

    userLogin(){
      this.connectLoginServer().then(()=>{
        this.saveLoginInfo();
        this.$router.push('/').then(()=>{
          window.scrollTo(0,0);
          this.$router.go(0);
        })
      })
    },

    connectLoginServer(){
      return new Promise((resolve)=>{
        var firebase = this.$store.state.firebase;

        if(this.beforeLogin() == false){
          return;
        }
        this.btnLogin = true //로그인 완료될때까지 버튼 비활성화
        
        firebase.auth().signInWithEmailAndPassword(this.useremail,this.password)
        .then(()=>{

          resolve();  //Promise 비동기처리

          // var userInfo={
          //   loginUser : result.user.displayName,
          //   loginEmail : result.user.email,
          //   loginUID : result.user.uid
          // }
          // this.saveLoginInfo(userInfo);  //store로 정보 전송

          this.btnLogin = false //버튼 비활성화 해제
        })
        .catch((err)=>{
          alert(err)
          this.btnLogin = false //버튼 비활성화 해제
        })

      })
      
    },
    beforeLogin(){
      if(this.useremail.trim() =='' && this.password.trim() ==''){
        alert('이메일 / 비밀번호를 입력해주세요.')
        return false;
      }

      // eslint-disable-next-line
      var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
      //이메일 형식체크(ESLint에러 예외처리)

      if(!reg_email.test(this.useremail)) {     
        alert('이메일 형식이 잘못되었습니다.')
        return false;                       
      }
    },
    saveLoginInfo(){
      var firebase = this.$store.state.firebase;

      firebase.auth().onAuthStateChanged((user)=>{
        //사용자의 로그인 상태가 변화할때마다 동작함
        if(user){
          //console.log(user.uid);
          //console.log(user.displayName);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
      
    },
    pressEnter(){
      if(window.event.keyCode == 13){
        this.userLogin();
      }
    },

  },
}
</script>

<style scoped>
#form{
  display: flex;
  flex-flow: column;
  align-items: center;
  padding:10px;
}
:root{
  --text-color:#f0f4f5;
  --background-color : #263343;
  --accent-color : #d49466;
  --disabled-color : #3A4E66;
}

header{
  display:flex;
  justify-content: center;
}

.input-box{
  position:relative;
  margin:10px 0;
  width:400px;
}
.input-box > input{
  background:transparent;
  border:none;
  border-bottom: solid 1px #ccc;
  padding:20px 0px 5px 0px;
  font-size:14pt;
  width:100%;

}
input::placeholder{
    color:transparent;
}
input:placeholder-shown + label{
  color:#aaa;
  font-size:14pt;
  top:15px;

}
input:focus + label, label{
  color:#8aa1a1;
  font-size:10pt;
  pointer-events: none;
  position: absolute;
  left:0px;
  top:0px;
  transition: all 0.2s ease ;
  -webkit-transition: all 0.2s ease;
  -moz-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
}

input:focus, input:not(:placeholder-shown){
  border-bottom: solid 1px #8aa1a1;
  outline:none;
}
button{
  background-color: var(--background-color);
  border:none;
  color:white;
  border-radius: 5px;
  width:400px;
  height:35px;
  font-size: 14pt;
  margin-top:100px;
}
button:disabled{
  background: #3A4E66;
  cursor: default;
}
#register{
  font-size:12pt;
  margin:10px 0px;
  text-align: end;
}
#register a {
  color:rgb(164, 164, 164);
}
@media screen and (max-width: 480px) {
  .input-box{
    width:100%;

  }
  button{
    width:100%;
  }
  
}
</style>