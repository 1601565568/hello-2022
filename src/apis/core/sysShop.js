import transData from 'utils/transData'
export default {
  queryShopList: {
    url: '/core/sgshop/queryShopList',
    method: 'post'
  },
  updateShopExtension: {
    url: '/core/sgshop/updateShopExtension',
    method: 'post'
  },
  queryAllSysShop: {
    url: '/core/sysshop/queryAllSysShop',
    method: 'post'
  },
  queryOnlineShopList: {
    url: '/core/sysshop/queryOnlineShopList',
    method: 'post'
  },
  queryOfflineShopList: {
    url: '/core/sysshop/queryOfflineShopList',
    method: 'post'
  },
  queryShopByBrandId: {
    url: '/core/sysshop/queryShopByBrandId',
    method: 'post'
  },
  saveOrUpdateOffline: {
    url: '/core/sysshop/saveOrUpdateOffline',
    method: 'post'
  },
  saveOrUpdateOnline: {
    url: '/core/sysshop/saveOrUpdateOnline',
    method: 'post'
  },
  hasNameExist: {
    url: '/core/sysshop/hasNameExist',
    method: 'post',
    transformRequest: transData
  },
  queryShopByPlatFormAndShopByTadId: {
    url: '/core/sysshop/queryShopByPlatFormAndShopByTadId',
    method: 'post',
    transformRequest: transData
  },
  queryOnlineById: {
    url: '/core/sysshop/queryOnlineById',
    method: 'get'
  },
  queryOfflineById: {
    url: '/core/sysshop/queryOfflineById',
    method: 'get'
  },
  // 品牌店铺下拉列表
  getBrandList: {
    url: '/core/sgshop/getBrandList',
    method: 'get'
  },
  // 线下门店删除
  underDetele: {
    url: '/core/sysshop/underDetele',
    method: 'post',
    transformRequest: transData
  },
  batchDetele: {
    url: '/core/sysshop/batchDetele',
    method: 'post',
    transformRequest: transData
  },
  queryShop: {
    url: '/core/sgshop/getShopBrand',
    method: 'post'
  }
}
