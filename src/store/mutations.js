import * as types from './mutations_types'

export default {
  [types.SHOW_LOADING] (state) {
    state.ajax_loading = true
  },

  [types.HIDE_LOADING] (state) {
    state.ajax_loading = false
  },

  [types.UPDATE_LOGIN_REFRESH] (state, type) {
    state.is_login_refresh = type
  }
}
