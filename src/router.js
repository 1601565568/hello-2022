import Vue from 'vue'
import Router from 'vue-router'
// import store from './store'
import asyncRouter from './utils/asyncRouter'
import routes from './configs/router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: '/app/',
  routes: asyncRouter(routes)
})

<<<<<<< HEAD
// router.beforeEach((to, from, next) => {
//   if (to.path.indexOf('/operate') !== -1 || to.path.indexOf('/Isv') !== -1) {
//     return next()
//   }
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (!store.state.user.remumber.remumber_flag) {
//       store.dispatch('user/login').then(() => {
//         next()
//       })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })
=======
router.beforeEach((to, from, next) => {
  if (to.path.indexOf('/operate') !== -1 || to.path.indexOf('/Isv') !== -1) {
    return next()
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.

    if (!store.state.user.remumber.remumber_flag) {
      store.dispatch('user/login').then(() => {
        next()
        // next({ path: from.fullPath,
        //   query: {
        //     redirect: to.fullPath
        //   }
        // })
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
>>>>>>> f742d22856d7180c3a237d41b22caa139466f294

export default router
