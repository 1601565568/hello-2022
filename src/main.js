import Vue from 'vue'
import App from 'web-crm/src/App.vue'
import router from 'web-crm/src/router'
import store from './store'
import { i18n } from 'web-crm/src/i18n'
import './register'
import 'normalize.css'
import './style/small/NuiJs/index.scss'
import './style/small/index.pcss'
import * as Sentry from '@sentry/browser'
// 是否启动本地原缓存数据
import './utils/storageControl'

if (process.env.VUE_APP_SENTRY_SWITCH === 'true') {
  Vue.prototype.$sentry = Sentry
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [new Sentry.Integrations.Vue({ Vue })],
    release: process.env.VUE_APP_SENTRY_RELEASE,
    environment: process.env.NODE_ENV
  })
}

Vue.prototype.$ELEMENT = { size: 'small' }
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
