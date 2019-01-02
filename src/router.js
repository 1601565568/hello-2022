import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import asyncRouter from './utils/asyncRouter'
import config from './configs/router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: '/app/',
  routes: asyncRouter(config)
})

router.beforeEach((to, from, next) => {
  console.log('1111111111', from)
  if (to.path.indexOf('/operate') !== -1 || to.path.indexOf('/Isv') !== -1) {
    return next()
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.

    if (!store.state.user.remumber.remumber_flag) {
      store.dispatch('user/login').then(() => {
        next()
        // next({ path: '/operate',
        //   query: {
        //     redirect: to.fullPath
        //   } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        // })
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
