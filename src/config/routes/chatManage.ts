export default {
  'path': '/Chat/ChatManage',
  'name': 'CHAT_MANAGE',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '会话管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Social/WeWorkGroup/ChatRecord',
      'name': 'ChatRecord',
      'title': '会话管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [

      ]
    }
  ]
}
