export default {
  'path': '/Social/SocialOperation',
  'name': 'SocialOperation',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '社群营销',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Marketing/EnterpriseMessage',
      'name': 'EnterpriseMessage',
      'title': '企微好友营销',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'redirect': {
        'name': 'EnterpriseMessage'
      },
      'children': [
        {
          'path': '/Marketing/EnterpriseMessage',
          'name': 'EnterpriseMessage',
          'title': '企微好友营销',
          'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseMessage/index.vue')
        },
        {
          'path': '/Marketing/EnterpriseMessagePush',
          'name': 'EnterpriseMessagePush',
          'title': '企微好友营销新增',
          'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseMessagePush/index.vue')
        },
        {
          'path': '/Marketing/EffectAnalysisEnterprise',
          'name': 'EffectAnalysisEnterprise',
          'title': '企微好友营销分析',
          'component': () => import('@/pages/WeWork/CRMTectonicMigration/EffectAnalysis/EffectAnalysisEnterprise/index.vue')
        }
      ]
    },
    {
      'path': '/Marketing/EnterpriseGroupMessage',
      'name': 'EnterpriseGroupMessage',
      'title': '企微群营销',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'redirect': {
        'name': 'EnterpriseGroupMessage'
      },
      'children': [
        {
          'path': '/Marketing/EnterpriseGroupMessage',
          'name': 'EnterpriseGroupMessage',
          'title': '企微群营销',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'path': '/Marketing/EnterpriseGroupMessage'
          },
          'children': [
            {
              'path': '/Marketing/EnterpriseGroupMessage',
              'name': 'EnterpriseGroupMessage',
              'title': '企微群营销',
              'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseGroupMessage/index.vue')
            },
            {
              'path': '/Marketing/EnterpriseGroupMessagePush',
              'name': 'EnterpriseGroupMessagePush',
              'title': '企微好友营销新增',
              'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseGroupMessagePush/index.vue')
            },
            {
              'path': '/Marketing/EffectAnalysisEnterpriseGroup',
              'name': 'EffectAnalysisEnterpriseGroup',
              'title': '企微好友营销分析',
              'component': () => import('@/pages/WeWork/CRMTectonicMigration/EffectAnalysis/EffectAnalysisEnterpriseGroup/index.vue')
            }
          ]
        },
        {
          'path': '/Marketing/SOP',
          'name': 'SOP',
          'title': '社群日历',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': '/Marketing/SOP'
          },
          'children': [
            {
              'path': '/Marketing/SOP',
              'name': 'SOP',
              'title': '社群日历',
              'component': () => import('@/pages/WeWork/SOP/Activity/index.vue')
            },
            {
              'path': '/Marketing/SOP/Edit/:id',
              'name': 'SOP',
              'title': '社群日历新增、编辑',
              'component': () => import('@/pages/WeWork/SOP/Activity/Edit/index.vue')
            }
          ]
        }
      ]
    },
    {
      'path': '/Marketing/EnterpriseFriendCircle',
      'name': 'EnterpriseFriendCircle',
      'title': '朋友圈营销',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'redirect': {
        'name': 'EnterpriseFriendCircle'
      },
      'children': [
        {
          'path': '/Marketing/EnterpriseFriendCircle',
          'name': 'EnterpriseFriendCircle',
          'title': '朋友圈营销',
          'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseFriendCircle/index.vue')
        }
      ]
    },
    {
      'path': '/Marketing/ActivityAuditList',
      'name': 'ActivityAuditList',
      'title': '活动审核',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'redirect': {
        'name': 'ActivityAuditList'
      },
      'children': [
        {
          'path': '/Marketing/ActivityAuditList',
          'name': 'ActivityAuditList',
          'title': '活动审核',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentTab.vue'),
          'redirect': {
            'name': 'enterpriseExamine'
          },
          'children': [
            {
              'path': '/EnterpriseExamine',
              'name': 'enterpriseExamine',
              'title': '企业微信好友营销审核',
              'component': () => import('@/pages/WeWork/CRMTectonicMigration/ActivityExamine/index.vue')
            },
            {
              'path': '/EnterpriseGroupExamine',
              'name': 'enterpriseGroupExamine',
              'title': '企业微信群营销审核',
              'component': () => import('@/pages/WeWork/CRMTectonicMigration/ActivityExamine/index.vue')
            }
          ]
        },
        {
          'path': '/Marketing/SOP/Examine',
          'name': 'SOPExamine',
          'title': '社群日历审核',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'children': [
            {
              'path': '/Marketing/SOP/Examine',
              'name': 'SOPExamine',
              'title': '社群日历审核',
              'component': () => import('@/pages/WeWork/SOP/Examine/index.vue')
            }
          ]
        }
      ]
    }
    // {
    //   'path': '/Marketing/ActivityAuditList',
    //   'name': 'ActivityAuditList',
    //   'title': '活动审核',
    //   'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentTab.vue'),
    //   'redirect': {
    //     'name': 'enterpriseExamine'
    //   },
    //   'children': [
    //     {
    //       'path': '/EnterpriseExamine',
    //       'name': 'enterpriseExamine',
    //       'title': '企业微信好友营销审核',
    //       'component': () => import('@/pages/WeWork/CRMTectonicMigration/ActivityExamine/index.vue')
    //     },
    //     {
    //       'path': '/EnterpriseGroupExamine',
    //       'name': 'enterpriseGroupExamine',
    //       'title': '企业微信群营销审核',
    //       'component': () => import('@/pages/WeWork/CRMTectonicMigration/ActivityExamine/index.vue')
    //     }
    //   ]
    // }
    // {
    //   'path': '/Social/WeComMarketing',
    //   'name': 'WeComMarketing',
    //   'title': '企微营销',
    //   'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
    //   'children': [
    //     {
    //       'path': '/Marketing/EnterpriseMessage',
    //       'name': 'EnterpriseMessage',
    //       'title': '企微好友营销',
    //       'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
    //       'redirect': {
    //         'name': 'EnterpriseMessage'
    //       },
    //       'children': [
    //         {
    //           'path': '/Marketing/EnterpriseMessage',
    //           'name': 'EnterpriseMessage',
    //           'title': '企微好友营销',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseMessage/index.vue')
    //         },
    //         {
    //           'path': '/Marketing/EnterpriseMessagePush',
    //           'name': 'EnterpriseMessagePush',
    //           'title': '企微好友营销新增',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseMessagePush/index.vue')
    //         },
    //         {
    //           'path': '/Marketing/EffectAnalysisEnterprise',
    //           'name': 'EffectAnalysisEnterprise',
    //           'title': '企微好友营销分析',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/EffectAnalysis/EffectAnalysisEnterprise/index.vue')
    //         }
    //       ]
    //     },
    //     {
    //       'path': '/Marketing/EnterpriseGroupMessage',
    //       'name': 'EnterpriseGroupMessage',
    //       'title': '企微群营销',
    //       'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
    //       'redirect': {
    //         'name': 'EnterpriseGroupMessage'
    //       },
    //       'children': [
    //         {
    //           'path': '/Marketing/EnterpriseGroupMessage',
    //           'name': 'EnterpriseGroupMessage',
    //           'title': '企微群营销',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseGroupMessage/index.vue')
    //         },
    //         {
    //           'path': '/Marketing/EnterpriseGroupMessagePush',
    //           'name': 'EnterpriseGroupMessagePush',
    //           'title': '企微好友营销新增',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseGroupMessagePush/index.vue')
    //         },
    //         {
    //           'path': '/Marketing/EffectAnalysisEnterpriseGroup',
    //           'name': 'EffectAnalysisEnterpriseGroup',
    //           'title': '企微好友营销分析',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/EffectAnalysis/EffectAnalysisEnterpriseGroup/index.vue')
    //         }
    //       ]
    //     },
    //     {
    //       'path': '/Marketing/EnterpriseFriendCircle',
    //       'name': 'EnterpriseFriendCircle',
    //       'title': '朋友圈营销',
    //       'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseFriendCircle/index.vue')
    //     },
    //     {
    //       'path': '/Marketing/ActivityAuditList',
    //       'name': 'ActivityAuditList',
    //       'title': '活动审核',
    //       'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentTab.vue'),
    //       'redirect': {
    //         'name': 'enterpriseExamine'
    //       },
    //       'children': [
    //         {
    //           'path': '/EnterpriseExamine',
    //           'name': 'enterpriseExamine',
    //           'title': '企业微信好友营销审核',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/ActivityExamine/index.vue')
    //         },
    //         {
    //           'path': '/EnterpriseGroupExamine',
    //           'name': 'enterpriseGroupExamine',
    //           'title': '企业微信群营销审核',
    //           'component': () => import('@/pages/WeWork/CRMTectonicMigration/ActivityExamine/index.vue')
    //         }
    //       ]
    //     }
    //   ]
    // }
  ]
}
