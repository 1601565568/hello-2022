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

export default router
