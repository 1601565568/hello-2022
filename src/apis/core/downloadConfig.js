import transData from 'web-crm/src/utils/transData'

export default {
  queryDownLoadConfig: {
    url: '/core/downloadconfig/queryDownLoadConfig',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/core/downloadconfig/saveOrUpdate',
    method: 'post',
    transformRequest: transData
  },
  validateMobile: {
    url: '/core/downloadconfig/validateMobile',
    method: 'get'
  },
  sendCaptcha: {
    url: '/core/downloadconfig/sendCaptcha',
    method: 'post',
    transformRequest: transData
  },
  closeDownloadAuthValid: {
    url: '/core/downloadconfig/closeDownloadAuthValid',
    method: 'get'
  }

}
