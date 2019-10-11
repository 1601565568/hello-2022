import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import common from '@nascent/ecrp-ecrm/src/store/modules/common'
import user from '@nascent/ecrp-ecrm/src/store/modules/user'
import operate from './modules/operate'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    common,
    user,
    operate
  }
})
