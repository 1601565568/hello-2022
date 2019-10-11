import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryShops: {
    url: '/core/datascreen/queryShops',
    method: 'post',
    transformRequest: transData
  },
  queryGrades: {
    url: '/core/datascreen/queryGrades',
    method: 'post',
    transformRequest: transData
  },
  querySales: {
    url: '/core/datascreen/querySales',
    method: 'post',
    transformRequest: transData
  },
  querySource: {
    url: '/core/datascreen/querySource',
    method: 'post',
    transformRequest: transData
  },
  queryDataScreen: {
    url: '/core/datascreen/queryDataScreen',
    method: 'post'
  },
  queryActivity: {
    url: '/core/datascreen/queryActivity',
    method: 'get'
  }
}
