export default {
  'path': '/Pull/PullNew',
  'name': 'PULL_NEW',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '获客引流',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Customer/CustomerManage',
      'name': 'CUSTOMER_MANAGE',
      'title': '客户管理',
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
