export default {
  'path': '/Customer/CustomerCenter',
  'name': 'CUSTOMER_CENTER',
  'component': () => import('@/layout/Default.vue'),
  'meta': {
    'title': '用户中心',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Customer',
      'name': 'CustomerManage',
      'title': '客户管理',
      'component': () => import('@layout/Content.vue'),
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
        },
        {
          'path': '/Guide/TransferDetails',
          'name': 'TRANS_CUSTOMER_DETAIL',
          'title': '客户转移明细',
          'component': () => import('@/pages/Guide/SgCustomer/NsTableTransferDetail.vue')
        }
      ]
    },
    {
      'path': '/Social/WeComCustomerOperation/ExternalContactList',
      'name': 'WeComExternalContactList',
      'title': '好友管理',
      'component': () => import('@layout/Content.vue'),
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
          'path': '/Social/WeComCustomerOperation/LosOfFriends',
          'name': 'LosOfFriends',
          'title': '好友流失提醒',
          'component': () => import('@/pages/WeWork/LosOfFriends/index.vue')
        },
        {
          'path': '/Social/WeComCustomerOperation/FriendsAnalysis',
          'name': 'WeComFriendsAnalysis',
          'title': '好友分析',
          'component': () => import('@layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WeComRepeatCustomer'
          },
          'children': [
            {
              'path': '/Social/WeComCustomerOperation/FriendsAnalysis',
              'name': 'WeComFriendsAnalysis',
              'title': '好友分析',
              'component': () => import('@/pages/WeWork/FriendsAnalysis/friendsAnalysis.vue')
            }
          ]
        },
        {
          'path': '/Social/WeComCustomerOperation/RepeatCustomer',
          'name': 'WeComRepeatCustomer',
          'title': '重复客户',
          'component': () => import('@layout/ContentOnly.vue'),
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
      'name': 'WeComRoomManage',
      'title': '群管理',
      'component': () => import('@layout/Content.vue'),
      'redirect': {
        'name': 'WeComRepeatCustomer'
      },
      'children': [
        {
          'path': '/Social/WeComCustomerOperation/RoomList',
          'name': 'WeComRoomList',
          'title': '群列表',
          'component': () => import('@/pages/WeWork/WeWorkRoomList/index.vue')
        },
        {
          'path': '/Social/WeComCustomerOperation/NsTableEnterpriseWeChatMember',
          'name': 'WeComRoomMemberList',
          'title': '企微群成员列表',
          'component': () => import('@/pages/WeWork/WeWorkRoomList/NsTableEnterpriseWeChatMember.vue')
        },
        {
          'path': '/Social/WeComCustomerOperation/GroupData',
          'name': 'WeComCustomerOperationGroupData',
          'title': '群分析',
          'component': () => import('@/pages/WeWork/GroupData/index.vue')
        },
        {
          'path': '/Social/WeComCustomerOperation/GroupRepeat',
          'name': 'WeComExternalContactList',
          'title': '重复群统计',
          'component': () => import('@/pages/WeWork/GroupRepeat/index.vue')
        }
      ]
    }
  ]
}
