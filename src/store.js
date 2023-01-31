import { createStore } from 'vuex'
import axios from 'axios'

import './plugins/firebase.js'
import "firebase/firestore"; 
import firebase from 'firebase';


const store = createStore({
  state(){
    return {
      chkLogin : false,
      db : firebase.firestore(),
      firebase : firebase,
      loginUser : '',
      loginEmail : '',
      loginUID : '',
      localestorageInfo : '',

    }
  },
  //state변경에 사용
  mutations: {
    saveLoginInfo(state,data){
      state.loginUser = data.loginUser;
      state.loginEmail = data.loginEmail;
      state.loginUID = data.loginUID;
    },
    changeLocalestorage(state, data){
      state.localestorageInfo = data;
    }
  },
  //ajax요청에 사용
  actions : {
    getData(store){
      axios.get('https://codingapple1.github.io/vue/more0.json')
      .then((result)=>{
        console.log(result.data)
        store.commit('setMore', result.data)
      })
    }
  }
})

export default store