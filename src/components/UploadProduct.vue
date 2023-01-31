<template>
  <div class="wrap">
  <div class="form_box">
    <h3 class="upload__title">UPLOAD</h3>
    <div class="input_field_flex">
      <label class="input_field_label">제목</label>
      <input class="input_field " v-model="title" type="text" placeholder="제목" ><br>
    </div>
    <div class="input_field_flex">
      <label class="input_field_label">가격</label>
      <input class="input_field" v-model="price" type="number" min="0" placeholder="가격" ><br>
    </div>
    <div class="input_field1_flex">
      <span class="input_field_count">
        <label class="input_field_label">수량</label>
        <input class="input_field1 count_field" v-model="productCount" type="number" min="1" max="9999" placeholder="수량" ><br>
      </span>
      <span class="input_field_delevery">
        <label class="input_field_label">배송비</label>
        <input class="input_field1 delivery_field" :disabled="isBoxChecked" v-model="deliveryCharge" type="number" min="0" placeholder="배송비" ><br>
        <input class="input_field1_checkbox" type="checkbox" v-model="isCheck">무료배송
      </span>
    </div>
    <textarea class="textarea_field" v-model="content" placeholder="내용을 입력해주세요."></textarea><br>
    <img class="image__preview" :src="imagePreview" alt="preview">
    <div class="input_field_file_wrap">
      <input class="input_field_file" @input="fileSize" id="fileInfo" type="file" accept=".jpg, .png, .jpeg">
    </div>
    <div class="uploadFile__info">2MB이하의 jpg, png, jpeg 파일만 업로드 가능</div>
    <button class="write_button" :disabled="btnUpload" @click="clickBtnUpload">업로드</button>

  </div>
</div>
</template>

<script>

