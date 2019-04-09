export default {
  // 查询小程序table列表
  getAppletList: {
    url: '/guide/wechatsetting/getAppletList',
    method: 'post'
  },
  // 代码模板列表
  getCodeTemplateList: {
    url: '/guide/wechatsetting/getAppletCodeTemplateList',
    method: 'post'
  },
  // 同步最新的模板
  refreshCodeTemplate: {
    url: '/guide/wechatsetting/refreshCodeTemplate',
    method: 'get'
  },
  // 查询草稿箱列表
  getTemplateDraftList: {
    url: '/guide/wechatsetting/getTemplateDraftList',
    method: 'get'
  },
  // 将草稿选择为模板
  addDraftToTemplate: {
    url: '/guide/wechatsetting/addDraftToTemplate',
    method: 'get'
  },
  // 设置服务器地址
  setModifyDomain: {
    url: '/guide/wechatsetting/setModifyDomain',
    method: 'post'
  },
  // 查询配置信息
  getDomainInfo: {
    url: '/guide/wechatsetting/getDomainInfo',
    method: 'get'
  },
  // 发布模板
  templateToRelease: {
    url: '/guide/wechatsetting/templateToRelease',
    method: 'get'
  },
  // 提交模板审核
  submitTemplateToAudit: {
    url: '/guide/wechatsetting/submitTemplateToAudit',
    method: 'post'
  },
  // 获取小程序的第三方提交代码的页面配置列表
  getAppletPageList: {
    url: '/guide/wechatsetting/getAppletPageList',
    method: 'get'
  },
  // 获取授权小程序帐号的可选类目
  getAppletCategoryList: {
    url: '/guide/wechatsetting/getAppletCategoryList',
    method: 'get'
  },
  // 查询域名配置
  wechatsettingGetDomainInfo: {
    url: '/guide/wechatsetting/getDomainInfo',
    method: 'get'
  },
  // 查询小程序列表
  wechatsettingGetAppletList: {
    url: '/guide/wechatsetting/getAppletList',
    method: 'post'
  },
  // 查询小程序可选类目
  wechatsettingGetAppletCategoryList: {
    url: '/guide/wechatsetting/getAppletCategoryList',
    method: 'get'
  },
  // 查询小程序页面配置
  wechatsettingGetAppletPageList: {
    url: '/guide/wechatsetting/getAppletPageList',
    method: 'get'
  },
  // 查询已审核成功的模板
  getAuthedAppletCodeTemplate: {
    url: '/guide/wechatsetting/getAuthedAppletCodeTemplate',
    method: 'get'
  },
  // 查询模板列表
  getAppletCodeTemplateList: {
    url: '/guide/wechatsetting/getAppletCodeTemplateList',
    method: 'post'
  },
  // 删除模板
  deleteTemplate: {
    url: '/guide/wechatsetting/deleteTemplate',
    method: 'get'
  },
  // 查询模板详情信息
  getTemplateInfo: {
    url: '/guide/wechatsetting/getTemplateInfo',
    method: 'get'
  },
  // 获取体验二维码
  getQrcode: {
    url: '/guide/wechatsetting/getQrcode',
    method: 'get'
  },
  // 上传代码模板
  codeTemplateUpload: {
    url: '/guide/wechatsetting/codeTemplateUpload',
    method: 'post'
  },
  // 审核撤回
  auditingRevert: {
    url: '/guide/wechatsetting/auditingRevert',
    method: 'get'
  },
  // 查询定时服务列表
  findServiceExecutionList: {
    url: '/operate/action/findServiceExecutionList',
    method: 'post'
  },
  // 更新服务状态
  updateServiceExecution: {
    url: '/operate/action/updateServiceExecution',
    method: 'post'
  },
  // 数据库查询
  sqlQuery: {
    url: '/operate/action/sqlQuery',
    method: 'post'
  },
  // 查询配置项列表
  findSysConfigList: {
    url: '/operate/sysConfig/findList',
    method: 'post'
  },
  // 新增修改配置项
  saveOrUpdateSysConfig: {
    url: '/operate/sysConfig/saveOrUpdate',
    method: 'post'
  },
  // 删除配置项
  delSysConfig: {
    url: '/operate/sysConfig/delSysConfig',
    method: 'get'
  },
  // 查询小程序模板消息模板列表
  findAppletTemplateList: {
    url: '/guide/applettemplate/findList',
    method: 'post'
  },
  // 新增或保存小程序模板消息模板
  saveOrUpdateAppletTemplate: {
    url: '/guide/applettemplate/saveOrUpdate',
    method: 'post'
  },
  // 删除小程序模板信息模板
  deleteAppletTemplate: {
    url: '/guide/applettemplate/deleteTemplate',
    method: 'post'
  },
  queryMaterial: {
    url: '/guide/material/queryMaterial',
    method: 'get'
  },
  openQueryMaterial: {
    url: '/guide/open/queryMaterial',
    method: 'get'
  },
  // 查找缓存中所有的Key
  findCacheKeys: {
    url: '/guide/cache/findCacheKeys',
    method: 'get'
  },
  // 根据缓存中的Key拿值
  getCacheKeyValue: {
    url: '/guide/cache/getCacheKeyValue',
    method: 'get'
  },
  // 移除缓存中的Key
  removeCacheKey: {
    url: '/guide/cache/removeCacheKey',
    method: 'get'
  },
  // 移除所有的Key
  removeAllCacheKey: {
    url: '/guide/cache/removeAllCacheKey',
    method: 'get'
  },
  // 获取联系我管理列表
  getContactWayGuideInfo: {
    url: '/guide/open/getContactWayGuideInfo',
    method: 'post'
  },
  // 设置联系我
  setGuideContactWay: {
    url: '/guide/open/setContactWay',
    method: 'post'
  },
  // 删除联系我
  deleteContactWay: {
    url: '/guide/open/deleteContactWay',
    method: 'post'
  }
}
