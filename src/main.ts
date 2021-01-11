import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import App from '@nascent/ecrp-ecrm/src/App.vue'
import router from '@nascent/ecrp-ecrm/src/router'
import store from './store'
import { i18n } from '@nascent/ecrp-ecrm/src/i18n'
import LOG from '@nascent/log'
import interceptRouter from '@/constants/interceptRouter'
import queryGroupMsg from '@/utils/queryGroupMsg'
import './register'
import 'normalize.css'
import '@theme/NuiJs/index.scss'
import '@theme/index.pcss'
// 是否启动本地原缓存数据
// import './utils/storageControl'

LOG.init({
  imgUrl: window.g_config.imgUrl,
  sample: window.g_config.sample, // 抽样率，100 = 1%，1 = 100%，默认100
  spmId: window.g_config.spmId,
  fetch: false, // 关闭 fetch，使用img src 方式上报
  report: window.g_config.report,
  startTime: window.g_config.startTime // 自定义测速类页面统计起始时间
})

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

router.beforeEach(async (to:any, from, next) => {
  if (interceptRouter.includes(to.name)) {
    const result = await queryGroupMsg()
    if (result === 1) {
      next('/Greeting')
    } else {
      next()
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
