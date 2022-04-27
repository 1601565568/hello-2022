/*
 * @Date: 2022-04-26 16:48:39
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-26 17:11:26
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
import down from './modules/down.js'

export interface VueNotificationsPlugin {
  install: (vue: VueConstructor, pluginOptions?: ComponentOptions<Vue>) => void,
}
const Index: VueNotificationsPlugin = {
  install (vue, options) {
    vue.directive('copy', copy)
    vue.directive('infinite-scroll', InfiniteScroll)
    vue.directive('el-table-infinite-scroll', elTableInfiniteScroll)
    vue.directive('down', down)
  }
}

export default Index
