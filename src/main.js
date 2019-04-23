// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import Vue from 'vue'
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import App from './App'
import router from 'web-crm/src/router'
import store from './store'
import {i18n} from './i18n'
import echarts from 'echarts'
import './register.js'
import 'normalize.css'
import './style/small/NuiJs/index.scss'
import './style/small/NuiJs/my.scss'
import './style/small/index.pcss'
import numeral from 'numeral'

Vue.prototype.$ELEMENT = { size: 'small' }
Vue.prototype.$echarts = echarts
Vue.prototype.$numeral = numeral
Vue.config.productionTip = false
Vue.config.devtools = true
// OfflinePluginRuntime.install()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

