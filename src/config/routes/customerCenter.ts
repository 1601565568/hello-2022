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
      'path': '/Guide/SgGuide',
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
          'path': '/Guide/Customer/FriendManage',
          'name': 'FriendData',
          'title': '好友数据',
          'component': () => import('@/pages/Guide/FriendData/List.vue')
        },
        {
          'path': '/Guide/GroupData/index',
          'name': 'GroupData',
          'title': '群数据',
          'component': () => import('@/pages/Guide/GroupData/index.vue')
        },
        {
          'path': '/Guide/transCustomerRecord',
          'name': 'TRANS_CUSTOMER_RECORD',
          'title': '客户转移记录',
          'component': () => import('@/pages/Guide/SgCustomer/NsTableSgCustomer.vue')
        },
        {
          'path': '/guide/customer/getCustomerConfig',
          'name': 'APPLET_TEMPLATE',
          'title': '客户管理配置',
          'component': () => import('@/pages/Guide/customerConfig/index.vue')
        }
      ]
    }
  ]
}
