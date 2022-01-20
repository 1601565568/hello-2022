export default {
  downAction ({ commit }, payload) {
    console.log('downAction01', payload)
    commit('setDownAction', payload.status)
    commit('setTop', payload.top)
    commit('setRight', payload.right)
  }
}
