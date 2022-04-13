import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import App from '@nascent/ecrp-ecrm/src/App.vue'
// import App from '@nascent/ecrp-ecrm/src/App.vue'
// import router from '@nascent/ecrp-ecrm/src/router'
import router from './router'
import store from './store'
import { i18n } from '@nascent/ecrp-ecrm/src/i18n'
import LOG from '@nascent/log'
import interceptRouter from '@/constants/interceptRouter'
import { thirdRouter } from './constants/thirdRouter'
import queryGroupMsg from '@/utils/queryGroupMsg'
import addRouter from '@/utils/addRouter'
import './register'
import 'normalize.css'
import '@theme/NuiJs/index.scss'
import '@theme/index.pcss'
// 是否启动本地原缓存数据
// import './utils/storageControl'

import '@/assets/fonts/iconfont.css'
import { eventProxy } from './track/logForClick'
LOG.init({
  imgUrl: window.g_config.imgUrl,
  sample: window.g_config.sample, // 抽样率，100 = 1%，1 = 100%，默认100
  spmId: window.g_config.spmId,
  fetch: false, // 关闭 fetch，使用img src 方式上报
  report: window.g_config.report,
  startTime: window.g_config.startTime, // 自定义测速类页面统计起始时间
  userInfo: store.state.user
})

eventProxy({
  click: {},
  input: {
    excludes: ['input', 'textarea']
  }
}, 500)

if (window.g_config.sentry.report === true) {
  Vue.prototype.$sentry = Sentry
  Sentry.init({
    dsn: window.g_config.sentry.dsn,
    integrations: [new Sentry.Integrations.Vue({ Vue })],
    release: window.g_infos.name + '.' + window.g_infos.version,
    environment: process.env.NODE_ENV
  })
}

Vue.prototype.$ELEMENT = {
  size: 'small',
  matchOSS: (url: string) => /cn-zhangjiakou\.log\.aliyuncs\.com\/logstores/.exec(url)
}
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'
const qaDocs = ''
Vue.prototype.$isQa = process.env.VUE_APP_THEME === 'QA'
Vue.prototype.$qaDocs = qaDocs
Vue.prototype.$isShowDocs = process.env.VUE_APP_THEME !== 'QA' || qaDocs.length > 0
// 和三方需求功能相同所以隐藏
// router.beforeEach(async (to:any, from, next) => {
//   if (interceptRouter.includes(to.name)) {
//     const result = await queryGroupMsg()
//     if (result === 1) {
//       const name1 = to.matched[0].name || ''
//       const name2 = to.matched[1].name || ''
//       const random = new Date().getTime()
//       router.addRoutes([addRouter(name1, name2, name1 + random, 'Greeting')])
//       next({ name: (name1 + random) })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

// 三方路由拦截
router.beforeEach(async (to, from, next) => {
  if (thirdRouter[to.path]) {
    if (!store.state.companyPlan.isLoad) {
      await store.dispatch('companyPlan/getCompanyPlan')
    }
    const typeObj = thirdRouter[to.path]
    const companyPlanState = store.state.companyPlan
    if (companyPlanState[typeObj.type] === typeObj.value) {
      next()
    } else {
      // 为了解决node包中写的神奇的导航栏判断
      const name1 = to.matched[0].name || ''
      const name2 = to.matched[1].name || ''
      const random = new Date().getTime()
      router.addRoutes([addRouter(name1, name2, name1 + random, 'ThirdAuth')])
      next({ name: (name1 + random) })
    }
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// 清除行政区划缓存
localStorage.removeItem('DS_area')
