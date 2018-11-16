import transData from 'utils/transData'

export default {
  findSellReward: {
    url: '/Overview/findSellReward',
    method: 'get',
    transformRequest: transData
  },
  getRewardInfo: {
    url: '/Overview/getRewardInfo',
    method: 'get',
    transformRequest: transData
  },
  findGuideSellRanking: {
    url: '/Overview/findGuideSellRanking',
    method: 'get',
    transformRequest: transData
  },
  findShopSellRanking: {
    url: '/Overview/findShopSellRanking',
    method: 'get',
    transformRequest: transData
  },
  findShopList: {
    url: '/core/sgshop/findShopList',
    method: 'get',
    transformRequest: transData
  }
}
