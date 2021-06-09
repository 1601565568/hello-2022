import Vue, { ComponentOptions, VueConstructor } from 'vue'
import list from './common'

export interface VueNotificationsPlugin {
  installed: boolean,
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}

const Index: VueNotificationsPlugin = {
  installed: false,
  install (Vue, options) {
    if (this.installed) throw new Error('VueNotifications: plugin already installed')
    Object.keys(list).forEach(key => {
      Vue.component((list as any)[key].name || key, (list as any)[key])
    })
    this.installed = true
  }
}

export default Index
