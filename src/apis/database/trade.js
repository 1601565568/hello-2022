import transData from 'utils/transData'
export default {
  // 根据系统会员id查交易记录
  queryTableBySysCustomerId: {
    url: '/core/trade/queryTableBySysCustomerId',
    method: 'post'
  },
  queryOrderByOutTradeId: {
    url: '/core/trade/queryOrderByOutTradeId',
    method: 'get',
    transformRequest: transData
  },
  queryTable: {
    url: '/core/trade/queryTable',
    method: 'post',
    timeout: 30000
  },
  getOutState: {
    url: '/core/trade/getOutState',
    method: 'post'
  },
  getTradeFrom: {
    url: '/core/trade/getTradeFrom',
    method: 'post'
  },
  getTradeBySysCustomerId: {
    url: '/core/trade/getTradeBySysCustomerId',
    method: 'post'
  },
  queryMemoByOutTradeId: {
    url: '/core/trade/queryMemoByOutTradeId',
    method: 'post',
    transformRequest: transData
  },
  updateMemo: {
    url: '/core/trade/updateMemo',
    method: 'post',
    transformRequest: transData
  },
  batchUpdateMemo: {
    url: '/core/trade/batchUpdateMemo',
    method: 'post',
    transformRequest: transData
  },
  sendSms: {
    url: '/core/trade/sendSms',
    method: 'post',
    transformRequest: transData
  }
}
