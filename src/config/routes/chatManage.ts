/*
 * @Date: 2022-03-30 14:04:17
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-20 18:57:26
 * @FilePath: \ECRP-SG-WEB\src\config\routes\chatManage.ts
 */
export default {
  'path': '/Chat/ChatManage',
  'name': 'ChatManage',
  'component': () => import('@/layout/Default.vue'),
  'meta': {
    'title': '会话管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Social/WeWorkGroup/ChatRecord',
      'name': 'ChatManage',
      'title': '会话管理',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Social/WeWorkGroup/ChatRecord',
          'name': 'ChatRecord',
          'title': '聊天记录',
          'component': () => import('@/pages/Social/ChatRecord/index.vue')
        },
        {
          'path': '/Social/WeWorkGroup/sensitiveWords',
          'name': 'sensitiveWords',
          'title': '敏感词监控',
          'component': () => import('@/pages/WeWork/SensitiveWords/index.vue')
        },
        {
          'path': '/Social/OperationConfig/topicAnalysis',
          'name': 'topicAnalysis',
          'title': '话题分析 ',
          'component': () => import('@/pages/WeWork/topicAnalysis/index.vue')
        },
        {
          'path': '/Social/OperationConfig/SessionCollect',
          'name': 'sessionCollect',
          'title': '会话数据统计',
          'component': () => import('@/pages/WeWork/sessionCollect/index.vue')
        }
      ]
    }
  ]
}
