<template>
<div id="wrap">

<transition name="wrap1">
  <div class="wrap1" v-show="step ==1">
    <div v-if="chatroomList == ''">
      생성된 채팅방이 없습니다
    </div>
    <ul class="chatroom__list">
      <li class="chatroom__list__li" v-for="data in chatroomList" :key="data" @click="clickChatroom(data.id, data.who)">
        <h5>{{ data.product }}</h5>
        <h6 class="chatroom__list__id"><i class="bi bi-person-fill chatroom__list__icon"></i>{{ data.who }}</h6>
        <h6 class="chatroom__list__date">Create Date : {{data.date}}</h6>
      </li>
    </ul>
  </div>
</transition>

<transition name="wrap2">
  <div class="wrap2" ref="wrap2" v-show="step == 2">
    <div>
      <span class="chat__back" @click="clickChatBack">◀</span>
      <div class="chat ch2">
        <div class="chat__user">
          <span class="chat__user__name">INFO</span>
          <div class="icon"><i class="bi bi-person-fill"></i></div>
        </div>
          <div class="textbox">[안내] 현재 채팅방번호는 <br>{{ chatRoomId }} <br>입니다</div>
      </div>
      <div class="chat" :class= "`${data.mine}`" v-for="data in chatContent" :key="data">

        <div class="chat__user">
          <span class="chat__user__name" v-if="`${data.mine}` == 'ch1'">{{ chatWithWho }}</span>
          <span class="chat__user__name" v-else >{{ JSON.parse(this.loginUserInfo).displayName }}</span>
          <div class="icon"><i class="bi bi-person-fill"></i></div>
        </div>

        <div class="textbox">{{ data.content }}
          <br><span class="chat__date">{{ data.date.toDate().toLocaleString() }}</span>
        </div>
      </div>   
    </div>

    <div class="chat__send__wrap">
      <div class="chat__send">
        <input class="chat__input" id="chat__input" v-model="chatInput" @keyup="pressEnter">
        <button class="chat__button" @click="sendMsg()">전송</button>
      </div>
    </div>
  </div>
</transition>
</div>
</template>

<script>
export default {
  name : 'ChatPage',
  data() {
    return {
      step : 1,
      firebase : this.$store.state.firebase,
      db : this.$store.state.db,
      loginUserInfo : localStorage.getItem('user'),
      chatroomList : [],
      chatContent :[],
      chatRoomId : '',
      chatInput : '',
      chatWithWho : '',
      paramId : '',
      paramWho : '',
    }
  },
  watch:{
    chatContent(){
      //채팅 컨텐츠가 변화하면 스크롤을 제일 아래로 보냄
      this.$nextTick(()=>{
        let wrap2 = this.$refs.wrap2;
        wrap2.scrollTo({ top: wrap2.scrollHeight, behavior: 'smooth' });
      })
    }
  },
  beforeCreate () { 
    if (localStorage.getItem('user') == undefined) { 
      alert('로그인 후 이용할 수 있습니다.')
      this.$router.push('/login')
      // 백엔드를 따로 작성하지 않았기 때문에 임시로 라이프사이클을 이용해 리다이렉트 처리
    } 
  },
  beforeMount(){

    if(this.loginUserInfo == undefined){
      console.log('로그인해야 접근가능')
      return this.$router.push('/login');
    }else{  //복합 색인 설정 필요
      this.db.collection('chatroom').orderBy('date', 'desc')
      .where('who','array-contains',JSON.parse(this.loginUserInfo).uid)
      .get()
      .then((result)=>{
        result.forEach((a)=>{
          var tempArr = a.data(); //임시 배열 생성

          if(a.data().who[0] == JSON.parse(this.loginUserInfo).uid){
            this.db.collection('user').doc(a.data().who[1]).get()
            .then((result)=>{
              //남의 글에서 만들어진 채팅의 경우
              tempArr.who = result.data().name;
              tempArr.date = tempArr.date.toDate().toLocaleString();
              tempArr.id = a.id;
              this.chatroomList.push(tempArr);
            })
          }else{
            this.db.collection('user').doc(a.data().who[0]).get()
            .then((result)=>{
              //내가 올린 글에서 만들어진 채팅의 경우
              tempArr.who = result.data().name;
              tempArr.date = tempArr.date.toDate().toLocaleString();
              tempArr.id = a.id;
              this.chatroomList.push(tempArr);
            })
          }
        })
      })
    }
  },
  mounted(){
    var querystring = new URLSearchParams(window.location.search);
    this.paramId = querystring.get('id');
    this.paramWho = querystring.get('who');
    if(this.paramId != null && this.paramWho != null){
      this.clickChatroom(this.paramId, this.paramWho);
    }
  },
  methods:{
    clickChatroom(id,who){
      this.step = 2;
      this.chatRoomId = id;
      this.chatWithWho = who;

      this.db.collection('chatroom').doc(this.chatRoomId).collection('messages').orderBy('date')
      .onSnapshot((result)=>{
        this.chatContent = [];
        //대화를 추가하기 전에 비워줌
        result.forEach((a)=>{
          var addData = a.data();
          if(a.data().uid == JSON.parse(this.loginUserInfo).uid){
            //로그인한 유저가 보낸 메시지
            addData.mine = 'ch2';
            this.chatContent.push(addData);
          }else{
            //상대방이 보낸 메시지
            addData.mine = 'ch1';
            this.chatContent.push(addData);
          }

        })
      })

    },
    clickChatBack(){
      this.step = 1;
    },
    sendMsg(){
      if(this.chatInput.trim() == '' || this.chatRoomId == ''){
        //채팅 입력창이 공백이거나 클릭이벤트 없이 접근한 경우 다음 코드 실행하지 않음
        console.log('채팅입력창공백 혹은 채팅룸아이디가 없음')
        return false;
      }
      var data={
        content : this.chatInput,
        date : new Date(),
        uid : JSON.parse(this.loginUserInfo).uid
      }

      this.db.collection('chatroom').doc(this.chatRoomId).collection('messages').add(data);
      this.chatInput = '';
    },
    pressEnter(){
      if(window.event.keyCode == 13){
        this.sendMsg();
      }
    },

  }
}
</script>

