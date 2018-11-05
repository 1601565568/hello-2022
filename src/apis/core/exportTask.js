export default {
  queryTable: {
    url: '/core/exporttask/queryTable',
    method: 'post'
  },
  validateCaptcha: {
    url: '/core/exporttask/validateCaptcha',
    method: 'get'
  },
  download: {
    url: '/core/exporttask/downloadFile',
    method: 'get',
    responseType: 'blob',
    timeout: 600000
  }
}
