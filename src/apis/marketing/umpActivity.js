import transData from 'utils/transData'

export default {
  queryTable: {
    url: '/umpactivity/umpactivity/queryTable',
    method: 'post'
  },
  getDataSource: {
    url: '/umpactivity/umpactivity/getDataSource',
    method: 'get'
  },
  checkAcitvityName: {
    url: '/umpactivity/umpactivity/checkAcitvityName',
    method: 'post',
    transformRequest: transData
  },
  checkShopAuth: {
    url: '/umpactivity/umpactivity/checkShopAuth',
    method: 'get'
  },
  setAuthInvalid: {
    url: '/umpactivity/umpactivity/setAuthInvalid',
    method: 'get'
  },
  saveUmpActivity: {
    url: '/umpactivity/umpactivity/saveUmpActivity',
    method: 'post'
  },
  getActivityById: {
    url: '/umpactivity/umpactivity/getActivityById',
    method: 'get'
  },
  closeUmpActivity: {
    url: '/umpactivity/umpactivity/closeUmpActivity',
    method: 'post',
    transformRequest: transData
  },
  queryCustomerGroupTable: {
    url: '/umpactivity/umpactivity/queryCustomerGroupTable',
    method: 'post'
  },
  queryCustomerListTable: {
    url: '/umpactivity/umpactivity/queryCustomerListTable',
    method: 'post'
  },
  queryAnalysisTable: {
    url: '/umpactivity/umpactivity/queryAnalysisTable',
    method: 'post'
  },
  addActivityGroup: {
    url: '/umpactivity/umpactivity/addActivityGroup',
    method: 'post',
    transformRequest: transData
  },
  reSubmitActivityGroup: {
    url: '/umpactivity/umpactivity/reSubmitActivityGroup',
    method: 'post',
    transformRequest: transData
  }
}
