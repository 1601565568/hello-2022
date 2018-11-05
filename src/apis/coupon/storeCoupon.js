export default {
  // 查询门店优惠券table列表
  queryStoreCouponList: {
    url: '/coupon/storecoupon/queryStoreCouponList',
    method: 'post'
  },
  // 查询门店优惠券table列表
  queryCouponList: {
    url: '/coupon/storecoupon/queryCouponList',
    method: 'post'
  },
  // 保存或更新门店优惠券
  saveOrUpdateCoupon: {
    url: '/coupon/storecoupon/saveOrUpdateCoupon',
    method: 'post'
  },
  // 删除门店优惠券
  deleteCoupon: {
    url: '/coupon/storecoupon/deleteCoupon',
    method: 'get'
  },
  // 更新门店优惠券启用状态
  updateStatus: {
    url: '/coupon/storecoupon/updateStatus',
    method: 'get'
  },
  // 更新门店优惠券公开状态
  updateCommonStatus: {
    url: '/coupon/storecoupon/updateCommonStatus',
    method: 'get'
  },
  // 查询当前有效的门店优惠券列表
  queryValidCouponList: {
    url: '/coupon/storecoupon/queryValidCouponList',
    method: 'get'
  },
  // 追加优惠券数量
  updateCouponMaxAmount: {
    url: '/coupon/storecoupon/updateCouponMaxAmount',
    method: 'get'
  },
  // 查询优惠券使用明细列表
  queryLogUsedList: {
    url: '/coupon/storecouponlog/queryLogList',
    method: 'post'
  },
  // 查询优惠券可用店铺
  findValidityShop: {
    url: '/coupon/storecoupon/findValidityShop',
    method: 'post'
  }
}
