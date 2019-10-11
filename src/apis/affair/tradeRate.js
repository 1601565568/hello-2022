import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryAllRate: { // 所有评价列表
    url: '/affair/traderate/queryAllRateList',
    method: 'post'
  },
  queryArchivedRateList: {
    url: '/affair/traderate/queryArchivedRateList',
    method: 'post'
  },
  getRateArchiveStatusList: {
    url: '/affair/traderate/getRateArchiveStatusList',
    method: 'get'
  },
  getRateTypeList: {
    url: '/affair/traderate/getRateTypeList',
    method: 'get'
  },
  addTradeRadeExplain: {
    url: '/affair/traderateexplain/saveOrUpdate',
    method: 'post'
  },
  tradeRateArchive: {
    url: '/affair/traderate/tradeRateArchive',
    method: 'post'
  },
  reTradeRateArchive: {
    url: '/affair/traderate/reTradeRateArchive',
    method: 'post'
  },
  sendIntegral: {
    url: '/affair/traderate/sendIntegral',
    method: 'post'
  },
  getRateArchivedInfo: {
    url: '/affair/traderate/getRateArchivedInfo',
    method: 'get'
  },
  resetRateArchived: {
    url: '/affair/traderate/resetRateArchived',
    method: 'post',
    transformRequest: transData
  },
  getAnalysisData: {
    url: '/affair/traderate/getAnalysisData',
    method: 'post'
  }
}
