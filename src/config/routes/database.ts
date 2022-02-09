export default {
  'path': '/Database',
  'name': 'Database',
  'component': () => import('@/layout/Default.vue'),
  'meta': {
    'title': '工作台',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/WorkBench',
      'name': 'WorkBench',
      'title': '工作台',
      'component': () => import('@layout/ContentFullScreen.vue'),
      'children': [
        {
          'path': '/Overview',
          'name': 'Overview',
          'title': '经营概览',
          'component': () => import('@/pages/WorkBench/Overview.vue')
        }]
    }]
}
