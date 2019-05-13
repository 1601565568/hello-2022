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
        }
      ]
    },
    // {
    //   'path': '/Guide/SgGuide',
    //   'name': 'YGGL',
    //   'title': '员工管理',
    //   'component': () => import('web-crm/src/views/Content'),
    //   'children': [
    //     {
    //       'path': '/Guide/SgGuide/List',
    //       'name': 'GuideList',
    //       'title': '员工列表',
    //       'component': () => import('@/views/Guide/SgGuide/List')
    //     }
    //   ]
    // },
    {
      'path': '/Guide/SgGuide',
      'name': 'CustomerManage',
      'title': '会员管理',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/Customer/CustomerManage',
          'name': 'CustomerList',
          'title': '会员列表',
          'component': () => import('@/views/Guide/Customer/CustomerManage')
        },
        {
          'path': '/Guide/transCustomerRecord',
          'name': 'TRANS_CUSTOMER_RECORD',
          'title': '客户转移记录',
          'component': () => import('@/views/Guide/SgCustomer/NsTableSgCustomer')
        }
      ]
    }
  ]
}
