import transData from 'web-crm/src/utils/transData'
export default {
  queryTable: {
    url: '/care/tradecare/queryTable',
    method: 'post'
  },
  updateTaskStatus: {
    url: '/care/tradecare/updateTaskStatus',
    method: 'get'
  },
  deleteSmsTemplate: {
    url: '/care/tradecare/deleteSmsTemplate',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/care/tradecare/saveOrUpdate',
    method: 'post'
  },
  hasExistTitleByType: {
    url: '/care/tradecare/hasExistTitleByType',
    method: 'post',
    transformRequest: transData
  },
  queryById: {
    url: '/care/tradecare/queryById',
    method: 'get'
  },
  deleteById: {
    url: '/care/tradecare/deleteById',
    method: 'get'
  },
  getRefundStatusList: {
    url: '/care/tradecare/getRefundStatusList',
    method: 'get'
  },
  queryDetail: {
    url: '/care/tradecare/queryDetail',
    method: 'get'
  },
  updateOrderNum: {
    url: '/care/tradecare/updateOrderNum',
    method: 'get'
  },
  getAnalyzeData: {
    url: '/care/tradecare/getAnalyzeData',
    method: 'get'
  },
  queryUrgePayHistory: {
    url: '/care/tradecare/getUrgePayHistory',
    method: 'post'
  },
  getUrgeEffect: {
    url: '/care/tradecare/getUrgeEffect',
    method: 'post'
  }
}
