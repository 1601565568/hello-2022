export default {
  'path': '/Guide/Others',
  'name': 'SG_OTHERS',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '其他',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Others/SgWxAccount',
      'name': 'WX_ACCOUNT',
      'title': '授权管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Others/SgWxAccount',
          'name': 'OTHERS_SGWXACCOUNT',
          'title': '授权管理',
          'component': () => import('@/pages/Guide/SgWxAccount/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/custom',
      'name': 'custom',
      'title': '自定义装修',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/custom/Decoration',
          'name': 'customDecoration',
          'title': '小程序页面',
          'component': () => import('@/pages/Guide/custom/index.vue')
        },
        {
          'path': '/Guide/custom/DecorationEdit',
          'name': 'RecruitPageConfig',
          'title': '编辑小程序页面',
          'component': () => import('@/pages/Guide/custom/Edit.vue')
        }
      ]
    },
    {
      'path': '/Guide/SensitivePermission/index',
      'name': 'OTHER_CONFIG',
      'title': '其他设置',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SensitivePermission/index',
          'name': 'SENSITIVE_PERMISSION',
          'title': '敏感权限监控',
          'component': () => import('@/pages/Guide/SensitivePermission/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/CompanyInfo',
      'name': 'CustomerContact',
      'title': '公司信息',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/account/companyInformation',
          'name': 'companyInformation',
          'title': '公司logo',
          'component': () => import('@/pages/Guide/Logo/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/Service',
      'name': 'CustomerService',
      'title': '客服管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Service/ThirdLink',
          'name': 'ThirdLink',
          'title': '第三方关联链接',
          'component': () => import('@/pages/Guide/CustomerService/ThirdLink/index.vue')
        }
      ]
    }
  ]
}
