export default {
  'path': '/Social/SocialOperation',
  'name': 'SocialOperation',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '社群运营',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Social/OperationConfig',
      'name': 'OperationConfig',
      'title': '运营设置',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Social/OperationConfig',
          'name': 'OperationConfig',
          'title': '企业微信设置',
          'component': () => import('@/pages/Social/OperationConfig/WeWorkConfig/index.vue')
        }
      ]
    },
    {
      'path': '/Social/WeWorkGroup',
      'name': 'WeWorkGroup',
      'title': '群运营',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Social/WeWorkGroup/GroupAssistant',
          'name': 'WeWorkGroupAssistant',
          'title': '群助手',
          'component': () => import('@/pages/Social/WeWorkGroup/WeWorkGroupAssistant/index.vue')
        },
        {
          'path': '/Social/WeWorkGroup/GroupWelcomeCode',
          'name': 'WeWorkGroupWelcomeCode',
          'title': '群欢迎语',
          'component': () => import('@/pages/Social/WeWorkGroup/WeWorkGroupWelcomeCode/index.vue')
        }
      ]
    },
    {
      'path': '/Social/OperationConfig',
      'name': 'OperationData',
      'title': '运营数据',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Social/OperationData/GuideBehaviorCount',
          'name': 'GuideBehaviorCount',
          'title': '导购行为数据统计',
          'component': () => import('@/pages/WeWork/GuideBehaviorCount/index.vue')
        }
      ]
    }
  ]
}
