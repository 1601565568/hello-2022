export default {
  'path': '/Guide/Others',
  'name': 'SG_OTHERS',
  'component': () => import('@/layout/Default.vue'),
  'meta': {
    'title': '其他',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Others/SgWxAuth',
      'name': 'OTHERS_SGWXACCOUNT',
      'title': '授权管理',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Others/SgWxAuth',
          'name': 'OTHERS_SGWXACCOUNT',
          'title': '小程序授权',
          'component': () => import('@/pages/Guide/SgWxAuth/Index.vue')
        },
        {
          'path': '/Guide/Others/PaySet',
          'name': 'PAY_SET',
          'title': '支付配置',
          'component': () => import('@/pages/Guide/PaySet/Index.vue')
        },
        {
          'path': '/Guide/Others/PayGuide',
          'name': 'PAY_Guide',
          'title': '支付引导',
          'component': () => import('@/pages/Guide/PayGuide/Index.vue')
        }
      ]
    },
    {
      'path': '/Guide/custom/DecorationEdit',
      'name': 'RecruitPageConfig',
      'title': '自定义装修',
      'component': () => import('@layout/Content.vue'),
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
      'component': () => import('@layout/Content.vue'),
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
      'path': '/account/companyInformation',
      'name': 'companyInformation',
      'title': '公司信息',
      'component': () => import('@layout/Content.vue'),
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
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Service/ThirdLink',
          'name': 'ThirdLink',
          'title': '第三方关联链接',
          'component': () => import('@/pages/Guide/CustomerService/ThirdLink/index.vue')
        }
      ]
    },
    {
      'path': '/Social/OperationConfig',
      'name': 'OperationConfig',
      'title': '运营设置',
      'component': () => import('@layout/Content.vue'),
      'children': [
        // 6.9 三方应用需求修改页面路径 WeWorkConfig => WeWorkTools
        // {
        //   'path': '/Social/OperationConfig',
        //   'name': 'OperationConfig',
        //   'title': '企业微信设置',
        //   'component': () => import('@/pages/Social/OperationConfig/WeWorkConfig/index.vue')
        // },
        {
          'path': '/Social/OperationConfig',
          'name': 'OperationConfig',
          'title': '企业微信设置',
          'component': () => import('@/pages/Social/OperationConfig/WeWorkTools/Index.vue')
        },
        {
          'path': '/Social/DetailsPage',
          'name': 'DetailsPage',
          'title': '企业微信设置',
          'component': () => import('@/pages/Social/OperationConfig/DetailsPage/index.vue')
        },
        {
          'path': '/Social/SidebarMenu',
          'name': 'SidebarMenu',
          'title': '企业微信设置',
          'component': () => import('@/pages/Social/OperationConfig/SidebarMenu/index.vue')
        },
        {
          'path': '/Social/WebAuth',
          'name': 'WebAuth',
          'title': '企业微信设置',
          'component': () => import('@/pages/Social/OperationConfig/WebAuth/index.vue')
        }
      ]
    }
  ]
}
