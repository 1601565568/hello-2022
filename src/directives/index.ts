import Vue, { ComponentOptions, VueConstructor } from 'vue'

export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
  }
}

export default Index
