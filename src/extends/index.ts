import Vue, { ComponentOptions, VueConstructor } from 'vue'
import axios from 'axios'
import numeral from 'numeral'
console.log(axios)
axios.interceptors.request.use(
  config => {
    console.log(config)
    return config
  },
  err => {
    return Promise.reject(err)
  })
export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
    vue.prototype.$numeral = numeral
  }
}

export default Index
