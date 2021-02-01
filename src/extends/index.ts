import Vue, { ComponentOptions, VueConstructor } from 'vue'
import numeral from 'numeral'
import Http from './http/index'

export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
    vue.prototype.$numeral = numeral
    vue.prototype.$http = Http
  }
}

export default Index
