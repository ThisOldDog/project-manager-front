import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: () => import('@/pages/welcome/Welcome')
    }, {
      path: '/authorization',
      name: 'Authorization',
      component: () => import('@/pages/authorization/Authorization')
    }, {
      path: '/workspace',
      name: 'Workspace',
      component: () => import('@/pages/workspace/Workspace'),
      children: [{
        path: 'system/user',
        component: () => import('@/pages/workspace/components/system/User')
      }, {
        path: 'system/menu',
        component: () => import('@/pages/workspace/components/system/Menu')
      }, {
        path: 'system/role',
        component: () => import('@/pages/workspace/components/system/Role')
      }]
    }
  ]
})
