import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'normalize.css'
import 'style/app.scss'

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.prototype.$base_api = process.env.VUE_APP_BASE_API

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
