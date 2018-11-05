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
  }
}
