export default {
  queryTable: {
    url: '/affair/affairlist/queryTable',
    method: 'post'
  },
  countNumberOfAffair: {
    url: '/affair/affairlist/getAffairCountNumbers',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/affair/affairlist/saveOrUpdate',
    method: 'post'
  },
  saveOrUpdateBatch: {
    url: '/affair/affairlist/saveOrUpdateBatch',
    method: 'post'
  },
  queryAffairTypeOption: {
    url: '/affair/affairlist/queryAffairTypeOption',
    method: 'post'
  },
/*  getCountAffairList: {
    url: '/affair/affairlist/getCountAffairList',
    method: 'post'
  }, */
  queryAffairTypeList: {
    url: '/affair/affairlist/queryAffairTypeList',
    method: 'get'
  },
  saveHandleInfo: {
    url: '/affair/affairlist/saveHandleInfo',
    method: 'post'
  },
  saveBatchHandleInfo: {
    url: '/affair/affairlist/saveBatchHandleInfo',
    method: 'post'
  },
  deleteByIds: {
    url: '/affair/affairlist/deleteByIds',
    method: 'get'
  },
  getAffairStatisticsData: {
    url: '/affair/affairlist/getAffairStatisticsData',
    method: 'post'
  },
  getCustomerInfo: {
    url: '/affair/affairlist/getCustomerInfo',
    method: 'get'
  },
  getAffairListByOutNick: {
    url: '/affair/affairlist/getAffairListByOutNick',
    method: 'get'
  },
  getUserInfo: {
    url: '/affair/affairlist/getUserInfo',
    method: 'get'
  }
}
