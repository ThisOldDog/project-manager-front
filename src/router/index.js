import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/pages/welcome/Welcome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    }
  ]
})
