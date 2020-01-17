export default {
  findList: {
    url: '/guide/sgshop/queryListByShop',
    method: 'post'
  },
  findBrandShopList: {
    url: '/core/sgshop/findShopList',
    method: 'get'
  },
  findIsShopLegal: {
    url: '/core/sgshop/findIsShopLegal',
    method: 'get'
  },
  findGroupShopList: {
    url: '/core/sgshop/findGroupShopList',
    method: 'post'
  },
  findShopListByShopIds: {
    url: '/core/sgshop/findShopListByShopIds',
    method: 'post'
  },
  findDigitalShopList: {
    url: '/digital/list',
    method: 'post'
  },
  findDigitalShopByShopId: {
    url: '/digital/findDigitalShopByShopId',
    method: 'get'
  },
  findShopGrade: { // 查询店铺等级信息
    url: '/core/sgshop/findShopGrade',
    method: 'post'
  },
  findShopPage: {
    url: '/core/sgshop/findShopPage',
    method: 'post'
  }
}