<style scoped>
:root{
  --text-color:#f0f4f5;
  --background-color : #263343;
  --accent-color : #d49466;
  --chatroom-background : #A8C0D6;
  --date--color : #747474;
  --borerline-color: #D5D5D5;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  
}

a {
    text-decoration: none;
}
#wrap{
  display: flex;
  justify-content: center;
}
.wrap2 {
    display: flex;
    flex-flow: column;
    margin-top : 30px;
    padding-top: 20px;
    max-height: 600px;
    background-color: #A8C0D6;
    width: 800px;
    height: 600px;
    overflow-y: scroll;
}

.wrap2 .chat {
    display: flex;
    align-items: flex-start;
    padding: 20px;
}

.wrap2 .chat .icon {
    position: relative;
    overflow: hidden;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #eee;
}

.wrap2 .chat .icon i {
    position: absolute;
    top: 10px;
    left: 50%;
    font-size: 2.5rem;
    color: #aaa;
    transform: translateX(-50%);
}

.wrap2 .chat .textbox {
    position: relative;
    display: inline-block;
    max-width: calc(100% - 70px);
    padding: 10px;
    margin-top: 7px;
    font-size: 14px;
    border-radius: 10px;
    white-space: pre-line;
    word-break: break-all;
}

.wrap2 .chat .textbox::before {
    position: absolute;
    display: block;
    top: 0;
    font-size: 1.5rem;
}

.wrap2 .ch1 .textbox {
    margin-left: 20px;
    background-color: var(--text-color);
}

.wrap2 .ch1 .textbox::before {
    left: -15px;
    content: "◀";
    color: var(--text-color);
}

.wrap2 .ch2 {
    flex-direction: row-reverse;
}

.wrap2 .ch2 .textbox {
    margin-right: 20px;
    background-color: #F9EB54;
    white-space: pre-line;
    word-break: break-all;
}

.wrap2 .ch2 .textbox::before {
    right: -15px;
    content: "▶";
    color: #F9EB54;
}
.wrap1{
  word-break: break-all;
  background: white;
  margin-top:30px;
}
.chatroom__list__li{
  font-size: 14pt;
  border-bottom: 1px solid #D5D5D5;
  list-style: none;
  padding: 10px;
  max-width: 480px; 
  /* width에 max 추가하니까 화면 줄였을때 반응형이 제대로 돌아감 */
  max-height: 200px;
  width:100vw;
  cursor: pointer;
}
.chatroom__list__li:hover{
  background: var(--text-color);
}
.chatroom__list__date{
  text-align: end;
  color: #747474;
}
.chatroom__list__id{
  display: flex;
  align-items: center;
}
.chatroom__list__icon{
  font-size: 14pt;
  border: 1px solid var(--background-color);
  margin-right: 5px;
}
.chat__back{
  margin-left: 20px;
  font-size: 30px;
  cursor: pointer;
  color:var(--background-color);
  position: absolute;
  z-index: 999;
  background: #F9EB54;
  border-radius: 100%;
  padding-right:7px;
}
.chat__input{
  width: 90%;
  height: 30px;
  font-size: 12pt;
}
.chat__button{
  background-color: var(--background-color);
  border:none;
  color:var(--text-color);
  border-radius: 5px;
  font-size : 14px;
  padding: 5px 10px 5px 10px;
  cursor: pointer;
  width: 10%
}
.chat__send{
  display: flex;
  align-content: center;
  padding: 20px;
  
}
.chat__send__wrap{
  position: sticky;
  top:1000px;
}
.chat__date{
  font-size: 9pt;
  color: #747474;
}
.chat__user{
  text-align: center;
}
.chat__user__name{
  font-size: 11pt;
}

.wrap2-enter-from {transform: translateX(1000px);}
.wrap2-enter-active {Transition: all 0.5s;}
.wrap2-enter-to {transform: translateX(0px)}

.wrap1-enter-from {transform: translateX(-1000px)}
.wrap1-enter-active {Transition: all 0.5s;}
.wrap1-enter-to {transform: translateX(0px);}
 
@media screen and (max-width: 480px) {
  .wrap1{
    width: 100vw;
    min-width: 200px;
  }

}
@media screen and (max-width: 768px) {
  .chat__input{
    width:85%
  }
  .chat__button{
    width:15%
  }
}
</style>