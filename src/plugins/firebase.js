import firebase from 'firebase/app'
import "firebase/firestore";

// 사용할거 하나씩 import
import 'firebase/auth' // 사용자 인증
import 'firebase/firebase-database' // database
import firebaseConfig from '../firebaseConfig'

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
