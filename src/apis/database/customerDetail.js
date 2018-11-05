import transData from 'utils/transData'
export default {
  queryCouponBySysCustomerId: {
    url: '/marketing/coupon/queryTableBySysCustomerId',
    method: 'post'
  },
  queryShopCustomerBySysCustomerId: {
    url: '/core/customer/queryShopCustomerBySysCustomerId',
    method: 'post'
  },
  queryCustomerDetail: {
    url: '/core/customer/queryCustomerDetail',
    method: 'get',
    transformRequest: transData
  }
}
