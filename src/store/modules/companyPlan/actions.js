import http from '@nascent/ecrp-ecrm/src/extends/http'
import api from '@/apis'
export default {
  getCompanyPlan ({ commit }) {
    return new Promise((resolve) => {
      http.fetch(api.guide.getAppIdletInfo, {}).then(res => {
        if (res.success) {
          const { applicationType, isChatDataSettingReady, isContactSettingReady, isCropReady } = res.result
          commit('setLoad', true)
          commit('setThird', !!applicationType)
          commit('setPortals', !!isCropReady)
          commit('setAddress', !!isChatDataSettingReady)
          commit('setChat', !!isContactSettingReady)
          resolve(true)
        }
      })
    })
  }
}
