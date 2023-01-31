<template>
  <header>
      <h2>SIGN IN</h2>
  </header>

  <div id="form">

    <div class="input-box">
        <input id="useremail" type="email" name="useremail" v-model="useremail" placeholder="이메일">
        <label for="useremail">이메일</label>
    </div>

    <div class="input-box">
        <input id="password" type="password" ref="password" class="" :class="pwNotValid" @blur="chkPwValid" v-model="password" placeholder="비밀번호">
        <label for="password">비밀번호</label>

    </div>

    <div class="input-box">
        <input id="username" type="text" name="username" v-model="username" :class="nmNotValid" @blur="chkNmValid" placeholder="이름">
        <label for="username">이름</label>

    </div>


    <button :disabled="btnRegister" @click="registerUser">회원가입</button>

  </div>
</template>

<script>


export default {
  name:'RegisterUser',
  emits:['afterModify'],
  data() {
    return {
      useremail : '',
      password : '',
      username : '',
      btnRegister : false,
      pwNotValid : '',
      nmNotValid : '',
    }
  },
  methods: {
    
    registerUser(){
      var firebase = this.$store.state.firebase;
      var db = this.$store.state.db;
      
      if(this.beforeRegister() == false){
        return;
      }

      if(this.useremail.trim() !='' && this.password.trim() !='' && this.username.trim() != ''){
        this.btnRegister = true //가입 완료될때까지 버튼 비활성화

        firebase.auth().createUserWithEmailAndPassword(this.useremail, this.password)
        .then((result)=>{
          //이메일로 가입 성공
          var UID = result.user.uid;
          result.user.updateProfile({displayName : this.username}) //계정에 이름 추가
          .then(()=>{
            //가입성공 -> 프로필 업데이트로 이름추가 성공
            db.collection('user').doc(UID).set({'name' : this.username, 'email' : this.useremail, 'registerDate' : new Date()})
            .then(()=>{
              //파이어스토어의 user테이블에 유저정보 추가 성공
              alert('회원가입 되었습니다.')
              this.btnRegister = true //가입 완료후 버튼 활성화
              this.$router.push('/login')
            })
            .catch((err)=>{
              console.log(err)
              this.btnRegister = true //가입 실패후 버튼 활성화
            })
          });
      })
      .catch((err)=>{
        this.btnRegister = true //가입 실패후 버튼 활성화
        alert('가입실패 : ' + err)
      })

      }else{
        alert('모든 항목을 입력해주세요.');
      }
    },

    chkPwValid(){
      if(this.password.length < 6){
        this.pwNotValid = 'pwNotValid';
      }else{
        this.pwNotValid = '';
      }
    },
    chkNmValid(){
      if(this.username.length < 2){
        this.nmNotValid = 'nmNotValid';
      }else{
        this.nmNotValid = '';
      }
    },

    beforeRegister(){
      // eslint-disable-next-line
      var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
      //이메일 형식체크(ESLint에러 예외처리)

      if(!reg_email.test(this.useremail)) {     
        alert('이메일 형식이 잘못되었습니다.')
        return false;                       
      }

      if(this.password.length < 6){
        alert('비밀번호는 6자리 이상이어야 합니다.')
        return false;
      }

      if(this.username.length < 2){
        alert('이름은 2글자 이상이어야 합니다.')
        return false;
      }
    }
  },
}
</script>

<style scoped>
#form{
  display: flex;
  flex-flow: column;
  align-items: center;
}
:root{
  --text-color:#f0f4f5;
  --background-color : #263343;
  --accent-color : #d49466;
  --notvalid-color : red;
  --disabled-color : #3A4E66;
}

header{
  display:flex;
  justify-content: center;
}
form{
  padding:10px;
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
}
#register{
  font-size:12pt;
  margin:10px 0px;
  text-align: end;
}
#register a {
  color:rgb(164, 164, 164);
}
#password.pwNotValid{
  border-bottom: solid 1px red;
  color: red;
}
#username.nmNotValid{
  border-bottom: solid 1px red;
  color: red;
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