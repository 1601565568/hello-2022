/*
 * @Descripttion:
 * @Author: yuye.huang
 * @Date: 2020-07-17 14:49:49
 * @LastEditors: yuye.huang
 * @LastEditTime: 2021-06-16 15:51:11
 */
export default {
  findList: {
    url: '/guide/sgwxaccount/findList',
    method: 'post'
  },
  // 取消授权，删除小程序信息
  delete: {
    url: '/guide/sgwxaccount/delete',
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
