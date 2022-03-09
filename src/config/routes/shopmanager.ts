export default {
  'path': '/Guide/SgGuide/List',
  'name': 'SHOP_MANAGER',
  'component': () => import('@/layout/Default.vue'),
  'meta': {
    'title': '门店管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/SgGuide',
      'name': 'SHOP_MANAGER2',
      'title': '门店管理',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SgStoreManagement/List',
          'name': 'ShopManager',
          'title': '门店列表',
          'component': () => import('@/pages/Guide/SgStoreManagement/List.vue')
        },
        {
          'path': '/Guide/SgGuide/List',
          'name': 'Guide_List',
          'title': '员工列表',
          'component': () => import('@/pages/Guide/SgGuide/List.vue')
        }, {
          'path': '/Guide/ActivityIndex/ShopSetList',
          'name': 'ACTIVITY_INDEX_SHOP_SETLIST',
          'title': '门店指标',
          'component': () => import('@/pages/Guide/ActivityIndex/ShopSetList.vue')
        }, {
          'path': '/Guide/ActivityIndex/RewardSetList',
          'name': 'ACTIVITY_INDEX_REWARD_SETLIST',
          'title': '提成奖励设置',
          'component': () => import('@/pages/Guide/ActivityIndex/RewardSetList.vue')
        }
      ]
    },
    {
      'path': '/Guide/Task/List',
      'name': 'TaskManger',
      'title': '任务体系',
      'component': () => import('@layout/Content.vue'),
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
        }, {
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
        }
      ]
    }
  ]
}
