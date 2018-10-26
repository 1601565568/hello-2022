export default {
  // 查询满减/送活动列表
  findPreferentialActivitiesList: {
    url: '/guide/preferentialactivities/findList',
    method: 'post'
  },
  // 查询活动详情
  queryActivityDetail: {
    url: '/guide/preferentialactivities/queryActivityDetail',
    method: 'get'
  },
  // 删除满减/送活动
  deletePreferentialActivity: {
    url: '/guide/preferentialactivities/deleteActivity',
    method: 'get'
  },
  // 保存满减/送活动
  saveOrUpdateActivity: {
    url: '/guide/preferentialactivities/saveOrUpdateActivity',
    method: 'post'
  },
  // 结束满减/送活动
  endPreferentialActivity: {
    url: '/guide/preferentialactivities/endActivity',
    method: 'get'
  },
  // 查询可添加的商品列表
  findGoodsList: {
    url: '/guide/preferentialactivities/findGoodsList',
    method: 'post'
  },
  // 查询活动指定的商品列表
  queryActivityGoods: {
    url: '/guide/preferentialactivities/queryActivityGoods',
    method: 'post'
  },
  // 查询可添加的门店列表
  findShopList: {
    url: '/guide/preferentialactivities/findShopList',
    method: 'post'
  },
  // 查询活动指定的门店列表
  queryActivityShops: {
    url: '/guide/preferentialactivities/queryActivityShops',
    method: 'post'
  },
  // 查询满减/送是否可选择全部商品
  queryGoodsOptional: {
    url: '/guide/preferentialactivities/queryGoodsOptional',
    method: 'post'
  },
  // 查询满减/送是否可选择全部门店
  queryShopOptional: {
    url: '/guide/preferentialactivities/queryShopOptional',
    method: 'post'
  },
  //拼团列表删除guide/wmspellgroup/findList
  deleteSpellGroup: {
    url: '/guide/wmspellgroup/deleteSpellGroup',
    method: 'get'
  },
  //拼团列表
  wmspellgroupFindList: {
    url: '/guide/wmspellgroup/findList',
    method: 'get'
  },
  // 查询品牌下商城可用优惠券列表
  findStoreCouponListByBrandId: {
    url: '/coupon/storecoupon/findStoreCouponListByBrandId',
    method: 'get'
  }
}
