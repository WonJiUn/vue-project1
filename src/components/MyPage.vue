<template>

  <div class="wrap__tab">
    <div class="wrap__input">
      <input class="tab__input" type="radio" name="tab__group" id="tab__1" @click="step = 1" checked>
      <label for="tab__1">회원정보</label>
      <input class="tab__input" type="radio" name="tab__group" id="tab__2" @click="[step = 2, getPostList()]">
      <label for="tab__2">작성글</label>
      <input class="tab__input" type="radio" name="tab__group" id="tab__3" @click="step = 3">
      <label for="tab__3">북마크</label>
    </div>
  </div>

  <div class="wrap" v-show="step == 1">
    <table class="mypage__table">
      <tr class="mypage__table__tr">
        <td>가입일자</td>        
        <td colspan="2">{{mypageInfo.registerDate}}</td>
      </tr>
      <tr class="mypage__table__tr">
        <td>이메일</td>        
        <td colspan="2">{{mypageInfo.email}}</td>
      </tr>
      <tr class="mypage__table__tr">
        <td>비밀번호</td>        
        <td colspan="2">****</td>    
      </tr>
      <tr class="mypage__table__tr">
        <td>이름</td>        
        <td colspan="2">{{mypageInfo.name}}</td>
      </tr>
      <tr class="mypage__table__tr">
        <td>기본배송지</td>        
        <td colspan="2">{{mypageInfo.deliveryAddr1}} {{ mypageInfo.deliveryAddr2 }}</td>  
      </tr>
      <tr>
        <td><button class="mypage__button" @click="openModal">회원탈퇴</button></td>
        <td></td>
        <td class="mypage__table__sortRight"><button class="mypage__button" @click="clickBtnChangeInfo">정보변경</button></td>
      </tr>
    </table>


    <!-- 탈퇴 클릭시 나오는 모달창 -->
    <div class="modal" :style="isDisplayModal">
        <div class="modalBox">
          <div class="modal__btnX" @click="closeModal">×</div>
          <table class="modal__table">
            <tr>
              <td colspan="2"><div class="modal__announce">탈퇴하시려면 비밀번호를 다시 한 번 입력해주세요</div></td>
            </tr>
            <tr>
              <td>이메일</td>
              <td><input readonly class="modal__email" :value="`${mypageInfo.email}`"></td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td><input type="password" id="modal__password" class="modal__password" v-model="AccountDelPw"></td>
            </tr>
          </table>
          <div class="modal__button"><button :disabled="btnAccountDel" class="mypage__button" @click="clickBtnAccountDel">회원탈퇴</button></div>
          
        </div>
    </div>
  </div>

  <div class="wrap" v-show="step == 2">
    <table class="mypage__table">
      <tr>
        <td colspan="3">
          <div class="mypage__nodata" v-if="myPostData == ''">
            작성글이 없습니다
          </div>
        </td>
      </tr>
      <tr class="mypage__table__tr mypage__post__click" v-for="data in myPostData" :key="data" @click="clickPostNm(data)">
        <td colspan="2">{{data.title}}</td>        
        <td class="mypage__post__date">{{data.date}}</td>
      </tr>
      <tr>
        <td colspan="3">
          <div class="mypage__nodata" v-if="isLast">마지막 게시글입니다</div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <div class="mypage__post__paging" @click="clickMore">더보기</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="wrap" v-show="step == 3">
    <table class="mypage__table">
      <tr>
        <td colspan="3">
          <div class="mypage__nodata" v-if="myBookmarkData == ''">
            미개발 기능입니다
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name : 'MyPage',
  emits:['afterModify'],
  data() {
    return {
      firebase : this.$store.state.firebase,
      db : this.$store.state.db,
      loginUserInfo : localStorage.getItem('user'),
      mypageInfo : [],
      isDisplayModal : "display:none",
      AccountDelPw : '',
      btnAccountDel : false,
      step: 1,
      size : 5, //한번에 가져올 게시글 개수
      myPostData : [],
      start : '', //더보기 눌렀을때 게시물 시작점
      next : '', //더보기 눌렀을때 다음 게시물이 있는가?
      isLast : false,
      myBookmarkData : [],
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
        this.mypageInfo.registerDate = this.mypageInfo.registerDate.toDate().toLocaleString();
      })
    }
    
  },
  methods: {
    firebaseAccountDel(){
      
      if(this.AccountDelPw == ''){
        return false;
      }else{
        const user = this.firebase.auth().currentUser;

        //firebase 정책상 보안에 민감한 행위들에 한해 재인증이 필요함
        const credential = this.firebase.auth.EmailAuthProvider.credential(
            this.mypageInfo.email,
            this.AccountDelPw
        );

        user.reauthenticateWithCredential(credential)
        .then(()=>{
          //회원탈퇴
          user.delete().then(() => {
            
            alert('탈퇴되었습니다.')
            localStorage.removeItem('user');  
            //세션대용으로 쓰고있는 로컬스토리지에서 로그인정보 삭제

            this.$router.push('/').then(()=>{
              this.$router.go(0);
            })

          }).catch((error) => {
            alert(error)
          });
        }).catch(()=>{
          alert('비밀번호가 틀렸습니다.')
        })
      }

    },
    clickBtnChangeInfo(){
      this.$router.push('/mypage/modify');
    },
    openModal(){
      this.isDisplayModal = 'display:block';
    },
    closeModal(){
      this.isDisplayModal = 'display:none';
    },
    deleteUserTable(){
      if(confirm('정말 탈퇴하시겠습니까?')){
        this.btnAccountDel = true;  //완료될때까지 버튼 비활성화

        //user테이블의 데이터삭제
        this.db.collection('user').doc(JSON.parse(this.loginUserInfo).uid).delete()
        .then(()=>{
          this.firebaseAccountDel();
          //반대 순서로 하면 테이블삭제 진행이 안되는 문제가 있어서 테이블삭제->탈퇴 순서로 진행함
        }).catch((error)=>{
          console.log(error)
        })
      }
    },
    clickBtnAccountDel(){
      this.deleteUserTable();
      //this.btnAccountDel = false;
    },
    getPostList(){
      this.myPostData = [];
      //작성글 탭 클릭시 작동됨
      this.db.collection('product')
      .orderBy('date','desc')
      .where('uid', '==', JSON.parse(this.loginUserInfo).uid)
      .limit(this.size)
      .get()
      .then((result)=>{
        this.start = result.docs[this.size-1];
        //더보기 버튼을 눌렀을때 가져올 게시물의 시작점
        result.forEach((doc) => {
          var data = doc.data();
          var addData = {
            date : data.date.toDate().toLocaleString(),
            name : data.name,
            price : data.price,
            title : data.title,
            uid : data.uid,
            likes : data.likes,
            id : doc.id
          }
          this.myPostData.push(addData);
        });
      })
    },
    clickMore(){

      if(this.next == null){
        this.isLast = true;
        return false;
      }

      this.db.collection('product')
      .orderBy('date', 'desc')
      .startAfter(this.start) //시작지점 제외
      .where('uid', '==', JSON.parse(this.loginUserInfo).uid)
      .limit(this.size)
      .get()
      .then((result)=>{
        this.next = result.docs.length == this.size ? result.docs[result.docs.length - 1] : null
        this.start = result.docs[this.size-1];
        //더보기 버튼을 눌렀을때 가져올 게시물의 시작점
        result.forEach((doc)=>{
          var data = doc.data();
          var addData = {
            date : data.date.toDate().toLocaleString(),
            detail : data.detail,
            name : data.name,
            price : data.price,
            title : data.title,
            uid : data.uid,
            likes : data.likes,
            id : doc.id
          }
          this.myPostData.push(addData);

        })
      })
    },
    clickPostNm(data){
      this.$router.push('/detail?id=' + data.id);
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
    /* padding-top: 30px; */
    overflow: auto;
  }
  .mypage__table{
    border-collapse: collapse;
    background: white;
    /* max-width: 480px;
    min-width: 390px; */
    width: 480px; 
    table-layout: fixed;
    border-radius: 5px;
  }
  .mypage__table__tr{
    border-bottom: 1px solid #D5D5D5;
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
    height: 180px;
    background: white;
    border-radius: 5px;
  }
  .modal__btnX{
    cursor: pointer;
    text-align: end;
    padding: 10px;
    font-size: 15pt;
  }
  .modal__email{
    margin-left: 10px;
    height: 20px;
    font-size: 11pt;
  }
  .modal__password{
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
    text-align: end;
    margin-right: 8px;
    margin-top: 7px;
  }
  button:disabled{
    background: #3A4E66;
    cursor: default;
  }
  .mypage__table__sortRight{
    text-align: end;
  }
  
  /* 탭페이지 내비게이션 CSS */
  .wrap__tab{
    text-align: center;
    overflow: auto;
    width:100%;
    margin-top: 30px;
  }
  .wrap__input{
    display: inline-flex;
    justify-content: center;
    max-width:480px;
    width:100%;
    border-bottom: 1px solid #D5D5D5;
  }
  .tab__input{
    display: none;
  }
  .wrap__input label{
    width: 33%;
    background: white;
    padding: 20px;
  }
  .wrap__input input:checked + label {
    color: black;
    border: 1px solid #ddd;
    border-top : 2px solid var(--accent-color);
    border-bottom: 1px solid var(--background-color);
  }

  /* step2 */
  .mypage__post__date{
    font-size: 11pt;
    color: gray;
  }
  .mypage__post__paging{
    text-align: center;
    cursor: pointer;
    padding : 15px 0;
    background: var(--background-color);
    color: var(--text-color);
    margin-top: -20px
  }
  .mypage__nodata{
    text-align: center;
    background: var(--accent-color);
    margin-bottom: 10px;
    padding : 5px 0;
  }
  .mypage__post__click{
    cursor: pointer;
  }
  .mypage__post__click:hover{
    background: var(--text-color);
  }
</style>