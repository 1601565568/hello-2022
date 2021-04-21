import http from '@nascent/ecrp-ecrm/src/extends/http'
import api from '@/apis'
import Notification from '@nascent/nui/lib/notification.js'
export default {
  getWxpayList ({ commit }) {
    return new Promise((resolve) => {
      http.fetch(api.guide.pay.getList, { statr: 0, length: 999 }).then(res => {
        if (res.success) {
          commit('setWxpayList', res.result.data)
          resolve(res.result.data)
        }
      }).catch(error => {
        Notification.error('列表查询失败：' + (error && error.msg ? error.msg : '网络异常'))
      })
    })
  }
}
