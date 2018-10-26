import Vue from 'vue'
import directives from './directives'
import components from './components/global'
import mixins from './mixins/global'
import ets from './extends'
import filters from './filters'

/**
 * 全局注册属性或方法
 */
Vue.use(ets)

/**
 * 注册全局指令
 */
Vue.use(directives)

/**
 * 注册全局组件
 */
Vue.use(components)

/**
 * 全局注册混合
 */
Vue.use(mixins)

/**
 * 全局注册过滤器
 */
filters.register(Vue)
