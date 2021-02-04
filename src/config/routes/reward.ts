export default {
  'path': '/Guide/ActivityIndex/ShopSetList',
  'name': 'ACTIVITY_INDEX',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '数据运营',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/ActivityIndex/ShopSetList',
      'name': 'DataManage',
      'title': '数据管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
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
        },
        {
          path: '/AnalysisWechatData/EnterpriseWechatFriendData',
          name: 'EnterpriseWechatFriendData',
          title: '企微好友数据分析',
          component: () => import('@/pages/WeWork/CRMTectonicMigration/AnalysisData/EnterpriseWechatFriendData/index.vue')
        },
        {
          'path': '/Social/OperationData/CircleOfFriends',
          'name': 'CircleOfFriends',
          'title': '朋友圈统计',
          'component': () => import('@/pages/WeWork/CircleofFriends/index.vue')
        },
        {
          'path': '/Guide/OperationLog/List',
          'name': 'SG_WX_ACCOUNT',
          'title': '操作日志',
          'component': () => import('@/pages/Guide/OperationLog/List.vue')
        },
        {
          'path': '/Guide/LoginLog/List',
          'name': 'SG_LOGIN_LOG',
          'title': '登录日志',
          'component': () => import('@/pages/Guide/LoginLog/List.vue')
        }
      ]
    }
  ]
}
