export default {
  findList: {
    url: '/guide/sgwxaccount/findList',
    method: 'post'
  },
  save: {
    url: '/guide/sgwxaccount/save',
    method: 'post'
  },
  delete: {
    url: '/guide/sgwxaccount/delete',
    method: 'post'
  },
  getAuthUrl: {
    url: '/guide/appletcallback/getAuthUrl',
    method: 'post'
  },
  getAppletInfo: { // 小程序信息页面详情
    url: '/guide/wechatsetting/getAppletInfo',
    method: 'get'
  },
  submitTemplateToAudit: { // 提交审核
    url: '/guide/wechatsetting/submitTemplateToAudit',
    method: 'post'
  },
  templateToRelease: { // 发布已审核成功的模板（发布小程序）
    url: '/guide/wechatsetting/templateToRelease',
    method: 'get'
  },
  getAppletCategoryList: { // 查询小程序可选类目
    url: '/guide/wechatsetting/getAppletCategoryList',
    method: 'get'
  },
  getAppletPageList: { // 查询小程序页面配置
    url: '/guide/wechatsetting/getAppletPageList',
    method: 'get'
  },
  getAppletCodeTemplateList: { // 查询模板列表
    url: '/guide/wechatsetting/getAppletCodeTemplateList',
    method: 'post'
  },
  refreshCodeTemplate: { // 同步最新
    url: '/guide/wechatsetting/refreshCodeTemplate',
    method: 'get'
  },
  appletAuth: { // 授权（传入微信回调原始数据）
    url: '/guide/appletcallback/appletAuth',
    method: 'post'
  },
  receive: { // tiket（传入微信回调原始数据）
    url: '/guide/appletcallback/receive',
    method: 'post'
  },
  getMsg: { // msg（传入微信回调原始数据）
    url: '/guide/appletcallback/getMsg',
    method: 'post'
  }
}
