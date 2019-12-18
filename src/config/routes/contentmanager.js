export default {
  'path': '/Guide/Content',
  'name': 'CONTENT_MANAGER',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default'),
  'meta': {
    'title': '内容管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Content',
      'name': 'CONTENT_MANAGER2',
      'title': '内容管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content'),
      'children': [
        {
          'path': '/ContentMange/MyMoments/index',
          'name': 'MyMoments',
          'title': '我的朋友圈',
          'component': () => import('@/pages/Guide/MyMoments/MyMoments')
        },
        {
          'path': '/ContentMange/FriendMoments/index',
          'name': 'FriendMoments',
          'title': '好友朋友圈',
          'component': () => import('@/pages/Guide/FriendMoments/FriendMoments')
        },
        {
          'path': '/ContentMange/SensitiveWord/index',
          'name': 'SensitiveWord',
          'title': '敏感词管理',
          'component': () => import('@/pages/Guide/SensitiveWord/index')
        },
        {
          'path': '/ContentMange/SensitiveWord/monitor',
          'name': 'SensitiveWord_monitor',
          'title': '敏感词监控',
          'component': () => import('@/pages/Guide/SensitiveWord/monitor')
        },
        {
          'path': '/ContentMange/WxChat/index',
          'name': 'WxChat_index',
          'title': '聊天记录',
          'component': () => import('@/pages/Guide/WxChat/index')
        }
      ]
    },
    {
      'path': '/Guide/Content',
      'name': 'CONTENT_MANAGER_OTHER',
      'title': '其他',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content'),
      'children': [
        {
          'path': '/Guide/Content/CustomerService',
          'name': 'CustomerService',
          'title': '客服管理',
          'component': () => import('@/pages/Guide/SensitiveWord/index')
        }
      ]
    }
  ]
}
