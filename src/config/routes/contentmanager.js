export default {
  'path': '/Guide/Content',
  'name': 'CONTENT_MANAGER',
  'component': () => import('web-crm/src/views/Default'),
  'meta': {
    'title': '内容管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Content',
      'name': 'CONTENT_MANAGER2',
      'title': '内容管理',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/ContentMange/MyMoments/index',
          'name': 'MyMoments',
          'title': '我的朋友圈',
          'component': () => import('@/views/Guide/MyMoments/MyMoments')
        },
        {
          'path': '/ContentMange/FriendMoments/index',
          'name': 'FriendMoments',
          'title': '好友朋友圈',
          'component': () => import('@/views/Guide/FriendMoments/FriendMoments')
        },
        {
          'path': '/ContentMange/SensitiveWord/index',
          'name': 'SensitiveWord',
          'title': '敏感词管理',
          'component': () => import('@/views/Guide/SensitiveWord/index')
        },
        {
          'path': '/ContentMange/SensitiveWord/monitor',
          'name': 'SensitiveWord_monitor',
          'title': '敏感词监控',
          'component': () => import('@/views/Guide/SensitiveWord/monitor')
        },
        {
          'path': '/ContentMange/WxChat/index',
          'name': 'WxChat_index',
          'title': '聊天记录',
          'component': () => import('@/views/Guide/WxChat/index')
        }
      ]
    },
    {
      'path': '/Guide/Content',
      'name': 'CONTENT_MANAGER_OTHER',
      'title': '其他',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/Content/CustomerService',
          'name': 'CustomerService',
          'title': '客服管理',
          'component': () => import('@/views/Guide/SensitiveWord/index')
        }
      ]
    }
  ]
}
