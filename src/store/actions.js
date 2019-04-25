import * as types from './mutations_types'

export default {
  show_loading: ({
    commit
  }) => {
    return new Promise((resolve) => {
      commit(types.SHOW_LOADING)
      resolve()
    })
  },

  hide_loading: ({
    commit
  }) => {
    return new Promise((resolve) => {
      commit(types.HIDE_LOADING)
      resolve()
    })
  }
}
