export default {
  'path': '/operate/management',
  'name': 'OPERATE_MANAGEMENT',
  'component': () => import('@/views/DefaultOperate'),
  'meta': {
    'title': '开发管理',
    'requiresAuth': true
  },
  'children': [{
    'path': '/operate/management/',
    'name': 'OPERATE_MANAGEMENT/',
    'title': '定时任务',
    'component': () => import('@/views/ContentOperate'),
    'children': [
      {
        'path': '/operate/management/developmentManagement',
        'name': 'MANAGEMENT_DEVELOPMENTMANAGEMENT',
        'title': '定时任务',
        'component': () => import('@/views/ISV/developmentManagement/index')
      }
    ] }
  ]
}
