export default {
  // 查询导购活动列表
  findList: {
    url: '/guide/sgactivitycoupon/queryList',
    method: 'post'
  },
  // 查询store 优惠券列表
  findStoreCouponList: {
    url: '/guide/sgactivitycoupon/findStoreCouponList',
    method: 'post'
  },
  mockCoupon: {
    url: '/guide/sgactivitycoupon/mockCoupon',
    method: 'post'
  },
  // 保存导购活动
  saveActiviCoupon: {
    url: '/guide/sgactivitycoupon/saveActiviCoupon',
    method: 'post'
  },
  // 查询优惠券店铺适用范围
  findCouponShop: {
    url: '/guide/sgactivitycoupon/findCouponShop',
    method: 'post'
  },
  // 活动优惠券明细
  findActivityShopCoupon: {
    url: '/guide/sgactivitycoupon/findActivityShopCoupon',
    method: 'post'
  }
}
