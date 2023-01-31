<template>
<div id="wrapper">
<div id="detail__page">
  <!-- <div class="detail-pic" @click="openModal" :style="{backgroundImage : `url(${productInfo.image})`}"></div> -->
  <div class="detail-pic" id="detail__pic" @click="openModal"></div>
  <div class="product__text">
    <h2 class="product__title">{{ productInfo.title }}</h2>
    <table class="product__table">
      <colgroup>
        <col style="width:173px">
        <col>
      </colgroup>
      <tbody>
        <tr>
          <th class="product__table__thtd">상품코드</th>
          <td class="product__table__thtd">{{ productCode }}</td>
        </tr>
        <tr>
          <th class="product__table__thtd">판매자</th>
          <td class="product__table__thtd">{{ productInfo.name }}</td>
        </tr>
        <tr>
          <th class="product__table__thtd">판매가</th>
          <td class="product__table__thtd"><b>{{ productInfo.price }}</b>원</td>
        </tr>
        <tr>
          <th class="product__table__thtd">구매수량</th>
          <td class="product__table__thtd">
            <input class="buyCnt" type="number" min="1" value="1"> 개
          </td>
        </tr>
        <tr>
          <th class="product__table__thtd">재고수량</th>
          <td class="product__table__thtd">{{ productInfo.productCount }} 개</td>
        </tr>
        <tr>
          <th class="product__table__thtd">배송비</th>
          <td class="product__table__thtd">{{ productInfo.deliveryCharge }} 원 <span class="deliveryFree" :style="isDisplay">( 무료배송 )</span></td>
        </tr>
        <tr>
          <th class="product__table__thtd">TOTAL</th>
          <td class="price product__table__thtd"><b>{{ productInfo.price + productInfo.deliveryCharge }}</b>원</td>
        </tr>
        <tr>
          <th class="product__table__thtd">상품설명</th>
          <td class="product__table__thtd"><div class="detail__pre">{{ productInfo.detail}}</div></td>
        </tr>
      </tbody>
    </table>

<div class="detail__buttons">
  <div class="detail__buttons__editDel">
    <button v-if="btnEdit == false" :disabled="btnEdit" class="btnEdit" @click="clickBtnEdit(this.productCode)">수정</button>
    <button v-if="btnDel == false" :disabled="btnDel" class="btnDel" @click="clickBtnDel(this.productCode)">삭제</button>
  </div>

  <div class="detail__buttons__chatBuy">
    <button v-if="btnChat == false" :disabled="btnChat" class="btnChat" @click="clickBtnChat(this.productCode)">채팅문의</button>
    <button v-if="btnBuy == false" :disabled="btnBuy" class="btnBuy" @click="clickBtnBuy(this.productCode)">장바구니</button> 
  </div>
</div>


  </div>
</div>

</div>
<!-- 사진 클릭시 나오는 모달창 -->
<div class="modal" :style="isDisplayModal" @click="closeModal">
    <div class="modalBox">
      <!-- <img class="modalImg" :src="`${productInfo.image}`" alt=""> -->
      <img class="modalImg" id="modal__Img" alt="">
    </div>
</div>

</template>

<script>

