const prefix = 'bindPlatformAccount/config/'
export default {
  getResultPageConfig: {
    url: `${prefix}getResultPageConfig`,
    method: 'get'
  },
  updateResultPageConfig: {
    url: `${prefix}updateResultPageConfig`,
    method: 'post'
  }
}
