import Vue, { ComponentOptions, VueConstructor } from 'vue'
import money from './modules/money'
import str2Json from './modules/str2Json'

export interface VueNotificationsPlugin {
  register: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  register (vue) {
    vue.filter('moneyStr', money)
    vue.filter('str2Json', str2Json)
  }
}

export default Index
