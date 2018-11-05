import transData from 'utils/transData'

export default {
  queryTable: {
    url: '/integral/integral/queryTable',
    method: 'post'
  },
  queryTableBySysCustomerId: {
    url: '/integral/integral/queryTableBySysCustomerId',
    method: 'post'
  },
  // 主要来源
  getIntegralSourceAndType: {
    url: '/integral/integral/getIntegralSourceAndType',
    method: 'get'
  },
  // 次要积分来源
  minorIntegralTypeByType: {
    url: '/integral/integral/minorIntegralTypeByType',
    method: 'get',
    transformRequest: transData
  },
  // 获取所有积分主要来源和次要来源
  allIntegralType: {
    url: '/integral/integral/allIntegralType',
    method: 'get',
    transformRequest: transData
  }
}
