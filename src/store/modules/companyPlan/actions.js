import http from '@nascent/ecrp-ecrm/src/extends/http'
import api from '@/apis'
export default {
  getCompanyPlan ({ commit }) {
    return new Promise((resolve) => {
      http.fetch(api.guide.getAppIdletInfo, {}).then(res => {
        if (res.success) {
          const { applicationType, isChatDataSettingReady, isContactSettingReady } = res.result
          commit('setLoad', true)
          commit('setThird', !applicationType)
          commit('setPortals', !applicationType)
          commit('setAddress', !applicationType || !!isChatDataSettingReady)
          commit('setChat', !applicationType || !!isContactSettingReady)
          resolve(true)
        }
      })
    })
  }
}
