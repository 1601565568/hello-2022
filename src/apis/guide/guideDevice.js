import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

const prefix = 'guide/guideDevice/'

export default {
  getBindableYkDeviceList: {
    url: prefix + 'getBindableYkDeviceList'
  },
  bind: {
    url: prefix + 'bind',
    method: 'POST',
    request: function () {
      return apiRequestConfirm('已选择的个人号设备绑定给该导购，绑定后无法更换绑定')
    }
  }
}
