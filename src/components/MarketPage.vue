<template>
<div class="wrap">
  <div class="product__upload" @click="this.$router.push('/upload');">+</div>
  <div class="product" v-if="productsData == ''">
    게시글이 없습니다
  </div>
  <div class="product" v-for="data in productsData" :key="data">
    <div class="thumbnail" @click="clickTitle(data.id)" :style="{backgroundImage : `url(${data.image})`}"></div>
    <div class="product__border">
      <h5 class="title" @click="clickTitle(data.id)">{{ data.title }}</h5>
      <p class="date">{{data.date}}</p>
      <p class="price">{{data.price}}원</p>
      <p class="product__likes">☆{{ data.likes }}</p>
    </div>
  </div>   
  <div class="product__last" v-if="isLast">마지막 게시글입니다</div>
  <div class="product__paging" @click="clickMore">더보기</div>
  
</div>
</template>

<script>

export default {
  name : 'MarketPage',
  data() {
    return {
      productsData : [],
      start: null, 
      next: '', 
      size: 5,  //한번에 가져올 게시물 개수
      allCount : 0,
      numbering_num : 0,
      isLast : false,
    }
  },
  methods : {
    // numbering(){
    //   var db = this.$store.state.db;
    //   db.collection('meta').doc('product').get()
    //   .then((result)=>{
    //     this.allCount = result.data().count;
    //     if(this.allCount % this.size == 0){
    //       this.numbering_num = this.allCount / this.size;
    //     }else{
    //       this.numbering_num = Math.round(this.allCount / this.size);
    //     }
    //   })
    // },
    clickTitle(id){
    this.$router.push('/detail?id=' + id);
    },
    clickMore(){

      if(this.next == null){
        this.isLast = true;
        return false;
      }

      var db = this.$store.state.db;

      db.collection('product').orderBy('date', 'desc')
      .startAfter(this.start) //시작지점 제외
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
            image : data.image,
            name : data.name,
            price : data.price,
            title : data.title,
            uid : data.uid,
            likes : data.likes,
            id : doc.id
          }
          if(addData.image == ''){
            addData.image = 'https://firebasestorage.googleapis.com/v0/b/vue-project01-a89a2.appspot.com/o/image%2Fvecteezy_icon-image-not-found-vector_.jpg?alt=media&token=c01fbe73-5dde-426c-a2c0-e48962987df6'
          }
          this.productsData.push(addData);

        })
      })
    }
  },
  beforeMount(){
    //this.numbering(); //총 게시물 개수

    var db = this.$store.state.db;

    db.collection('product').orderBy('date','desc')
    .limit(this.size)
    .get()
    .then((result)=>{
      this.start = result.docs[this.size-1];
      //더보기 버튼을 눌렀을때 가져올 게시물의 시작점
      result.forEach((doc) => {
        var data = doc.data();
        var addData = {
          date : data.date.toDate().toLocaleString(),
          detail : data.detail,
          image : data.image,
          name : data.name,
          price : data.price,
          title : data.title,
          uid : data.uid,
          likes : data.likes,
          id : doc.id
        }
        if(addData.image == ''){
          addData.image = 'https://firebasestorage.googleapis.com/v0/b/vue-project01-a89a2.appspot.com/o/image%2Fvecteezy_icon-image-not-found-vector_.jpg?alt=media&token=c01fbe73-5dde-426c-a2c0-e48962987df6'
        }
        this.productsData.push(addData);
      });
    })
  },
  
}
</script>

<style scoped>
  :root{
    --text-color:#f0f4f5;
    --background-color : #263343;
    --accent-color : #d49466;
    
  }
  .product {
    display: flex;
    padding: 10px;
    justify-content: center;
  }
  .thumbnail {
    max-width: 200px;
    width: 100%;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    max-height: 200px;
    cursor: pointer;
  }
  .product .price {
    font-size: 16px;
    font-weight: 600;
  }
  .product .title {
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
  }

  .product .title:hover{
    text-decoration: underline;
    text-underline-position: under;
  }
  .product .date {
    color: grey;
    font-size: 13px;
  }
  
  .product__likes{
    text-align: end;
    padding-left: 300px;
  }

  .product__border{
    padding-right: 40px;
    padding-left: 40px;
    width:500px;
    background: white;
  }
  .product__border:hover{
    background: var(--text-color);
  }

  .product__paging{
    text-align: center;
    cursor: pointer;
    padding : 15px 0;
    background: var(--background-color);
    color: var(--text-color);
  }
  .product__last{
    text-align: center;
    background: var(--accent-color);
    margin-bottom: 10px;
    padding : 5px 0;
  }
  .product__upload{
    width:50px;
    height: 50px;
    background: var(--background-color);
    border-radius: 50%;
    text-align: center;
    line-height: 60px;
    font-size: 40pt;
    color: var(--text-color);
    position: fixed;
    right:30px;
    bottom: 70px;
    cursor: pointer;
  }
@media screen and (max-width: 768px) {
  .product__likes{
    text-align: end;
    padding-left: 0px;
  }
}
</style>