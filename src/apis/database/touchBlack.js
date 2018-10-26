import transData from 'utils/transData'

export default {
  save: {
    url: '/vip/touchblack/save',
    method: 'post'
  },
  queryTable: {
    url: '/vip/touchblack/queryKdTouchBlackList',
    method: 'post'
  },
  deleteById: {
    url: '/vip/touchblack/deleteById',
    method: 'get',
    timeout: 20000
  },
  batchDeleteById: {
    url: '/vip/touchblack/batchDelete',
    method: 'post',
    timeout: 20000
  },
  importBlack: {
    url: '/vip/touchblack/importBlack',
    method: 'post'
  },
  queryByblackTypeBrandIdandTarget: {
    url: '/vip/touchblack/queryByblackTypeBrandIdandTarget',
    method: 'get'
  },
  insertBySysCustomerIdAndBrandId: {
    url: '/vip/touchblack/insertBySysCustomerIdAndBrandId',
    method: 'post',
    transformRequest: transData
  }
}
