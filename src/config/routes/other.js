export default {
  'path': '/Guide/Others',
  'name': 'SG_OTHERS',
  'component': () => import('web-crm/src/views/Default'),
  'meta': {
    'title': '其他',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Others/SgWxAccount',
      'name': 'WX_ACCOUNT',
      'title': '授权管理',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/Others/SgWxAccount',
          'name': 'OTHERS_SGWXACCOUNT',
          'title': '授权管理',
          'component': () => import('@/views/Guide/SgWxAccount')
        }
      ]
    },
    {
      'path': '/Guide/OperationLog/List',
      'name': 'LIST',
      'title': '系统日志',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/OperationLog/List',
          'name': 'SG_WX_ACCOUNT',
          'title': '操作日志',
          'component': () => import('@/views/Guide/OperationLog/List')
        },
        {
          'path': '/Guide/LoginLog/List',
          'name': 'SG_LOGIN_LOG',
          'title': '登录日志',
          'component': () => import('@/views/Guide/LoginLog/List')
        }
      ]

    },
    {
      'path': '/Guide/SensitivePermission/index',
      'name': 'OTHER_CONFIG',
      'title': '其他设置',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/SensitivePermission/index',
          'name': 'SENSITIVE_PERMISSION',
          'title': '敏感权限监控',
          'component': () => import('@/views/Guide/SensitivePermission/index')
        }
      ]
    },
    {
      'path': '/Guide/CustomerContact',
      'name': 'CustomerContact',
      'title': '客户联系',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/CustomerContact/WelcomeWord',
          'name': 'WelcomeWord',
          'title': '欢迎语管理',
          'component': () => import('@/views/Guide/SensitivePermission/index')
        }
      ]
    }
  ]
}
