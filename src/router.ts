import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from '@/store'
import routes from '@/config/routes'
import Http from '@nascent/ecrp-ecrm/src/extends/http'
import loaderNoCacheClose from '@nascent/ecrp-ecrm/src/utils/loaderNoCacheClose'
import { V2_URL } from './utils/globalConstants'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes
})

// 是否有菜单权限·
const isMenuAuth = (to: any, menus: any) => {
  const whitelistRouters = ['/SystemTool']
  if (whitelistRouters.some(r => to.path.startsWith(r))) {
    return true
  }
  function checkAdult (e: any) {
    return e.url === to.path || to.matched.some((r: any) => r.regex.test(to.path)) || to.matched.some((r: any) => to.path === r.path && r.meta && r.meta.authCode === e.code)
  }
  return menus.some(checkAdult)
}

const auth = (to: Route) => {
  return new Promise((resolve, reject) => {
    if (to.matched.some((record: { meta: { requiresAuth: unknown } }) => record.meta.requiresAuth)) {
      // 用户信息是否已经是最新
      if (!store.state.user.remumber.remumber_flag) {
        // 进行获取用户信息
        store.dispatch('user/login').then((data) => {
          // 就否有菜单权限
          if (isMenuAuth(to, data.remumber.remumber_login_info.routerAuth)) {
            resolve(data)
          } else {
            reject(data)
          }
        }).catch(reject)
      } else {
        // 是否有菜单权限
        if (isMenuAuth(to, store.state.user.remumber.remumber_login_info.routerAuth)) {
          resolve(true)
        } else {
          reject(new Error('无菜单权限'))
        }
      }
    } else {
      resolve(true)
    }
  })
}

router.beforeEach((to, from, next) => {
  // 清除上一页面未完成的http请求
  Http.cancel()
  // 判断是否有权限进行路由，无权限跳转至 401
  auth(to)
    .then(() => {
      const router = to.query.router
      if (router) {
        delete to.query.router
        // @ts-ignore
        next({ path: router, query: to.query })
      } else {
        // 是否需要校验企业微信应用类型
        if (to.meta.checkApplicationType) {
          if (store.state.user.remumber.remumber_login_info.applicationType === '1') {
            const x = to.path.indexOf('/', 1)
            let str = '-'
            if (x !== -1) {
              str += to.path.substring(1, x)
            } else {
              str += to.path.substring(1, to.path.length)
            }
            // 第三方应用跳转引导页
            next('/EnterpriseWeChatGuide' + str)
            return false
          } else {
            next()
          }
        } else {
          next()
        }
      }
    })
    .catch((aaa) => {
      const menus = store.state.user.menus
      if (menus && menus.length > 0 && from.path === '/') {
        const menu = store.state.user.menus[0]
        delete to.query.router
        const router = {
          path: menu.path,
          query: to.query
        }
        next(router)
      } else {
        const errRouter = {
          name: 'Errors',
          query: {
            msg: '您无权访问该页面'
          }
        }
        next(errRouter)
      }
    })
    .finally(loaderNoCacheClose)
  // 配置页面加载开始时间
  // @ts-ignore
  window[`__temp__data__${to.name}`] = performance.now()
})

router.afterEach((to, from) => {
  if (V2_URL.get(to.path)) {
    // window.history.pushState({}, '', V2_URL.get(to.path))
    // window.location.reload()
    window.location.replace(window.location.host + V2_URL.get(to.path))
    return
  }
  // 上报页面停留时间
  try {
    // 处理V2跳转到V3的逻辑
    // @ts-ignore
    const time = performance.now() - window[`__temp__data__${from.name}`]
    if (!isNaN(time)) {
      window.logger.custom(0, from.path, parseInt(String(time / 1000), 10))
    }
  } catch (e) {
  }
})

/* 不允许导航到当前位置 报错处理 */
const routerPush = Router.prototype.push
// @ts-ignore
Router.prototype.push = function push (location) {
  // @ts-ignore
  return routerPush.call(this, location).catch(error => error)
}

export default router
