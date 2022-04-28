import ENV from '@/constants/env'
export default {
  setAliasGuidename ({ commit }, payload) {
    const aliasGuideName = ENV[payload].guideName
    commit('_setAliasGuidename', aliasGuideName)
  }
}
