import Vue from 'vue'
import directives from '@nascent/ecrp-ecrm/src/directives'
import directivesPrivate from './directives'
import Components from '@nascent/ecrp-ecrm/src/components'
import ComponentsPrivate from './components'
import mixins from '@nascent/ecrp-ecrm/src/mixins'
import mixinsPrivate from './mixins'
import ets from '@nascent/ecrp-ecrm/src/extends'
import etsPrivate from './extends'
import filters from '@nascent/ecrp-ecrm/src/filters'
import filtersPrivate from './filters'
import InfiniteLoading from 'vue-infinite-loading'
import * as allIcons from '@ant-design/icons'
import * as allIconsPrivate from '../.temp/icons-pro'
import Icon from '@nascent/icons-vue'
// @ts-ignore
import waterfall from 'vue-waterfall2'
/**
 * 全局注册图标
 */
Icon.add(...Object.keys(allIcons).map(key => (allIcons as any)[key]))
Icon.add(...Object.keys(allIconsPrivate).map(key => (allIconsPrivate as any)[key]))
Vue.use(Icon)

/**
 * 全局注册属性或方法
 */
Vue.use(ets)
Vue.use(etsPrivate)

/**
 * 注册全局指令
 */
Vue.use(directives)
Vue.use(directivesPrivate)

/**
 * 注册全局组件
 */
Vue.use(Components)
Vue.use(ComponentsPrivate)
Vue.use(waterfall)
const confInfiniteLoading: any = {
  slots: {
    spinner: '加载中…',
    noResults: '暂无数据',
    noMore: '没有更多数据',
    error: '网络异常',
    errorBtnText: '网络异常'
  }
}

Vue.use(InfiniteLoading, confInfiniteLoading)

/**
 * 全局注册混合
 */
Vue.use(mixins)
Vue.use(mixinsPrivate)

/**
 * 全局注册过滤器
 */
filters.register(Vue)
filtersPrivate.register(Vue)
