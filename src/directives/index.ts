import Vue, { ComponentOptions, VueConstructor } from 'vue'
// @ts-ignore
import copy from './modules/copy.js'
// @ts-ignore
import elTableInfiniteScroll from './modules/table-infinite-scroll.js'

export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
    vue.directive('copy', copy)
    vue.directive('el-table-infinite-scroll', elTableInfiniteScroll)
  }
}

export default Index
