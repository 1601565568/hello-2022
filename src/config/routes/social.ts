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
      'path': '/Social/WeComMarketing',
      'name': 'WeComMarketing',
      'title': '企微营销',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Marketing/EnterpriseMessage',
          'name': 'EnterpriseMessage',
          'title': '企微好友营销',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
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
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'EnterpriseGroupMessage'
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
          'path': '/Marketing/EnterpriseFriendCircle',
          'name': 'EnterpriseFriendCircle',
          'title': '朋友圈营销',
          'component': () => import('@/pages/WeWork/CRMTectonicMigration/EnterpriseFriendCircle/index.vue')
        },
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
        }
      ]
    },
    {
      'path': '/Social/SocialOperation',
      'name': 'SocialOperation',
      'title': '社交运营',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SgFriendAutoPass/List',
          'name': 'AutoPass',
          'title': '好友自动通过',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'AutoPass'
          },
          'children': [
            {
              'path': '/Guide/SgFriendAutoPass/List',
              'name': 'AutoPass',
              'title': '好友自动通过',
              'component': () => import('@/pages/Guide/SgFriendAutoPass/List.vue')
            },
            {
              'path': '/Guide/SgFriendAutoPass/List/Edit/:id',
              'name': 'AutoPass',
              'title': '好友自动通过',
              'component': () => import('@/pages/Guide/SgFriendAutoPass/Edit.vue')
            }
          ]
        },
        {
          'path': '/Guide/SgPersonalQrcode/List',
          'name': 'AutoPass',
          'title': '聚合二维码',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'SgPersonalQrcode'
          },
          'children': [
            {
              'path': '/Guide/SgPersonalQrcode/List',
              'name': 'SgPersonalQrcode',
              'title': '聚合二维码',
              'component': () => import('@/pages/Guide/SgPersonalQrcode/List.vue')
            },
            {
              'path': '/Guide/SgPersonalQrcode/List/Edit/:id',
              'name': 'SgPersonalQrcode',
              'title': '聚合二维码',
              'component': () => import('@/pages/Guide/SgPersonalQrcode/Edit.vue')
            }
          ]
        },
        {
          'path': '/Guide/SgGuide/ChatAutoReply',
          'name': 'ChatAutoReply',
          'title': '聊天智能回复',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'ChatAutoReply'
          },
          'children': [
            {
              'path': '/Guide/SgGuide/ChatAutoReply',
              'name': 'ChatAutoReply',
              'title': '聊天智能回复',
              'component': () => import('@/pages/WeChat/AutoReply/index.vue')
            },
            {
              'path': '/Guide/AutoReply/edit',
              'name': 'SgPersonalQrcode',
              'title': '聚合二维码',
              'component': () => import('@/pages/WeChat/AutoReply/edit.vue')
            }
          ]
          // 'redirect': {
          //   'name': 'SgPersonalQrcode'
          // },
          // 'children': [
          //   // {
          //   //   'path': '/Guide/SgPersonalQrcode/List',
          //   //   'name': 'SgPersonalQrcode',
          //   //   'title': '聚合二维码',
          //   //   'component': () => import('@/pages/Guide/SgPersonalQrcode/List.vue')
          //   // },
          //   {
          //     'path': '/Guide/AutoReply/edit',
          //     'name': 'sgAutoReplyEdit',
          //     'title': '编辑',
          //     'component': () => import('@/pages/WeChat/AutoReply/edit.vue')
          //   }
          // ]
        },
        {
          'path': '/Guide/chanel/chanel',
          'name': 'chanel',
          'title': '渠道管理',
          'component': () => import('@/pages/Guide/chanel/chanel.vue')
        },
        {
          'path': '/WeWork/WelcomeCode/WelcomeCodeList',
          'name': 'WelcomeCodeList',
          'title': '智能欢迎语(企微)',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WelcomeCodeList'
          },
          'children': [
            {
              'path': '/WeWork/WelcomeCode/WelcomeCodeList',
              'name': 'WelcomeCodeList',
              'title': '智能欢迎语(企微)',
              'component': () => import('@/pages/WeWork/WelcomeCode/List.vue')
            },
            {
              'path': '/WeWork/WelcomeCode/Edit',
              'name': 'WelcomeCodeEdit',
              'title': '编辑智能欢迎语(企微)',
              'component': () => import('@/pages/WeWork/WelcomeCode/Edit.vue')
            }
          ]
        },
        {
          'path': '/Guide/speech/speechList',
          'name': 'WelcomesIndex',
          'title': '欢迎语',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WelcomesIndex'
          },
          'children': [
            {
              'path': '/Guide/speech/speechList',
              'name': 'WelcomesIndex',
              'title': '欢迎语',
              'component': () => import('@/pages/WeChat/Welcomes/index.vue')
            },
            {
              'path': '/Guide/speech/edit',
              'name': 'WelcomesEdit',
              'title': '编辑欢迎语（个号）',
              'component': () => import('@/pages/WeChat/Welcomes/edit.vue')
            }
          ]
        },
        {
          'path': '/Social/SocialOperation/CustomerCode/List',
          'name': 'CustomerCode',
          'title': '一客一码',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WeWorkGuestCode'
          },
          'children': [
            {
              'path': '/Social/SocialOperation/CustomerCode/List',
              'name': 'CustomerCodeList',
              'title': '一客一码',
              'component': () => import('@/pages/Guide/CustomerCode/List.vue')
            },
            {
              'path': '/Social/SocialOperation/CustomerCode/Edit',
              'name': 'CustomerCodeEdit',
              'title': '编辑一客一码',
              'component': () => import('@/pages/Guide/CustomerCode/Edit.vue')
            },
            {
              'path': '/Social/SocialOperation/CustomerCode/Analysis',
              'name': 'CustomerCodeAnalysis',
              'title': '一客一码报表',
              'component': () => import('@/pages/Guide/CustomerCode/Analysis.vue')
            }
          ]
        },
        {
          'path': '/Social/SocialOperation/QrcodePoster/List',
          'name': 'qrcodePoster',
          'title': '二维码海报',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WeChatQrCodePlacard'
          },
          'children': [
            {
              'path': '/Social/SocialOperation/QrcodePoster/List',
              'name': 'WeChatQrCodePlacard',
              'title': '二维码海报',
              'component': () => import('@/pages/Guide/QrcodePoster/List.vue')
            },
            {
              'path': '/Social/SocialOperation/QrcodePoster/Edit',
              'name': 'QrcodePosterEdit',
              'title': '编辑二维码海报',
              'component': () => import('@/pages/Guide/QrcodePoster/Edit.vue')
            }
          ]
        },
        {
          'path': '/Social/SocialOperation/QrcodePosterGH/List',
          'name': 'qrcodePoster',
          'title': '二维码海报（个号）',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WeWorkQrCodePlacard'
          },
          'children': [
            {
              'path': '/Social/SocialOperation/QrcodePosterGH/List',
              'name': 'WeWorkQrCodePlacard',
              'title': '二维码海报（个号）',
              'component': () => import('@/pages/Guide/QrcodePoster/List.vue')
            },
            {
              'path': '/Social/SocialOperation/QrcodePosterGH/Edit',
              'name': 'QrcodePosterEdit',
              'title': '编辑二维码海报（个号）',
              'component': () => import('@/pages/Guide/QrcodePoster/Edit.vue')
            }
          ]
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
        },
        {
          'path': '/Social/WeWorkGroup/chatRoomGroup',
          'name': 'chatRoomGroupAll',
          'title': '群聚合码',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'chatRoomGroup'
          },
          'children': [
            {
              'path': '/Social/WeWorkGroup/chatRoomGroup',
              'name': 'chatRoomGroup',
              'title': '群聚合码',
              'component': () => import('@/pages/Social/WeWorkGroup/ChatRoomGroup/index.vue')
            },
            {
              'path': '/Social/WeWorkGroup/chatRoom/:configId',
              'name': 'chatRoom',
              'title': '群列表',
              'component': () => import('@/pages/Social/WeWorkGroup/ChatRoomGroup/chatRoomList.vue')
            },
            {
              'path': '/Social/WeWorkGroup/chatRoomUser/:chatId',
              'name': 'chatRoomUser',
              'title': '群成員列表',
              'component': () => import('@/pages/Social/WeWorkGroup/ChatRoomGroup/chatRoomUserList.vue')
            },
            {
              'path': '/Social/WeWorkGroup/chatRoomGroup/addOrEdit',
              'name': 'chatRoomGroupAddOrEdit',
              'title': '编辑或新增群聚合码',
              'component': () => import('@/pages/Social/WeWorkGroup/ChatRoomGroup/chatRoomGroup.vue')
            }
          ]
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
        },
        {
          'path': '/Social/OperationData/GuideBehaviorCount/NsTableWelcomes',
          'name': 'SocialNsTableWelcomes',
          'title': '好友数据',
          'component': () => import('@/pages/WeWork/GuideBehaviorCount/list/TableFriendCnt.vue')
        },
        {
          path: '/AnalysisData/AnalysisEntWechatData',
          name: 'AnalysisEntWechatData',
          title: '企微数据分析',
          component: () => import('@nascent/ecrp-ecrm/src/layout/ContentTab.vue'),
          redirect: {
            name: 'EnterpriseWechatFriendData'
          },
          children: [
            {
              path: '/AnalysisWechatData/EnterpriseWechatFriendData',
              name: 'EnterpriseWechatFriendData',
              title: '企微好友数据分析',
              component: () => import('@/pages/WeWork/CRMTectonicMigration/AnalysisData/EnterpriseWechatFriendData/index.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/Guide/LBS/Group',
      name: 'Group',
      title: 'LBS群聚合码',
      meta: { requiresAuth: true },
      component: () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      redirect: {
        path: '/Guide/LBS/Group/Index'
      },
      children: [
        {
          path: '/Guide/LBS/Group/Index',
          name: 'GroupIndex',
          meta: { requiresAuth: true },
          title: 'LBS群聚合码',
          'component': () => import('@/pages/Guide/LBS/Group/Index.vue')
        },
        {
          path: '/Guide/LBS/Group/Edit',
          name: 'GroupEdit',
          meta: { requiresAuth: true },
          title: 'LBS群聚合码',
          'component': () => import('@/pages/Guide/LBS/Group/Edit.vue')
        },
        {
          path: '/Guide/LBS/Group/Analysis',
          name: 'GroupAnalysis',
          meta: { requiresAuth: true },
          title: 'LBS群聚合码',
          'component': () => import('@/pages/Guide/LBS/Group/Analysis.vue')
        }
      ]
    },
    {
      path: '/Guide/LBS/Friends',
      name: 'Friends',
      title: 'LBS好友聚合码',
      meta: { requiresAuth: true },
      component: () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      redirect: {
        path: '/Guide/LBS/Friends/Index'
      },
      children: [
        {
          path: '/Guide/LBS/Friends/Index',
          name: 'FriendsIndex',
          meta: { requiresAuth: true },
          title: 'LBS好友聚合码',
          'component': () => import('@/pages/Guide/LBS/Friends/Index.vue')
        },
        {
          path: '/Guide/LBS/Friends/Edit',
          name: 'FriendsEdit',
          meta: { requiresAuth: true },
          title: 'LBS好友聚合码',
          'component': () => import('@/pages/Guide/LBS/Friends/Edit.vue')
        },
        {
          path: '/Guide/LBS/Friends/Analysis',
          name: 'FriendsAnalysis',
          meta: { requiresAuth: true },
          title: 'LBS好友聚合码',
          'component': () => import('@/pages/Guide/LBS/Friends/Analysis.vue')
        }
      ]
    }
  ]
}
