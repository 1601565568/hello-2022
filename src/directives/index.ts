/*
 * @Date: 2022-03-30 14:04:17
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-15 17:08:02
 * @FilePath: \ECRP-SG-WEB\src\directives\index.ts
 */
import Vue, { ComponentOptions, VueConstructor } from 'vue'
// @ts-ignore
import InfiniteScroll from '@nascent/nui/lib/infinite-scroll'
// @ts-ignore
import copy from './modules/copy.js'
// @ts-ignore
import elTableInfiniteScroll from './modules/table-infinite-scroll.js'
// @ts-ignore
import platformShow from './modules/platform-show.js'

export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
    vue.directive('copy', copy)
    vue.directive('infinite-scroll', InfiniteScroll)
    vue.directive('el-table-infinite-scroll', elTableInfiniteScroll)
    vue.directive('platform-show', platformShow)
  }
}

export default Index
