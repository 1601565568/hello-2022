import iframe from '@/components/Iframe/index.vue'
export default {
  'path': '/Social/SocialOperation',
  'name': 'SocialOperation',
  'component': () => import('@/layout/Default.vue'),
  'meta': {
    'title': '社群营销',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Marketing/EnterpriseMessage',
      'name': 'EnterpriseMessage',
      'title': '企微好友营销',
      'component': () => import('@layout/Content.vue'),
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
      'component': () => import('@layout/Content.vue'),
      'redirect': {
        'name': 'EnterpriseGroupMessage'
      },
      'children': [
        {
          'path': '/Marketing/EnterpriseGroupMessage',
          'name': 'EnterpriseGroupMessage',
          'title': '企微群营销',
          'component': () => import('@layout/ContentOnly.vue'),
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
          'component': () => import('@layout/ContentOnly.vue'),
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
        },
        {
          'path': '/Social/SocialOperation/RedPacket/Send/List',
          'name': 'redPacketSend',
          'title': '',
          'component': () => import('@layout/ContentOnly.vue'),
          'redirect': {
            'name': 'redPacketSendList'
          },
          'children': [
            {
              'path': '/Social/SocialOperation/RedPacket/Send/List',
              'name': 'redPacketSendList',
              'title': '发红包'
              // 'iframeComponent': iframe
            },
            {
              'path': '/Social/SocialOperation/RedPacket/Send/Edit',
              'name': 'redPacketSendEdit',
              'title': '新建发红包',
              'component': () => import('@/pages/Guide/RedPacket/Send/Edit.vue')
            }
          ]
        }
      ]
    },
    {
      'path': '/EnterpriseExamine',
      'name': 'ActivityAuditList',
      'title': '活动审核',
      'component': () => import('@layout/Content.vue'),
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
      'path': '/Marketing/FriendsCircle/OutList',
      'name': 'FriendsCircle',
      'title': '朋友圈统计',
      'component': () => import('@layout/Content.vue'),
      'redirect': {
        'name': 'enterpriseExamine'
      },
      'children': [
        {
          'path': '/Marketing/FriendsCircle/List',
          'name': 'FriendsCircleList',
          'title': '对外信息内容管理',
          'component': () => import('@/pages/WeWork/FriendsCircle/List.vue')
        },
        {
          'path': '/Marketing/FriendsCircle/OutList',
          'name': 'FriendsCircleOutList',
          'title': '对外信息内容管理',
          'component': () => import('@/pages/WeWork/FriendsCircle/OutList.vue')
        },
        {
          'path': '/Marketing/FriendsCircle/Edit',
          'name': 'FriendsCircleList',
          'title': '对外信息内容管理',
          'component': () => import('@/pages/WeWork/FriendsCircle/Edit.vue')
        },
        {
          'path': '/Marketing/FriendsCircle/OutEdit',
          'name': 'FriendsCircleOutEdit',
          'title': '对外信息内容管理',
          'component': () => import('@/pages/WeWork/FriendsCircle/OutEdit.vue')
        },
        {
          'path': '/Marketing/FriendsCircle/Analysis',
          'name': 'FriendsCircleAnalysis',
          'title': '对外信息内容管理',
          'component': () => import('@/pages/WeWork/FriendsCircle/Analysis.vue')
        }
      ]
    },
    {
      'path': '/Marketing/EnterpriseFriendCircle',
      'name': 'EnterpriseFriendCircle',
      'title': '朋友圈营销',
      'component': () => import('@layout/Content.vue'),
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
      'component': () => import('@layout/Content.vue'),
      'redirect': {
        'name': 'ActivityAuditList'
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
        },
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
