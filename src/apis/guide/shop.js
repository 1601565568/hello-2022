export default {
  queryShopOption: {
    url: '/guide/sgshop/queryShopOption',
    method: 'get'
  },
  deleteShop: {
    url: '/guide/sgshop/deleteShop',
    method: 'get'
  },
  saveOrUpdateShop: {
    url: '/guide/sgshop/saveOrUpdateShop',
    method: 'post'
  },
  findNameShop: {
    url: '/guide/sgshop/findNameShop',
    method: 'post'
  },
  findList: {
    url: '/guide/sgshop/queryListByShop',
    method: 'post'
  },
  initBrandList: {
    url: '/core/common/queryBrandOptions',
    method: 'post'
  },
  queryGuideListByBrandId: {
    url: '/guide/guide/queryGuideListByBrandId',
    method: 'post'
  },
  upLoadShopFile: {
    url: '/guide/sgshop/upLoadShopFile',
    method: 'post'
  },
  queryAreaTree4Component: {
    url: '/core/common/queryAreaTree4Component',
    method: 'post'
  }
}
