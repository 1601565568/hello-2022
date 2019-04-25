export default {
  'path': '/Database',
  'name': 'Database',
  'component': () => import('web-crm/src/views/Default'),
  'meta': {
    'title': '工作台',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/WorkBench',
      'name': 'WorkBench',
      'title': '工作台',
      'component': () => import('web-crm/src/views/ContentFullScreen'),
      'children': [
        {
          'path': '/Overview',
          'name': 'Overview',
          'title': '经营概览',
          'component': () => import('@/views/WorkBench/Overview')
        }]
    }]
}
