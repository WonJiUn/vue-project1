<template>
  <div class="wrap">
    <table class="mypage__table">
      <tr class="mypage__table__tr">
        <td>이메일</td>        
        <td colspan="2">{{mypageInfo.email}}</td>
      </tr>
      <tr class="mypage__table__tr">
        <td>비밀번호</td>        
        <!-- <td colspan="2"><input class="changeAccount__input" @blur="passwordChk" :class="alertInput" v-model="changeAccountPw" placeholder="미입력시 변경되지 않음">
          <br><span class="changeAccount__info" v-show="alertInfo">비밀번호는 6자리 이상이어야 합니다</span>
        </td> -->
        <td><button class="mypage__button" @click="openModal">비밀번호 변경</button></td>
      </tr>
      <tr class="mypage__table__tr">
        <td>이름</td>        
        <td colspan="2">
          <input class="changeAccount__input" @blur="nameChk" :class="alertInput2" v-model="mypageInfo.name">
          <br><span class="changeAccount__info" v-show="alertInfo2">2글자 이상의 이름을 설정해주세요</span>
        </td>
      </tr>
      <tr class="mypage__table__tr">
        <td><button class="mypage__button" @click="daumPostApi">기본배송지 설정</button></td>        
        <td colspan="2">
          <input readonly class="changeAccount__input changeAccount__input__addr1" v-model="mypageInfo.deliveryAddr1" placeholder="우편번호 / 주소"><br>
          <input class="changeAccount__input changeAccount__input__addr2" v-model="mypageInfo.deliveryAddr2" placeholder="상세주소">
        </td> 
        
      </tr>
      <tr class="changeAccount__lastTr">
        <td colspan="3"><button class="mypage__button" @click="clickBtnChangeInfo">회원정보변경</button></td>
      </tr>
    </table>
  </div>

  <!-- 비밀번호 변경 클릭시 나오는 모달창 -->
  <div class="modal" :style="isDisplayModal">
        <div class="modalBox">
          <div class="modal__btnX" @click="closeModal">×</div>
          <table class="modal__table">
            <tr>
              <td colspan="2"><div class="modal__announce">비밀번호를 입력해주세요(6글자 이상)</div></td>
            </tr>
            <tr>
              <td>현재 비밀번호</td>
              <td><input type="password" class="modal__password1" v-model="currentPw"></td>
            </tr>
            <tr>
              <td>변경할 비밀번호</td>
              <td><input type="password" class="modal__password1" v-model="changeAccountPw1"></td>
            </tr>
            <tr>
              <td>비밀번호 확인</td>
              <td><input type="password" class="modal__password2" v-model="changeAccountPw2" @blur="isPwEqual"></td>
            </tr>
          </table>
          <div class="modal__iscorrect">
            <div class="modal__announce2" :style="isCorrectPw">비밀번호가 서로 일치하지 않습니다</div>
            <div class="modal__announce2" :style="isCorrectPw2">비밀번호는 6글자 이상이어야 합니다</div>
            <div class="modal__button"><button class="mypage__button" :disabled="canChangePw" @click="clickBtnChangePw">비밀번호 변경</button></div>
          </div>
          
        </div>
    </div>
</template>

