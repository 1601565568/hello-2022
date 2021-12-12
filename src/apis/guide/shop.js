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
  },
  // 查询门店客户转移
  getShopCustomerTransferTaskStatus: {
    url: '/guide/customer/getShopCustomerTransferTaskStatus',
    method: 'get'
  },
  // 创建客户转移任务
  createCustomerTransferTask: {
    url: '/guide/customer/createCustomerTransferTask',
    method: 'post'
  },
  // 关闭客户转移任务
  closeCustomerTransferTask: {
    url: '/guide/customer/closeCustomerTransferTask',
    method: 'post'
  },
  redoCustomerTransferTask: {
    url: '/guide/customer/redoCustomerTransferTask',
    method: 'post'
  },
  findEnterpriseMessage: {
    url: '/Guide/SystemPreset/findEnterpriseMessage',
    method: 'get'
  }
}
