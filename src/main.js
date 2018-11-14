// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import Vue from 'vue'
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import App from './App'
import router from './router'
import store from './store'
import {i18n} from './i18n'
import echarts from 'echarts'
import './register.js'
import 'apusjs-log'
import 'normalize.css'
import './style/small/NuiJs/index.scss'
import './style/small/index.pcss'

Vue.prototype.$ELEMENT = { size: 'small' }
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.config.devtools = true
// OfflinePluginRuntime.install()
window.LOG.setConfig({
  imgUrl: '//wx-smartcrm.image.alimmdn.com/CRM-Enterprise-Web/temp/r.png?',
  sample: 1, // 抽样率，100 = 1%，1 = 100%，默认100
  spmId: 'CRM-Enterprise-Web',
  startTime: new Date().getTime() // 自定义测速类页面统计起始时间
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {App}
})
