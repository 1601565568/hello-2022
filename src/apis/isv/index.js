import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'

export default {
  // 查询小程序table列表
  getAppletList: {
    url: '/operate/wechatsetting/getAppletList',
    method: 'post'
  },
  // 代码模板列表
  getCodeTemplateList: {
    url: '/operate/wechatsetting/getAppletCodeTemplateList',
    method: 'post'
  },
  // 同步最新的模板
  refreshCodeTemplate: {
    url: '/operate/wechatsetting/refreshCodeTemplate',
    method: 'get'
  },
  // 查询草稿箱列表
  getTemplateDraftList: {
    url: '/operate/wechatsetting/getTemplateDraftList',
    method: 'get'
  },
  // 将草稿选择为模板
  addDraftToTemplate: {
    url: '/operate/wechatsetting/addDraftToTemplate',
    method: 'get'
  },
  // 设置服务器地址
  setModifyDomain: {
    url: '/operate/wechatsetting/setModifyDomain',
    method: 'post'
  },
  // 查询配置信息
  getDomainInfo: {
    url: '/operate/wechatsetting/getDomainInfo',
    method: 'get'
  },
  // 发布模板
  templateToRelease: {
    url: '/operate/wechatsetting/templateToRelease',
    method: 'get'
  },
  // 提交模板审核
  submitTemplateToAudit: {
    url: '/operate/wechatsetting/submitTemplateToAudit',
    method: 'post'
  },
  // 获取小程序的第三方提交代码的页面配置列表
  getAppletPageList: {
    url: '/operate/wechatsetting/getAppletPageList',
    method: 'get'
  },
  // 获取授权小程序帐号的可选类目
  getAppletCategoryList: {
    url: '/operate/wechatsetting/getAppletCategoryList',
    method: 'get'
  },
  // 查询域名配置
  wechatsettingGetDomainInfo: {
    url: '/operate/wechatsetting/getDomainInfo',
    method: 'get'
  },
  // 查询小程序列表
  wechatsettingGetAppletList: {
    url: '/operate/wechatsetting/getAppletList',
    method: 'post'
  },
  // 查询小程序可选类目
  wechatsettingGetAppletCategoryList: {
    url: '/operate/wechatsetting/getAppletCategoryList',
    method: 'get'
  },
  // 查询小程序页面配置
  wechatsettingGetAppletPageList: {
    url: '/operate/wechatsetting/getAppletPageList',
    method: 'get'
  },
  // 查询已审核成功的模板
  getAuthedAppletCodeTemplate: {
    url: '/operate/wechatsetting/getAuthedAppletCodeTemplate',
    method: 'get'
  },
  // 查询模板列表
  getAppletCodeTemplateList: {
    url: '/operate/wechatsetting/getAppletCodeTemplateList',
    method: 'post'
  },
  // 删除模板
  deleteTemplate: {
    url: '/operate/wechatsetting/deleteTemplate',
    method: 'get'
  },
  // 查询模板详情信息
  getTemplateInfo: {
    url: '/operate/wechatsetting/getTemplateInfo',
    method: 'get'
  },
  // 获取体验二维码
  getQrcode: {
    url: '/operate/wechatsetting/getQrcode',
    method: 'get'
  },
  // 上传代码模板
  codeTemplateUpload: {
    url: '/operate/wechatsetting/codeTemplateUpload',
    method: 'post'
  },
  // 审核撤回
  auditingRevert: {
    url: '/operate/wechatsetting/auditingRevert',
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
    url: '/operate/applettemplate/findList',
    method: 'post'
  },
  // 新增或保存小程序模板消息模板
  saveOrUpdateAppletTemplate: {
    url: '/operate/applettemplate/saveOrUpdate',
    method: 'post'
  },
  // 删除小程序模板信息模板
  deleteAppletTemplate: {
    url: '/operate/applettemplate/deleteTemplate',
    method: 'post'
  },
  queryMaterial: {
    url: '/guide/material/queryMaterial',
    method: 'get'
  },
  openQueryMaterial: {
    url: '/operate/open/queryMaterial',
    method: 'get'
  },
  // 查找缓存中所有的Key
  findCacheKeys: {
    url: '/operate/helptool/findCacheKeys',
    method: 'get'
  },
  // 根据缓存中的Key拿值
  getCacheKeyValue: {
    url: '/operate/helptool/getCacheKeyValue',
    method: 'get'
  },
  // 移除缓存中的Key
  removeCacheKey: {
    url: '/operate/helptool/removeCacheKey',
    method: 'get'
  },
  // 移除所有的Key
  removeAllCacheKey: {
    url: '/operate/helptool/removeAllCacheKey',
    method: 'get'
  },
  // 加解密工具接口
  encryptionAndDecryption: {
    url: '/operate/helptool/encryptionAndDecryption',
    method: 'get'
  },
  // 获取联系我管理列表
  getContactWayGuideInfo: {
    url: '/operate/open/getContactWayGuideInfo',
    method: 'post'
  },
  // 设置联系我
  setGuideContactWay: {
    url: '/operate/open/setContactWay',
    method: 'post'
  },
  // 删除联系我
  deleteContactWay: {
    url: '/operate/open/deleteContactWay',
    method: 'post'
  },
  // 更新联系我
  updateContactWay: {
    url: '/operate/open/updateContactWay',
    method: 'post'
  },
  bindOrUnBindExperienceMember: {
    url: '/operate/wechatsetting/bindOrUnBindExperienceMember',
    method: 'post',
    request: (config) => {
      const data = config.data
      if (data.type === 0) {
        return apiRequestConfirm('解绑该账号的体验权限，解绑后该账号将无法进入体验版')
      }
      return Promise.resolve()
    }
  },
  applyPlugin: {
    url: '/operate/wechatsetting/applyPlugin',
    method: 'post'
  },
  // 刷新小程序信息(包括token信息)
  refreshAuthedAppletInfo: {
    url: '/operate/wechatsetting/refreshAuthedAppletInfo',
    method: 'get'
  },
  sgwxaccount: {
    save: {
      url: '/operate/sgwxaccount/save',
      method: 'post'
    },
    delete: {
      url: '/operate/sgwxaccount/delete',
      method: 'post'
    }
  }
}
