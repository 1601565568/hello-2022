import transData from 'utils/transData'

export default {
  queryTable: {
    url: '/core/kdgoods/queryTable',
    method: 'post'
  },
  queryGoodCategory: {
    url: '/core/kdgoods/queryGoodsCategory',
    method: 'get'
  },
  importKdGoods: {
    url: '/core/kdgoods/importKdGoods',
    method: 'post'
  },
  goodDetail: {
    url: '/core/kdgoods/queryGoodeDetail',
    method: 'post',
    transformRequest: transData
  },
  getGoodsByIds: {
    url: '/core/kdgoods/getGoodsByIds',
    method: 'get',
    transformRequest: transData
  }
}
