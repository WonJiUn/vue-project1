<template > 
  <div id="wrapper">
    
    <div class="mainpage__title">
      (임시)제목입니다
    </div>
    <div class="mainpage__subtitle">
      (임시)서브타이틀입니다
    </div>
    <div class="mainpage__content">
      <span class="mainpage__content__title">[ MAIN, LOGIN PAGE ]</span> 
      
      <div class="mainpage__content__text">
        내비게이션 바 : 768px을 기준으로 미디어쿼리가 적용됨<br/>
        로그인 페이지<br/>
        카카오로그인(회원가입) - 미개발기능입니다<br/>
        회원가입 페이지<br/>
      </div>

    </div>
    <div class="mainpage__content">
      <span class="mainpage__content__title">[ MARKET PAGE ]</span> 
      
      <div class="mainpage__content__text">
        더보기 버튼<br/>
        + 버튼 (글쓰기)<br/>
        게시물 클릭 -> 상세페이지<br/>
        수정,삭제 버튼 : 자신의 게시물이거나 관리자 계정에서만 활성화<br/>
        북마크 - 미개발기능입니다<br/>
      </div>

    </div>
    <div class="mainpage__content">
      <span class="mainpage__content__title">[ CHAT PAGE ]</span> 
      
      <div class="mainpage__content__text">
        채팅하기 버튼 : 게시물 상세페이지 하단, 자신의 게시물에는 비활성화됨<br/>
        채팅방 목록 페이지<br/>
        목록 클릭-> 1:1 채팅방<br/>
      </div>

    </div>

    <div class="mainpage__content">
      <span class="mainpage__content__title">[ MYPAGE ]</span> 
      
      <div class="mainpage__content__text">
        회원탈퇴기능 - modal창<br/>
        회원정보변경기능 - 비밀번호 변경 modal창<br/>
        이름 변경 - 2글자 미만으로 입력하면 빨간 글씨로 안내문구가 나오게 설정<br/>
        주소 설정 - daumPost Api<br/>
        내가 쓴 게시글 모아보기 기능<br/>
        북마크 게시글 모아보기 - 미개발기능입니다<br/>
      </div>

    </div>

    <div class="mainpage__content">
      <span class="mainpage__content__title">[ PURCHASE PAGE ]</span> 
      
      <div class="mainpage__content__text">
        미개발기능입니다<br/>
        미개발기능입니다<br/>
        미개발기능입니다<br/>
        미개발기능입니다<br/>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  name : 'MainPage',
  data() {
    return {
      
    }
  },
}
</script>

<style scoped>
  .wrapper{
    max-width: 1280px;
  }
  .mainpage__title{
    margin : 50px 0px 10px 100px;
    font-size: 40px;
  }
  .mainpage__subtitle{
    margin-left: 100px;
    font-size: 20px;
  }
  .mainpage__content{
    margin : 50px 0 0 100px;
    
  }
  .mainpage__content__title{
    margin-right: 50px;
  }
  .mainpage__content__text{
    margin-top:10px;
    margin-right: 100px;
  }

  @media screen and (max-width: 480px) {

  .mainpage__title{
    margin : 10px;
    font-size: 25px;

  }
  .mainpage__subtitle{
    margin: 10px;
    font-size: 15px;
    
  }
  .mainpage__content{
    margin-top:50px;
    margin-left: 10px;
  }
  .mainpage__content__text{

    max-width: 480px;
  }
 
}
</style>