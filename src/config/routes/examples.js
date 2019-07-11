export default {
  'path': '/Examples',
  'name': 'Examples',
  'component': () => import('web-crm/src/views/Default'),
  'meta': {
    'title': '组件实例',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/List',
      'name': 'List',
      'title': '组件实例',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Chat',
          'name': 'Chat',
          'title': 'Chat',
          'component': () => import('@/views/Examples/chat')
        },
        {
          'path': '/GroupData',
          'name': 'GroupData',
          'title': 'GroupData',
          'component': () => import('@/views/Examples/groupData')
        }
      ]
    }
  ]
}
