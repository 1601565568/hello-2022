import Vue, { ComponentOptions, VueConstructor } from 'vue'

export interface VueNotificationsPlugin {
  register: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  register (vue, options) {
  }
}

export default Index
