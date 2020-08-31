export default {
  'path': '/Guide/SgGuide/List',
  'name': 'SHOP_MANAGER',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '门店管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/SgGuide',
      'name': 'SHOP_MANAGER2',
      'title': '门店管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SgStoreManagement/List',
          'name': 'ShopManager',
          'title': '门店列表',
          'component': () => import('@/pages/Guide/SgStoreManagement/List.vue')
        }
      ]
    },
    {
      'path': '/Guide/SgGuide',
      'name': 'YGGL',
      'title': '员工管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SgGuide/List',
          'name': 'Guide_List',
          'title': '员工列表',
          'component': () => import('@/pages/Guide/SgGuide/List.vue')
        },
        {
          'path': '/Guide/SgGuide/ActivityAnalysis',
          'name': 'ActivityAnalysis',
          'title': '导购行为分析',
          'component': () => import('@/pages/Guide/ActivityAnalysis/List.vue')
        },
        {
          'path': '/Guide/ActivityAnalysis/MemberStatistics',
          'name': 'MemberStatistics',
          'title': '会员统计',
          'component': () => import('@/pages/Guide/ActivityAnalysis/MemberStatistics.vue')
        },
        {
          'path': '/Guide/ActivityAnalysis/SaleView',
          'name': 'SaleView',
          'title': '销售概览',
          'component': () => import('@/pages/Guide/ActivityAnalysis/SaleView.vue')
        },
        {
          'path': '/Guide/SgMoreAccount/List',
          'name': 'GuideList',
          'title': '配置多谋个人号',
          'component': () => import('@/pages/Guide/SgMoreAccount/List.vue')
        },
        {
          'path': '/Guide/GuideSecretary/List',
          'name': 'GuideSecretary_list',
          'title': '导购秘书',
          'component': () => import('@/pages/Guide/GuideSecretary/List.vue')
        },
        {
          'path': '/Guide/SgShopGroup/index',
          'name': 'SgShopGroup_index',
          'title': '门店群',
          'component': () => import('@/pages/Guide/SgShopGroup/index.vue')
        },
        {
          'path': '/Guide/SgShopGroupRobot/index',
          'name': 'SgShopGroupRobot_index',
          'title': '门店群AI机器人',
          'component': () => import('@/pages/Guide/SgShopGroupRobot/index.vue')
        }
      ]
    },
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
