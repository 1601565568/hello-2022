import Vue, { ComponentOptions, VueConstructor } from 'vue'
import numeral from 'numeral'

export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
    vue.prototype.$numeral = numeral
  }
}

export default Index
