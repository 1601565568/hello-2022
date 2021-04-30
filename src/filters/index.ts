import Vue, { ComponentOptions, VueConstructor } from 'vue'
import str2Json from './modules/str2Json'

export interface VueNotificationsPlugin {
  register: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  register (vue, options) {
    vue.filter('str2Json', str2Json)
  }
}

export default Index