export default {
  name : 'DetailPage',
  emits:['afterModify'],
  data() {
    return {
      btnEdit : true,
      btnDel : true,
      btnChat : true,
      btnBuy : true,
      paramId : '',
      db : this.$store.state.db,
      loginUserInfo : localStorage.getItem('user'),
      productInfo : [],
      productCode : '',
      isDisplay : "display:none",
      isDisplayModal : "display:none",
      imageBind : '',

    }
  },
  methods : {
    clickBtnEdit(productCode){
      this.$router.push('/edit?id=' + productCode);
    },
    openModal(){
      this.isDisplayModal = 'display:block';
    },
    closeModal(){
      this.isDisplayModal = 'display:none';
    },
    clickBtnDel(productCode){
      if(confirm('정말 삭제하시겠습니까?')){
        this.db.collection('product').doc(productCode).delete()
        .then(()=>{
          this.$router.push('/market');
        })
      }
    },
    clickBtnChat(productCode){
      var loginUserId = JSON.parse(localStorage.getItem('user')).uid;
      var sellerId = this.productInfo.uid;
      var chatroomId = productCode + loginUserId;
      this.db.collection('chatroom').doc(chatroomId).get()
      .then((result)=>{
        if(result.exists == true){
          console.log('이미 방이 존재함');
          this.$router.push('/chat?id=' + chatroomId + '&who=' + this.productInfo.name);
        }else{
          console.log('방이 없어서 새로 생성함')

          var createChatroom = {
            'who' : [loginUserId, sellerId],
            'date' : new Date(),
            'product' : this.productInfo.title
          }

          this.db.collection('chatroom').doc(chatroomId).set(createChatroom)
          .then(()=>{
            console.log('채팅방을 새로 개설함')
            this.$router.push('/chat?id=' + chatroomId + '&who=' + this.productInfo.name);
          })
          .catch((err)=>{
            console.log(err)
          })

        }
      })
    },
    clickBtnBuy(productCode){
      console.log(productCode)
      alert('미개발 기능입니다');
    }
  },
  mounted() {
    
    var querystring = new URLSearchParams(window.location.search);
    this.paramId = querystring.get('id');
    
    this.db.collection('product').doc(this.paramId).get()
    .then((result)=>{
      var data = result.data();
      data.date = data.date.toDate().toLocaleString();  //날짜 형식 변경

      if(data.image == ''){ //이미지가 없는경우 기본이미지 설정
        data.image = 'https://firebasestorage.googleapis.com/v0/b/vue-project01-a89a2.appspot.com/o/image%2Fvecteezy_icon-image-not-found-vector_.jpg?alt=media&token=c01fbe73-5dde-426c-a2c0-e48962987df6';
      }

      if(data.deliveryCharge == 0){
        this.isDisplay = "display:inline-block"
      }

      this.productInfo = data;
      this.productCode = result.id;

      if(this.loginUserInfo != null){
        //버튼 권한 설정
        if(JSON.parse(this.loginUserInfo).uid == result.data().uid){  //자신의게시물
          this.btnChat = true;
          this.btnDel = false;
          this.btnEdit = false;
          this.btnBuy = true;
        }else if(JSON.parse(this.loginUserInfo).email == 'admin@admin.com'){  //관리자
          this.btnChat = false;
          this.btnDel = false;
          this.btnEdit = false;
          this.btnBuy = false;
        }else{  //일반사용자
          this.btnChat = false;
          this.btnDel = true;
          this.btnEdit = true;
          this.btnBuy = false;
        }
      }

      document.getElementById('detail__pic').style.backgroundImage = `url(${data.image})`;
      document.getElementById('modal__Img').src = data.image;
      //데이터바인딩을 templete에서 해도 기능은 제대로 동작하나, 콘솔창에 오류가 발생하여 따로 설정해줌
    })
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
  #wrapper{
    display: flex;
    justify-content: center;
    
  }
  #detail__page{
    width: 700px;
    padding: 50px 10px 20px 10px;
    max-width: 700px;
    background:white;
  }
  .detail-pic {
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  } 

@media screen and (max-width: 768px) {
  #detail__page{
  max-width: 100%;
  padding-left: 10px;
  padding-right: 10px;

  }
}

.product__text .product__title{
  font-size: 24px;
  padding: 0 0 20px;
  border-bottom: 2px solid var(--background-color);
  line-height: 26px;
}

.product__text .price{
  font-size:19px;
  color: blue;
}
.product__text .price b{ 
    font-size:22px;
    color: blue;
}
.product__text table th,
.product__text table td{
    padding:14px;
    font-size:15px;
    color: var(--background-color);
    text-align: left;
}

.product__text table .buyCnt{
    position: relative;
    border: 1px solid var(--background-color);
    width: 40px;
    height: 30px;
    text-align: center;
    font-size: 16px;
}
.detail__buttons__editDel{
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.detail__buttons__chatBuy{
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.detail__buttons{
  justify-content: space-between;
  display: flex;
  margin-top: 10px;
}

.detail__buttons__editDel .btnEdit,
.detail__buttons__editDel .btnDel{
  background-color: var(--background-color);
  border:none;
  color:white;
  border-radius: 5px;
  font-size : 14px;
  padding: 5px 10px 5px 10px;
  margin-right: 5px;
  cursor: pointer;
}

.detail__buttons__chatBuy .btnChat,
.detail__buttons__chatBuy .btnBuy{
  background-color: var(--background-color);
  border:none;
  color:white;
  border-radius: 5px;
  font-size : 14px;
  padding: 5px 10px 5px 10px;
  margin-right: 5px;
  cursor: pointer;
}

.detail__buttons__chatBuy button:disabled,
.detail__buttons__editDel button:disabled{
  background: white;
  cursor: default;
}
.deliveryFree{
  color: var(--accent-color);
}
.detail__pre{
  font-family: 'NanumBarunGothic';
  white-space: pre-line;
}
.product__table{
  width:100%;
  border-collapse: collapse;
}
.product__table__thtd{
  border-bottom: 1px solid #D5D5D5;
}

/* image modal */
.modal {
    z-index: 500;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    overflow: auto;
}
.modalBox {
    position: relative;
    text-align: center;
    top : 50%;
    left : 50%;
    position : sticky;
}
.modalImg{
  max-width: 100%;
  max-height: 100%;
}
/* image modal end */
</style>