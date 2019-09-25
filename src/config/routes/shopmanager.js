export default {
  'path': '/Guide/SgGuide/List',
  'name': 'SHOP_MANAGER',
  'component': () => import('web-crm/src/views/Default'),
  'meta': {
    'title': '门店管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/SgGuide',
      'name': 'SHOP_MANAGER2',
      'title': '门店管理',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/SgStoreManagement/List',
          'name': 'ShopManager',
          'title': '门店列表',
          'component': () => import('@/views/Guide/SgStoreManagement/List')
        }
      ]
    },
    {
      'path': '/Guide/SgGuide',
      'name': 'YGGL',
      'title': '员工管理',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/SgGuide/List',
          'name': 'Guide_List',
          'title': '员工列表',
          'component': () => import('@/views/Guide/SgGuide/List')
        },
        {
          'path': '/Guide/SgMoreAccount/List',
          'name': 'GuideList',
          'title': '配置多谋个人号',
          'component': () => import('@/views/Guide/SgMoreAccount/List')
        },
        {
          'path': '/Guide/GuideSecretary/List',
          'name': 'GuideSecretary_list',
          'title': '导购秘书',
          'component': () => import('@/views/Guide/GuideSecretary/List')
        },
        {
          'path': '/Guide/SgShopGroup/index',
          'name': 'SgShopGroup_index',
          'title': '门店群',
          'component': () => import('@/views/Guide/SgShopGroup/index')
        },
        {
          'path': '/Guide/SgShopGroupRobot/index',
          'name': 'SgShopGroupRobot_index',
          'title': '门店群AI机器人',
          'component': () => import('@/views/Guide/SgShopGroupRobot/index')
        }
      ]
    },
    {
      'path': '/Guide/SgGuide',
      'name': 'CustomerManage',
      'title': '客户管理',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/Customer/CustomerManage',
          'name': 'CustomerList',
          'title': '客户列表',
          'component': () => import('@/views/Guide/Customer/CustomerManage')
        },
        {
          'path': '/Guide/Customer/FriendManage',
          'name': 'FriendData',
          'title': '好友数据',
          'component': () => import('@/views/Guide/FriendData/List')
        },
        {
          'path': '/Guide/GroupData/index',
          'name': 'GroupData',
          'title': '群数据',
          'component': () => import('@/views/Guide/GroupData/index')
        },
        {
          'path': '/Guide/transCustomerRecord',
          'name': 'TRANS_CUSTOMER_RECORD',
          'title': '客户转移记录',
          'component': () => import('@/views/Guide/SgCustomer/NsTableSgCustomer')
        },
        {
          'path': '/guide/customer/getCustomerConfig',
          'name': 'APPLET_TEMPLATE',
          'title': '客户管理配置',
          'component': () => import('@/views/Guide/customerConfig/index')
        }
      ]
    }
  ]
}
