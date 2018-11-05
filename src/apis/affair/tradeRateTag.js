import transData from 'utils/transData'
export default {
  getRateTag: {
    url: '/affair/traderatetag/getRateTag',
    method: 'post',
    transformRequest: transData
  },
  hasTradeRateTagExist: {
    url: '/affair/traderatetag/hasTradeRateTagExist',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/affair/traderatetag/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/affair/traderatetag/deleteById',
    method: 'get'
  }
}
