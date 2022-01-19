export default {
  'path': '/Guide/Content',
  'name': 'CONTENT_MANAGER',
  'component': () => import('@layout/Default.vue'),
  'meta': {
    'title': '内容管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Content',
      'name': 'CONTENT_MANAGER2',
      'title': '内容管理',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/ContentMange/MyMoments/index',
          'name': 'MyMoments',
          'title': '我的朋友圈',
          'component': () => import('@/pages/Guide/MyMoments/MyMoments.vue')
        },
        {
          'path': '/ContentMange/FriendMoments/index',
          'name': 'FriendMoments',
          'title': '好友朋友圈',
          'component': () => import('@/pages/Guide/FriendMoments/FriendMoments.vue')
        },
        {
          'path': '/ContentMange/SensitiveWord/index',
          'name': 'SensitiveWord',
          'title': '敏感词管理',
          'component': () => import('@/pages/Guide/SensitiveWord/index.vue')
        },
        {
          'path': '/ContentMange/SensitiveWord/monitor',
          'name': 'SensitiveWord_monitor',
          'title': '敏感词监控',
          'component': () => import('@/pages/Guide/SensitiveWord/monitor.vue')
        },
        {
          'path': '/ContentMange/WxChat/index',
          'name': 'WxChat_index',
          'title': '聊天记录',
          'component': () => import('@/pages/Guide/WxChat/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/Content',
      'name': 'CONTENT_MANAGER_OTHER',
      'title': '其他',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Content/CustomerService',
          'name': 'CustomerService',
          'title': '客服管理',
          'component': () => import('@/pages/Guide/SensitiveWord/index.vue')
        }
      ]
    }
  ]
}
