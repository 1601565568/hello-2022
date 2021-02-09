export default {
  'path': '/Customer/CustomerCenter/list',
  'name': 'CUSTOMER_CENTER',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '用户中心',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Customer/CustomerCenter',
      'name': 'CUSTOMER_CENTER2',
      'title': '用户中心',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Customer/CustomerCenter/WeWorkExternalContactList',
          'name': 'FRIEND_LIST',
          'title': '好友列表',
          'component': () => import('@/pages/WeWork/WeWorkExternalContactList/index.vue')
        },
        {
          'path': '/Customer/CustomerCenter/WeWorkRoomList',
          'name': 'WEWORK_ROOM_MANAGE',
          'title': '群管理',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
          'children': [
            {
              'path': '/Customer/CustomerCenter/WeWorkRoomList',
              'name': 'WEWORK_ROOM_LIST',
              'title': '群列表',
              'component': () => import('@/pages/Guide/SgStoreManagement/List.vue')
            }
          ]
        }
      ]
    }
  ]
}
