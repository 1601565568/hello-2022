export default {
  'path': '/Customer/CustomerCenter',
  'name': 'CUSTOMER_CENTER',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '用户中心',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Customer',
      'name': 'CustomerManage',
      'title': '客户管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Customer/CustomerManage',
          'name': 'CustomerList',
          'title': '客户列表',
          'component': () => import('@/pages/Guide/Customer/CustomerManage.vue')
        },
        {
          'path': '/Guide/transCustomerRecord',
          'name': 'TRANS_CUSTOMER_RECORD',
          'title': '客户转移记录',
          'component': () => import('@/pages/Guide/SgCustomer/NsTableSgCustomer.vue')
        }
      ]
    },
    {
      'path': '/Social/WeComCustomerOperation/ExternalContactList',
      'name': 'WeComExternalContactList',
      'title': '好友管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'redirect': {
        'name': 'WeComExternalContactList'
      },
      'children': [
        {
          'path': '/Social/WeComCustomerOperation/ExternalContactList',
          'name': 'WeComExternalContactList',
          'title': '企微好友',
          'component': () => import('@/pages/WeWork/WeWorkExternalContactList/index.vue')
        },
        {
          'path': '/Social/WeComCustomerOperation/RepeatCustomer',
          'name': 'WeComRepeatCustomer',
          'title': '重复客户',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WeComRepeatCustomer'
          },
          'children': [
            {
              'path': '/Social/WeComCustomerOperation/RepeatCustomer',
              'name': 'WeComRepeatCustomer',
              'title': '重复客户',
              'component': () => import('@/pages/WeWork/RepeatCustomer/List.vue')
            }
          ]
        }
      ]
    },
    {
      'path': '/Social/WeComCustomerOperation/RoomList',
      'name': 'WeComRoomList',
      'title': '群管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'redirect': {
        'name': 'WeComRepeatCustomer'
      },
      'children': [
        {
          'path': '/Social/WeComCustomerOperation/RoomList',
          'name': 'WeComRoomList',
          'title': '群列表',
          'component': () => import('@/pages/WeWork/WeWorkRoomList/index.vue'),
          'children': [
            {
              'path': '/Social/WeComCustomerOperation/RoomList',
              'name': 'WeComRoomMemberList',
              'title': '企微群成员列表',
              'component': () => import('@/pages/WeWork/WeWorkRoomList/NsTableEnterpriseWeChatMember.vue')
            }
          ]
        }
      ]
    }
  ]
}
