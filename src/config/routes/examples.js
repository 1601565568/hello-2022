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
          'name': 'GroupDataExample',
          'title': 'GroupData',
          'component': () => import('@/views/Examples/groupData')
        },
        {
          'path': '/CircleOfFriends',
          'name': 'CircleOfFriends',
          'title': 'CircleOfFriends',
          'component': () => import('@/views/Examples/circleOfFriends.vue')
        },
        {
          'path': '/WelcomeMessage',
          'name': 'WelcomeMessage',
          'title': 'WelcomeMessage',
          'component': () => import('@/views/Examples/welcomeMessage.vue')
        },
        {
          'path': '/goodFriendDataDetail',
          'name': 'goodFriendDataDetail',
          'title': 'goodFriendDataDetail',
          'component': () => import('@/views/Examples/goodFriendDataDetail.vue')
        },
        {
          'path': '/Screening',
          'name': 'Screening',
          'title': 'Screening',
          'component': () => import('@/views/Examples/screening.vue')
        }
      ]
    }
  ]
}
