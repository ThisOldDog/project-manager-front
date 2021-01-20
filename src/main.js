// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store/index'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@styles/reset.css'
import '@styles/global.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(ElementUI)

axios.interceptors.request.use(
  config => {
    if (store.state.accessToken) {
      config.headers['Authorization'] = store.state.accessToken
    }
    return config
  },
  err => Promise.reject(err)
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/')
          break
        case 500:
          ElementUI.Notification.error({
            title: '请求出现错误',
            message: '[' + error.response.status + '] ' + (error.response.data.message ? error.response.data.message : error.response.data.error),
            position: 'bottom-right'
          })
          break
      }
    }
    return Promise.reject(error)
  })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
