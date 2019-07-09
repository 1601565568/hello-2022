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
          'path': '/Guide/SgSensitiveWord/index',
          'name': 'SensitiveWord',
          'title': '敏感词管理',
          'component': () => import('@/views/Guide/SensitiveWord/index')
        }
      ]
    }
  ]
}
