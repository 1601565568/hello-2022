import Vue, { ComponentOptions, VueConstructor } from 'vue'
// @ts-ignore
import copy from './modules/copy.js'

export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
    vue.directive('autofocus', copy)
  }
}

export default Index
