export default {
  'path': '/Pull/PullNew',
  'name': 'PULL_NEW',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '获客引流',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Social/SocialOperation',
      'name': 'SocialOperation',
      'title': '好友引流',
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
      'title': '群引流',
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
      'path': '/Guide/RecruitSet',
      'name': 'RecruitSet',
      'title': '招募设置',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/RecruitSet/RecruitConfigGift',
          'name': 'RecruitConfigGift',
          'title': '招募奖励设置',
          'component': () => import('@/pages/Guide/RecruitmentSettings/index.vue')
        },
        {
          'path': '/Guide/RecruitSet/RecruitConfig',
          'name': 'RecruitConfig',
          'title': '招募设置',
          'component': () => import('@/pages/Guide/Recruitment/RecruitmentSettings/index.vue')
        },
        {
          'path': '/Guide/RecruitSet/RecruitPageConfig',
          'name': 'RecruitPageConfig',
          'title': '招募页面设置',
          'component': () => import('@/pages/Guide/Recruitment/RecruitmentPageSettings/index.vue')
        },
        {
          'path': '/Guide/RecruitSet/NotMemberPageConfig',
          'name': 'NotMemberPageConfig',
          'title': '非会员页面设置',
          'component': () => import('@/pages/Guide/NotMemberPageConfig/index.vue')
        }
      ]
    }
  ]
}
