export default {
  'path': '/Guide/ActivityIndex/ShopSetList',
  'name': 'ACTIVITY_INDEX',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '业绩指标',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/ActivityIndex',
      'name': 'ACTIVITY_INDEX2',
      'title': '业绩指标',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/ActivityIndex/ShopSetList',
          'name': 'ACTIVITY_INDEX_SHOP_SETLIST',
          'title': '门店指标',
          'component': () => import('@/pages/Guide/ActivityIndex/ShopSetList.vue')
        },
        {
          'path': '/Guide/Task/shopList',
          'name': 'SHOP_TASK',
          'title': '门店任务',
          'component': () => import('@/pages/Guide/Task/shopList.vue')
        },
        {
          'path': '/Guide/Task/taskDetail',
          'name': 'SHOP_TASK_DETAIL',
          'title': '门店任务',
          'component': () => import('@/pages/Guide/Task/taskDetail.vue')
        },
        {
          'path': '/Guide/ActivityIndex/RewardSetList',
          'name': 'ACTIVITY_INDEX_REWARD_SETLIST',
          'title': '提成奖励设置',
          'component': () => import('@/pages/Guide/ActivityIndex/RewardSetList.vue')
        },
        {
          'path': '/Guide/ActivityIndex/WorkStatistics',
          'name': 'ACTIVITY_INDEX_WORK_STATISTICS',
          'title': '导购工作统计',
          'component': () => import('@/pages/Guide/ActivityIndex/WorkStatistics.vue')
        },
        {
          'path': '/Guide/ActivityIndex/ShopStatistics',
          'name': 'ACTIVITY_INDEX_SHOP_STATISTICS',
          'title': '门店工作统计',
          'component': () => import('@/pages/Guide/ActivityIndex/ShopStatistics.vue')
        }
      ]
    },
    {
      'path': '/Guide/Task/List',
      'name': 'TaskManger',
      'title': '任务管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Task/List',
          'name': 'GUIDE_TASK',
          'title': '任务管理',
          'component': () => import('@/pages/Guide/Task/brandList.vue')
        },
        {
          'path': '/Guide/Task/edit/:id',
          'name': 'GUIDE_TASK',
          'title': '新增任务管理',
          'component': () => import('@/pages/Guide/Task/addBrandTask.vue')
        },
        {
          'path': '/Guide/Task/taskOverview/:id',
          'name': 'GUIDE_TASK',
          'title': '查看完整任务',
          'component': () => import('@/pages/Guide/Task/taskOverview.vue')
        },
        {
          'path': '/Guide/Task/detail',
          'name': 'GUIDE_DETAIL',
          'title': '任务概况',
          'component': () => import('@/pages/Guide/Task/detail.vue')
        }
      ]
    }
  ]
}
