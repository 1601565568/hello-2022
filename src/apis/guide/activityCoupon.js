export default {
  // 查询导购活动列表
  findList: {
    url: '/guide/sgactivitycoupon/queryList',
    method: 'post'
  },
  // 查询store 优惠券列表
  findStoreCouponList: {
    url: '/guide/sgactivitycoupon/queryStoreCoupnList',
    method: 'post'
  },
  // 保存导购活动
  saveActiviCoupon: {
    url: '/guide/sgactivitycoupon/saveActiviCoupon',
    method: 'post'
  },
  // 活动优惠券明细
  findActivityShopCoupon: {
    url: '/guide/sgactivitycoupon/findActivityShopCoupon',
    method: 'post'
  }
}
