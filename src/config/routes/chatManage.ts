export default {
  'path': '/Chat/ChatManage',
  'name': 'CHAT_MANAGE',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '会话管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Chat/ChatManage',
      'name': 'CUSTOMER_MANAGE',
      'title': '会话存档',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/ContentMange/FriendMoments/index',
          'name': 'FriendMoments',
          'title': '好友朋友圈',
          'component': () => import('@/pages/Guide/FriendMoments/FriendMoments.vue')
        }
      ]
    }
  ]
}
