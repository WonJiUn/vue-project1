import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import router from './router'
import store from './store.js'
import './registerServiceWorker'
import '@/plugins/firebase'

const app = createApp(App)
app.use(router)
app.use(store)

app.mount('#app')

