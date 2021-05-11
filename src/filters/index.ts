import Vue, { ComponentOptions, VueConstructor } from 'vue'
import money from './modules/money'

export interface VueNotificationsPlugin {
  register: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  register (vue) {
    vue.filter('moneyStr', money)
  }
}

export default Index
