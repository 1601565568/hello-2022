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
    method: 'get'
  },
  findShopListByShopIds: {
    url: '/core/sgshop/findShopListByShopIds',
    method: 'post'
  },
  findDigitalShopList: {
    url: '/digital/list',
    method: 'get'
  },
  findDigitalShopByShopId: {
    url: '/digital/findDigitalShopByShopId',
    method: 'get'
  }
}
