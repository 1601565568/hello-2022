import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryByShopId: {
    url: '/kdjl/jlbasesetting/queryByShopId',
    method: 'get',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/kdjl/jlbasesetting/saveOrUpdate',
    method: 'post'
  },
  queryCompany: {
    url: '/kdjl/jlbasesetting/queryCompany',
    method: 'post'
  },
  saveOrUpdateFee: {
    url: '/kdjl/jlbasesetting/saveOrUpdateFee',
    method: 'post'
  },
  queryFee: {
    url: '/kdjl/jlbasesetting/queryFee',
    method: 'get',
    transformRequest: transData
  }
}
