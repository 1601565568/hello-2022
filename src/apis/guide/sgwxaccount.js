export default {
  findList: {
    url: '/guide/sgwxaccount/findList',
    method: 'post'
  },
  save: {
    url: '/guide/sgwxaccount/save',
    method: 'post'
  },
  getAuthUrl: {
    url: '/guide/appletcallback/getAuthUrl',
    method: 'post'
  },
  // submitTemplateToAudit: { // 提交审核
  //   url: '/guide/wechatsetting/submitTemplateToAudit',
  //   method: 'post'
  // },
  // templateToRelease: { // 发布已审核成功的模板（发布小程序）
  //   url: '/guide/wechatsetting/templateToRelease',
  //   method: 'get'
  // },
  // getAppletCategoryList: { // 查询小程序可选类目
  //   url: '/guide/wechatsetting/getAppletCategoryList',
  //   method: 'get'
  // },
  // getAppletPageList: { // 查询小程序页面配置
  //   url: '/guide/wechatsetting/getAppletPageList',
  //   method: 'get'
  // },
  appletAuth: { // 授权（传入微信回调原始数据）
    url: '/guide/appletcallback/appletAuth',
    method: 'get'
  },
  receive: { // tiket（传入微信回调原始数据）
    url: '/guide/appletcallback/receive',
    method: 'get'
  },
  getMsg: { // msg（传入微信回调原始数据）
    url: '/guide/appletcallback/getMsg',
    method: 'get'
  }
}
