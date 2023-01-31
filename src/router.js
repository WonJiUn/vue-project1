import { createWebHistory, createRouter } from "vue-router";

import MainPage from "./components/MainPage.vue"
import LoginPage from "./components/LoginPage.vue"
import RegisterUser from "./components/RegisterUser.vue"
import MyPage from "./components/MyPage.vue"
import MarketPage from "./components/MarketPage.vue"
import UploadProduct from "./components/UploadProduct.vue"
import DetailPage from "./components/DetailPage.vue"
import EditPage from "./components/EditPage.vue"
import ChatPage from "./components/ChatPage.vue"
import ChangeAccountInfo from "./components/ChangeAccountInfo.vue"

const routes = [
  {
    path: "/",
    component: MainPage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterUser,
  },
  {
    path: "/mypage",
    component: MyPage,
  },
  {
    path: "/mypage/modify",
    component: ChangeAccountInfo,
  },
  {
    path: "/market",
    component: MarketPage,
  },
  {
    path: "/upload",
    component: UploadProduct,
  },
  {
    path: "/detail",
    component: DetailPage,
  },
  {
    path: "/edit",
    component: EditPage,
  },
  {
    path: "/chat",
    component: ChatPage,
  },
  {
    path: "/:anything(.*)",
    component: MainPage,  //페이지를 찾을 수 없다는 페이지를 만들어도 좋음. 위에다 쓸수록 우선권이 있기때문에 이건 제일 밑에 쓰는게좋다
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 