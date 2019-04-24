import Vue from 'vue'
import directives from 'web-crm/src/directives'
import directivesPrivate from './directives'
import components from './components/global'
import mixins from 'web-crm/src/mixins/global'
import mixinsPrivate from './mixins'
import ets from 'web-crm/src/extends'
import etsPrivate from './extends'
import filters from 'web-crm/src/filters'
import filtersPrivate from './filters'

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
Vue.use(components)

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
