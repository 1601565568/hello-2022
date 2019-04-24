export default {
  'path': '/Guide/SgGuide/List',
  'name': 'SHOP_MANAGER',
  'componentPath': () => import('@/views/Default'),
  'meta': {
    'title': '门店管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/SgGuide',
      'name': 'SHOP_MANAGER2',
      'title': '门店管理',
      'componentPath': () => import('@/views/Content'),
      'children': [
        {
          'path': '/Guide/SgStoreManagement/List',
          'name': 'ShopManager',
          'title': '门店列表',
          'componentPath': () => import('@/views/Guide/SgStoreManagement/List')
        }
      ]
    },
    {
      'path': '/Guide/SgGuide',
      'name': 'YGGL',
      'title': '员工管理',
      'componentPath': 'Content',
      'children': [
        {
          'path': '/Guide/SgGuide/List',
          'name': 'GuideList',
          'title': '员工列表',
          'componentPath': () => import('@/views/Guide/SgGuide/List')
        }
      ]
    },
    {
      'path': '/Guide/SgGuide',
      'name': 'CustomerManage',
      'title': '会员管理',
      'componentPath': 'Content',
      'children': [
        {
          'path': '/Guide/Customer/CustomerManage',
          'name': 'CustomerList',
          'title': '会员列表',
          'componentPath': () => import('@/views/Guide/Customer/CustomerManage')
        },
        {
          'path': '/Guide/transCustomerRecord',
          'name': 'TRANS_CUSTOMER_RECORD',
          'title': '客户转移记录',
          'componentPath': () => import('@/views/Guide/SgCustomer/NsTableSgCustomer')
        }
      ]
    }
  ]
}
