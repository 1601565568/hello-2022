export default {
  path: '/DataCenter/DataCenterOption',
  name: 'DataCenter',
  component: () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  meta: {
    title: '数据中心',
    requiresAuth: true
  },
  children: [
    {
      path: '/DataCenter/SystemAnalysis',
      name: 'SystemAnalysis',
      title: '系统使用分析',
      component: () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      children: [
        {
          path: '/DataCenter/VisitStatistics',
          name: 'VisitStatistics',
          title: '员工访问统计',
          component: () =>
            import('@/pages/DataCenter/SystemAnalysis/VisitStatistics/index.vue')
        }
      ]
    }
  ]
}