<script>
export default {
  name: 'ChangeAccountInfo',
  emits:['afterModify'],
  data() {
    return {
      firebase : this.$store.state.firebase,
      db : this.$store.state.db,
      loginUserInfo : localStorage.getItem('user'),
      mypageInfo : [],
      mypageInfo_copy : [],
      currentPw : '',
      changeAccountPw1 : '',
      changeAccountPw2 : '',
      alertInput : '',
      alertInput2 : '',
      alertInfo: false,
      alertInfo2: false,
      addr2 : '', //사용자입력 상세주소
      isDisplayModal : "display:none",
      isCorrectPw : 'display:none',
      isCorrectPw2 : 'display:none',
      canChangePw : true,
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
    if(localStorage.getItem('user') != undefined){

      this.db.collection('user').doc(JSON.parse(this.loginUserInfo).uid).get()
      .then((result)=>{
        this.mypageInfo = result.data();
        this.mypageInfo_copy = result.data();
      })
    }
  },
  methods: {
    clickBtnChangeInfo(){
      const user = this.firebase.auth().currentUser;
      var updateData = {
        name : this.mypageInfo.name,
        deliveryAddr1 : this.mypageInfo.deliveryAddr1,
        deliveryAddr2 : this.mypageInfo.deliveryAddr2,
      }

      if(this.mypageInfo.name !== this.mypageInfo_copy.name 
      || this.mypageInfo.deliveryAddr1 != this.mypageInfo_copy.deliveryAddr1
      || this.mypageInfo.deliveryAddr2 != this.mypageInfo_copy.deliveryAddr2){
        if(confirm('회원정보를 변경하시겠습니까?')){
          user.updateProfile({
            displayName: this.mypageInfo.name
          }).then(()=>{
            //프로필 변경 성공하면 user테이블의 정보와 로컬스토리지도 업데이트해줌
            this.db.collection('user').doc(user.uid).update(updateData)
            .then(()=>{
              alert('성공적으로 변경되었습니다')
              const user = this.firebase.auth().currentUser;
              localStorage.setItem('user', JSON.stringify(user));
              this.$router.push('/mypage');
              this.$emit('afterModify');
              //라우터+새로고침 대신 커스텀이벤트로 상단 로그인유저명 변경처리

              // this.$router.push('/').then(()=>{
              //   this.$router.go(0);
              // })
            })
          })
        }
      }
    },
    clickBtnChangePw(){
      if(this.currentPw == ''){
        alert('현재 사용중인 비밀번호를 입력해주세요')
        return false;
      }
      if(this.isPwEqual == false){
        alert('비밀번호 규칙을 확인해주세요')
        return false;
      }

      const user = this.firebase.auth().currentUser;
      this.canChangePw = true;  //완료될때까지 버튼 비활성화

      //firebase 정책상 보안에 민감한 행위들에 한해 재인증이 필요함
      const credential = this.firebase.auth.EmailAuthProvider.credential(
        this.mypageInfo.email,
        this.currentPw
      );

      user.reauthenticateWithCredential(credential)
      .then(()=>{
        var changePw = this.changeAccountPw1;
        //비밀번호 변경
        user.updatePassword(changePw).then(() => {
          alert('비밀번호가 변경되었습니다.');
          this.isDisplayModal = 'display:none'
          this.canChangePw = false;  //완료후 버튼 재활성화
        
        }).catch((error) => {
          alert(error);
          this.canChangePw = false;  //완료후 버튼 재활성화
        });

      }).catch(()=>{
        alert('비밀번호가 틀렸습니다.')
        this.canChangePw = false;  //완료후 버튼 재활성화
      })

    },
    // passwordChk(){
    //   if(this.changeAccountPw == ''){
    //     this.alertInput = '';
    //     this.alertInfo = false;
    //   }
    //   else if(this.changeAccountPw.length < 6){
    //     this.alertInput = 'changeAccount__inputAlert';
    //     this.alertInfo = true;
    //   }else{
    //     this.alertInput = '';
    //     this.alertInfo = false;
    //   }
    // },
    nameChk(){
      if(this.mypageInfo.name.length < 2){
        this.alertInput2 = 'changeAccount__inputAlert';
        this.alertInfo2 = true;
      }else{
        this.alertInput2 = '';
        this.alertInfo2 = false;
      }
    },
    daumPostApi(){
      new window.daum.Postcode({
        oncomplete: (data) => {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            let fullRoadAddr = data.roadAddress; // 도로명 주소 변수
            let extraRoadAddr = ''; // 도로명 조합형 주소 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
              extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraRoadAddr !== ''){
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }
            // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
            if(fullRoadAddr !== ''){
                fullRoadAddr += extraRoadAddr;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            this.mypageInfo.deliveryAddr1 = data.zonecode + " / " + fullRoadAddr; //5자리 새우편번호 사용
        }
      }).open()
    },

    openModal(){
      this.isDisplayModal = 'display:block';
    },
    closeModal(){
      this.isDisplayModal = 'display:none';
    },
    isPwEqual(){
      if(this.changeAccountPw1.length < 6 || this.changeAccountPw2.length < 6){
        this.isCorrectPw2 = 'display:block';
        this.isCorrectPw = 'display:none';
        this.canChangePw = true;
        return false;
      }else if(this.changeAccountPw1 !== this.changeAccountPw2){
        this.isCorrectPw = 'display:block';
        this.isCorrectPw2 = 'display:none';
        this.canChangePw = true;
        return false;
      }else{
        this.isCorrectPw = 'display:none';
        this.isCorrectPw2 = 'display:none';
        this.canChangePw = false;
        return true;
      }
    }
  },
  
}
</script>

<style scoped>
  :root{
    --text-color:#f0f4f5;
    --background-color : #263343;
    --accent-color : #d49466;
    --border-color : #D5D5D5;
  }
  .wrap{
    display: flex;
    justify-content: center;
    padding-top: 30px;
    overflow: auto;
  }
  .mypage__table{
    border-collapse: collapse;
    background: white;
    /* max-width: 480px;
    min-width: 350px; 
    비밀번호 @blur로 인해 표가 틀어지는것을 방지하기 위해 수정*/
    width: 480px; 
    table-layout: fixed;
    border-radius: 5px;
  }
  .mypage__table__tr{
    border-bottom: 1px solid #D5D5D5;
    height: 70px;
  }
  .mypage__table td{
    padding: 10px;
  }
  .mypage__button {
    background-color: var(--background-color);
    border: 1px solid #323f6b;
    color: #ffffff;
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 11pt;
    font-family: 'NanumBarunGothic';
    cursor: pointer;
  }
  button:disabled{
  background: #3A4E66;
  cursor: default;
  }
  .changeAccount__input{
    height: 20px;
    font-size: 11pt;
  }
  .changeAccount__inputAlert{
    border-color: red;
  }
  .changeAccount__info{
    font-size: 10pt;
    color:red;
  }
  .changeAccount__input__addr1{
    width: 95%;
  }
  .changeAccount__input__addr2{
    width: 95%;
  }
  .changeAccount__lastTr{
    text-align: end;
  }
  .modal {
    z-index: 500;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .modalBox {
    position: relative;
    top : 20%;
    left : 50%;
    transform: translate(-50%);
    position : relative;
    width:350px;
    height: 210px;
    background: white;
    border-radius: 5px;
  }
  .modal__btnX{
    cursor: pointer;
    text-align: end;
    padding: 10px;
    font-size: 15pt;
  }
  .modal__password1{
    margin-left: 10px;
    height: 20px;
    font-size: 11pt;
  }
  .modal__password2{
    margin-left: 10px;
    height: 20px;
    font-size: 11pt;
  }
  .modal__announce{
    font-size: 11pt;
    padding-bottom: 15px;
  }
  .modal__table{
    margin-left: 15px;
  }
  .modal__button{
    justify-items: end;
    margin-right: 8px;
    margin-top: 7px;
  }
  .modal__iscorrect{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .modal__announce2{
    padding-right: 30px;
    color: red;
    font-size: 10pt;
  }
  button:disabled{
  background: #3A4E66;
  cursor: default;
  }
</style>