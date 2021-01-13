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
      'path': '/Guide/RecruitSet',
      'name': 'RecruitSet',
      'title': '招募设置',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/RecruitSet/RecruitConfigGift',
          'name': 'RecruitConfigGift',
          'title': '招募奖励设置',
          'component': () => import('@/pages/Guide/RecruitmentSettings/index.vue')
        },
        {
          'path': '/Guide/RecruitSet/RecruitConfig',
          'name': 'RecruitConfig',
          'title': '招募设置',
          'component': () => import('@/pages/Guide/Recruitment/RecruitmentSettings/index.vue')
        },
        {
          'path': '/Guide/RecruitSet/RecruitPageConfig',
          'name': 'RecruitPageConfig',
          'title': '招募页面设置',
          'component': () => import('@/pages/Guide/Recruitment/RecruitmentPageSettings/index.vue')
        },
        {
          'path': '/Guide/RecruitSet/NotMemberPageConfig',
          'name': 'NotMemberPageConfig',
          'title': '非会员页面设置',
          'component': () => import('@/pages/Guide/NotMemberPageConfig/index.vue')
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
      'path': '/Guide/OperationLog/List',
      'name': 'LIST',
      'title': '系统日志',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/OperationLog/List',
          'name': 'SG_WX_ACCOUNT',
          'title': '操作日志',
          'component': () => import('@/pages/Guide/OperationLog/List.vue')
        },
        {
          'path': '/Guide/LoginLog/List',
          'name': 'SG_LOGIN_LOG',
          'title': '登录日志',
          'component': () => import('@/pages/Guide/LoginLog/List.vue')
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
      'path': '/Guide/CustomerContact',
      'name': 'CustomerContact',
      'title': '客户联系',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/CustomerContact/WelcomeWord',
          'name': 'WelcomeWord',
          'title': '欢迎语管理',
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
