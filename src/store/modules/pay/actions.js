import http from '@nascent/ecrp-ecrm/src/extends/http'
import api from '@/apis'
import Notification from '@nascent/nui/lib/notification.js'
export default {
  getWxpayList ({ commit }) {
    return new Promise((resolve) => {
      http.fetch(api.guide.pay.getList, { statr: 0, length: 999 }).then(res => {
        if (res.success) {
          const payMap = {}
          commit('setWxpayList', res.result.data.map(item => {
            const value = item.id
            const label = item.mchid + '-' + (item.officialAccount ? item.officialAccount.nickName : '')
            payMap[value] = label
            return {
              ...item,
              value,
              label
            }
          }))
          commit('setWxpayMap', payMap)
          resolve(res.result.data)
        }
      }).catch(error => {
        Notification.error('列表查询失败：' + (error && error.msg ? error.msg : '网络异常'))
      })
    })
  }
}
