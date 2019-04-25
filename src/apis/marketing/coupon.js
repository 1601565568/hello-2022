import transData from 'web-crm/src/utils/transData'
export default {
  queryCouponChannel: {
    url: '/marketing/coupon/queryCouponChannel',
    method: 'get'
  },
  queryCouponSendType: {
    url: '/marketing/coupon/queryCouponSendType',
    method: 'get'
  },
  queryTable: {
    url: '/marketing/coupon/queryTable',
    method: 'post'
  },
  getCouponUrl: {
    url: '/marketing/coupon/getCouponUrl',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/marketing/coupon/createCoupon',
    method: 'post'
  },
  checkAuth: {
    url: '/marketing/coupon/checkAuth',
    method: 'get'
  },
  setAuthInvalid: {
    url: '/marketing/coupon/setAuthInvalid',
    method: 'get'
  },
  queryCouponDetail: {
    url: '/marketing/coupon/queryCouponDetaiByShopIdAndId',
    method: 'post'
  },
  deleteById: {
    url: '/marketing/coupon/deleteById',
    method: 'get'
  },
  updateByIdAndJL: {
    url: '/marketing/coupon/updateByIdAndJL',
    method: 'get',
    transformRequest: transData
  },
  queryCouponType: {
    url: '/marketing/coupon/queryCouponType',
    method: 'get'
  },
  groupBySysCustomerId: {
    url: '/marketing/coupon/groupBySysCustomerId',
    method: 'get',
    transformRequest: transData
  }
}
