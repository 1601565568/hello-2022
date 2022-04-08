import Vue from 'vue'
import Vuex from 'vuex'
// @ts-ignore
import state from './state'
// @ts-ignore
import getters from './getters'
// @ts-ignore
import actions from './actions'
// @ts-ignore
import mutations from './mutations'
// @ts-ignore
import common from '@nascent/ecrp-ecrm/src/store/modules/common'
// @ts-ignore
import user from '@nascent/ecrp-ecrm/src/store/modules/user'
// @ts-ignore
import pay from './modules/pay/index.js'
// @ts-ignore
import companyPlan from './modules/companyPlan/index.js'
// @ts-ignore
import marking from './modules/marking/index.js'
// @ts-ignore
import down from './modules/down/index.js'

Vue.use(Vuex)

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    common,
    user,
    pay,
    companyPlan,
    marking,
    down
  },
  strict: debug
})