export default {
  name : 'UploadProduct',
  data() {
    return {
      title : '',
      price : '',
      productCount : '',
      deliveryCharge : '',
      content : '',
      image : '',
      date : '',
      firebase : this.$store.state.firebase,
      db : this.$store.state.db,
      btnUpload : false,
      isCheck : false,
      isBoxChecked : false,
      imagePreview : '',
    }
  },
  beforeCreate () { 
    if (localStorage.getItem('user') == undefined) { 
      alert('로그인 후 이용할 수 있습니다.')
      this.$router.push('/login')
      // 백엔드를 따로 작성하지 않았기 때문에 임시로 라이프사이클을 이용해 리다이렉트 처리
    } 
  },
  methods: {
    clickBtnUpload(){
      if(this.isLogin() == false){
        //업로드전에 사용자의 로그인상태 체크하는 코드 추가
        return false;
      }

      const storage = this.firebase.storage();
      this.btnUpload = true //업로드 완료될때까지 버튼 비활성화
      
      //null값 chk
      if(this.beforeUpload() == false){
        return false;
      }
      var file = document.querySelector('#fileInfo').files[0];

      var data={
        date : this.date,
        detail : this.content,
        image : this.image,
        likes : 0,
        name : JSON.parse(localStorage.getItem('user')).displayName,
        price : this.price,
        title : this.title,
        uid : JSON.parse(localStorage.getItem('user')).uid,
        productCount : this.productCount,
        deliveryCharge : this.deliveryCharge
      }

      if(file == undefined){
        //이미지파일이 없을때
        this.db.collection('product').add(data)
        .then(()=>{
          this.btnUpload = false; //버튼 비활성화 해제
          alert('성공적으로 저장되었습니다.');
          this.$router.push('/market')
        })
      }else{
        //이미지파일이 있을때
        var storageRef = storage.ref();
        var savePath = storageRef.child('image/' + this.image);
        var uploadFile = savePath.put(file);

        uploadFile.on('state_changed',
        //변화시 동작하는 함수
        null,
        //에러시 동작하는 함수
        (error)=>{
          console.error('실패사유는 ', error);
          this.btnUpload = false; //버튼 비활성화 해제
        },
        //성공시 동작하는 함수
        ()=>{
          uploadFile.snapshot.ref.getDownloadURL()
          .then((url)=>{
            //console.log('업로드된 경로는 ', url);
            data.image = url;
            this.db.collection('product').add(data)
            .then(()=>{
              this.btnUpload = false; //버튼 비활성화 해제
              alert('성공적으로 저장되었습니다.')
              this.$router.push('/market')
            })
            .catch((err)=>{
              alert('저장실패 : ' + err);
              this.btnUpload = false; //버튼 비활성화 해제
            })
          })
        })
      }

    },
    beforeUpload(){
      var file = document.querySelector('#fileInfo').files[0];
      if(this.title.trim() == '' || this.content.trim() == ''|| this.price == ''){
        alert('미입력된 항목이 있습니다');
        this.btnUpload = false; //버튼 비활성화 해제
        return false;
      }

      if( file != undefined){
        //파일이 있는경우 파일명 파싱
        var fileNameParsing = file.name.split('.');
        if(fileNameParsing[1] == 'jpg' || fileNameParsing[1] == 'png' || fileNameParsing[1] == 'jpeg'){
          var dateTime = new Date();
          var uniqueFileName = fileNameParsing[0] + dateTime.getTime() + '.' + fileNameParsing[1];
          this.image = uniqueFileName;
          this.date = dateTime;

          return true;
        }else{
          alert('jpg, png, jpeg 파일만 업로드 가능합니다')
          return false;
        }
      }else if( file == undefined){
        //파일이 없는경우 시간만 설정
        this.date = new Date();
        return true;
      }
    },
    fileSize(){
      var file = document.querySelector('#fileInfo').files[0];

      if(file.size > 2097152){
        alert('2MB이하의 파일만 업로드 가능합니다');
        document.querySelector('#fileInfo').value = "";
      }else{
        //이미지 미리보기
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    isLogin(){
      if (localStorage.getItem('user') == undefined) { 
        alert('로그인 후 이용할 수 있습니다.')
        this.$router.push('/login')
        return false;
      }else{
        return true;
      }
    }
  },
  watch:{
    isCheck:function(value){
      if(value == true){
        this.deliveryCharge = 0;
        this.isBoxChecked = true;
      }else{
        this.deliveryCharge = '';
        this.isBoxChecked = false;
      }
    },
    price(value){
      if(value < 0){
        this.price = 0;
      }
    },
    productCount(value){
      if(value < 0){
        this.productCount = 1;
      }else if(value > 9999){
        this.productCount = 9999;
        alert('최대 수량은 9999입니다');
      }
    }
  }
}
</script>

<style scoped>
:root{
  --text-color:#f0f4f5;
  --background-color : #263343;
  --accent-color : #d49466;
}
.wrap{
  display: flex;
  justify-content: center;
  padding-top: 50px;
  overflow: auto;
}
.form_box {
  background-color: var(--text-color);
  margin: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 10px;
  width: 700px;
  text-align: end;
  
}
.input_field {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  margin: 3px 0;
  font-size: 16px;
  width: 90%;
  font-family: 'NanumBarunGothic';
}
.input_field_label{
  padding: 3px 10px 3px 10px;
  border: 1px solid #A6A6A6;
  background-color: var(--background-color);
  color: var(--text-color);
}
.input_field_file_wrap{
  display: flex;
}
.input_field_file{
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  margin: 3px 0;
  font-size: 16px;
  font-family: 'NanumBarunGothic';
  width:97%;
}
.input_field_file::file-selector-button{
  background-color: var(--background-color);
  border: 1px solid #323f6b;
  color: #ffffff;
  border-radius: 4px;
  padding: 5px 8px;
  font-family: 'NanumBarunGothic';
}
.textarea_field {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  margin: 3px 0px;
  font-size: 16px;
  width: 97%;
  height: 360px;
  font-family: 'NanumBarunGothic';
  display: flex;
}
.write_button {
  background-color: var(--background-color);
  border: 1px solid #323f6b;
  color: #ffffff;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 18px;
  font-family: 'NanumBarunGothic';
  
}
button:disabled{
  background: #3A4E66;
}
.upload__title{
  text-align: left;
}
.input_field1_flex{
  display: flex;
  justify-content: space-between;
  align-items: center;

}
.input_field1{
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  margin: 3px 0;
  font-size: 16px;
  font-family: 'NanumBarunGothic';
}
.input_field1_checkbox{
  width:15px;
  height: 15px; 
}
.input_field_flex{
  display: flex;
  align-items: center;
}
.input_field_delevery{
  display: flex;
  align-items: center;
  width: 50%;
}
.input_field_count{
  display: flex;
  align-items: center;
  width:50%;
}
.count_field{
  width:200px;
}
.uploadFile__info{
  font-size: 11pt;
  text-align: start;
  color: #747474;
  margin-left: 5px;
}
.image__preview{
  width:100px;
  height:100px; 
  display: flex;
  text-align: center;
  background: white;
}

@media screen and (max-width: 768px) {
  .input_field_count{
    width:37%;
  }
  .input_field_delevery{
    width: 61%;
  }
  .input_field{
    width:85%;
  }
  .input_field1{
    width: 80%;
  }
  .input_field0{
    justify-content: space-between;
  }
  .count_field{
    max-width:100px;
  }
  .delivery_field{
    max-width:100px;
  }
  .input_field1_checkbox{
    width:12px
  }
  .textarea_field{
    width:95%;
    height: 260px;
  }
  .input_field_file{
    width:95%;
  }
}
@media screen and (max-width: 480px) {
  .input_field_count{
  width:35%;
  }
  .input_field_delevery{
  width: 68%;
  }
  .input_field{
    width:80%;
  }
  .input_field0{
    justify-content: space-between;
  }
  .count_field{
    max-width:43px;
  }
  .delivery_field{
    max-width:57px;
  }
  .textarea_field{
    height: 160px;
  }
  .image__preview{
    width:60px;
    height:60px
  }
}
</style>