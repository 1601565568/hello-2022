export default {
  'path': '/Guide/ActivityIndex/ShopSetList',
  'name': 'ACTIVITY_INDEX',
  'component': () => import('web-crm/src/views/Default'),
  'meta': {
    'title': '业绩指标',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/ActivityIndex',
      'name': 'ACTIVITY_INDEX2',
      'title': '业绩指标',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/ActivityIndex/ShopSetList',
          'name': 'ACTIVITY_INDEX_SHOP_SETLIST',
          'title': '门店指标',
          'component': () => import('@/views/Guide/ActivityIndex/ShopSetList')
        },
        {
          'path': '/Guide/Task/shopList',
          'name': 'SHOP_TASK',
          'title': '门店任务',
          'component': () => import('@/views/Guide/Task/shopList')
        },
        {
          'path': '/Guide/ActivityIndex/RewardSetList',
          'name': 'ACTIVITY_INDEX_REWARD_SETLIST',
          'title': '提成奖励设置',
          'component': () => import('@/views/Guide/ActivityIndex/RewardSetList')
        },
        {
          'path': '/Guide/ActivityIndex/WorkStatistics',
          'name': 'ACTIVITY_INDEX_WORK_STATISTICS',
          'title': '导购工作统计',
          'component': () => import('@/views/Guide/ActivityIndex/WorkStatistics')
        },
        {
          'path': '/Guide/ActivityIndex/ShopStatistics',
          'name': 'ACTIVITY_INDEX_SHOP_STATISTICS',
          'title': '门店工作统计',
          'component': () => import('@/views/Guide/ActivityIndex/ShopStatistics')
        }
      ]
    },
    {
      'path': '/Guide/Task/List',
      'name': 'TaskManger',
      'title': '任务管理',
      'component': () => import('web-crm/src/views/Content'),
      'children': [
        {
          'path': '/Guide/Task/List',
          'name': 'GUIDE_TASK',
          'title': '任务管理',
          'component': () => import('@/views/Guide/Task/brandList')
        },
        {
          'path': '/Guide/Task/detail',
          'name': 'GUIDE_DETAIL',
          'title': '任务概况',
          'component': () => import('@/views/Guide/Task/detail')
        }
      ]
    }
  ]
}
