import transData from 'web-crm/src/utils/transData'
export default {
  queryTradeRateCat: { // 所有评价列表
    url: '/affair/traderatecat/queryTradeRateCat',
    method: 'post',
    transformRequest: transData
  },
  hasTradeRateCatExist: {
    url: '/affair/traderatecat/hasTradeRateCatExist',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/affair/traderatecat/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/affair/traderatecat/deleteById',
    method: 'get'
  }
}
