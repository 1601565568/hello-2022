export default {
  'path': '/operate/wechat',
  'name': 'OPERATE_WECHAT',
  'component': () => import('@/pages/DefaultOperate'),
  'meta': {
    'title': '授权',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/operate/wechat/',
      'name': 'OPERATE_WECHAT_ADDPAGES',
      'title': '授权',
      'component': () => import('@/pages/ContentOperate'),
      'children': [
        {
          'path': '/operate/wechat/addPages',
          'name': 'ADD_PAGES',
          'title': '新增页面',
          'component': () => import('@/pages/ISV/addPages')
        },
        {
          'path': '/operate/wechat/SgWxAccount',
          'name': 'SG_WXACCOUNT',
          'title': '授权管理',
          'component': () => import('@/pages/ISV/SgWxAccount/index')
        }
      ]
    },
    {
      'path': '/operate/wechat/',
      'name': 'OPERATE_WECHAT_DEVELOPMENTMANAGEMENT',
      'title': '定时任务',
      'component': () => import('@/pages/ContentOperate'),
      'children': [
        {
          'path': '/operate/wechat/developmentManagement',
          'name': 'DEVELOPMENT_MANAGEMENT',
          'title': '定时任务',
          'component': () => import('@/pages/ISV/developmentManagement/index')
        }
      ]
    },
    {
      'path': '/operate/action',
      'name': 'OPERATE_ACTION',
      'title': '数据查询',
      'component': () => import('@/pages/ContentOperate'),
      'children': [
        {
          'path': '/operate/action/dataQuery',
          'name': 'SQL_QUERY',
          'title': '数据查询',
          'component': () => import('@/pages/ISV/DataQuery/index')
        }
      ]
    },
    {
      'path': '/operate/sysConfig',
      'name': 'OPERATE_SYSCONFIG',
      'title': '系统配置',
      'component': () => import('@/pages/ContentOperate'),
      'children': [
        {
          'path': '/operate/sysConfig/findList',
          'name': 'SYS_CONFIG',
          'title': '系统配置',
          'component': () => import('@/pages/ISV/SgSysConfig/index')
        }
      ]
    },
    {
      'path': '/operate/appletTemplate',
      'name': 'OPERATE_APPLETTEMPLATE',
      'title': '模板消息',
      'component': () => import('@/pages/ContentOperate'),
      'children': [
        {
          'path': '/operate/appletTemplate/findList',
          'name': 'OPERATE_FINDLIST',
          'title': '模板消息',
          'component': () => import('@/pages/ISV/SgAppletTemplate/index')
        }
      ]
    },
    {
      'path': '/operate/cache',
      'name': 'OPERATE_DATA',
      'title': '缓存管理',
      'component': () => import('@/pages/ContentOperate'),
      'children': [
        {
          'path': '/operate/cache/manager',
          'name': 'CACHE_MANAGER',
          'title': '缓存管理',
          'component': () => import('@/pages/ISV/CacheManager/index')
        }
      ]
    },
    {
      'path': '/operate/contactWay',
      'name': 'OPERATE_CONTACTWAY',
      'title': '联系我管理',
      'component': () => import('@/pages/ContentOperate'),
      'children': [
        {
          'path': '/operate/contactWay/manager',
          'name': 'CONTACT_WAY_MANAGER',
          'title': '联系我管理',
          'component': () => import('@/pages/ISV/SgEnterpriseContactWay/index')
        }
      ]
    }
  ]
}
