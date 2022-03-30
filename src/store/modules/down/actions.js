export default {
  downAction ({ commit }, payload) {
    commit('setDownAction', payload.status)
    commit('setTop', payload.top)
    commit('setRight', payload.right)
  }
}
