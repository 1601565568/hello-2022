export default {
  'path': '/Pull/PullNew',
  'name': 'PULL_NEW',
  'component': () => import('@layout/Default.vue'),
  'meta': {
    'title': '获客引流',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Social/SocialOperation',
      'name': 'SocialOperation',
      'title': '好友引流',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SgFriendAutoPass/List',
          'name': 'AutoPass',
          'title': '好友自动通过',
          'component': () => import('@layout/ContentOnly.vue'),
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
          'title': '聚合码',
          'component': () => import('@layout/ContentOnly.vue'),
          'redirect': {
            'name': 'SgPersonalQrcode'
          },
          'children': [
            {
              'path': '/Guide/SgPersonalQrcode/List',
              'name': 'f1',
              'title': '聚合二维码',
              // 'iframeComponent': () => import('@/components/Iframes/SgPersonalQrcode.vue')
              'component': () => import('@/pages/Guide/SgPersonalQrcode/List.vue')
            },
            {
              'path': '/Guide/SgPersonalQrcode/List/Edit/:id',
              'name': 'SgPersonalQrcode',
              'title': '聚合二维码',
              'component': () => import('@/pages/Guide/SgPersonalQrcode/Edit.vue')
            },
            {
              'path': '/Guide/SgPersonalQrcode/List/ActivityEffect/:guid/:name',
              'name': 'SgPersonalQrcode',
              'title': '聚合二维码活动效果分析',
              'component': () => import('@/pages/Guide/SgPersonalQrcode/ActivityEffect/index.vue')
            }
          ]
        },
        {
          'path': '/Guide/SgGuide/ChatAutoReply',
          'name': 'ChatAutoReply',
          'title': '聊天智能回复',
          'component': () => import('@layout/ContentOnly.vue'),
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
        },
        {
          'path': '/WeWork/WelcomeCode/WelcomeCodeList',
          'name': 'WelcomeCodeList',
          'title': '欢迎语',
          'component': () => import('@layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WelcomeCodeList'
          },
          'children': [
            {
              'path': '/WeWork/WelcomeCode/WelcomeCodeList',
              // 'name': 'WelcomeCodeList',
              'name': 'f2',
              'title': '智能欢迎语(企微)',
              'iframeComponent': () => import('@/components/Iframes/WelcomeCodeList.vue')
              // 'component': () => import('@/pages/WeWork/WelcomeCode/List.vue')
            },
            {
              'path': '/WeWork/WelcomeCode/Edit',
              'name': 'WelcomeCodeEdit',
              'title': '编辑智能欢迎语(企微)',
              'component': () => import('@/pages/WeWork/WelcomeCode/Edit/index.vue')
            }
          ]
        },
        {
          'path': '/Guide/speech/speechList',
          'name': 'WelcomesIndex',
          'title': '欢迎语',
          'component': () => import('@layout/ContentOnly.vue'),
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
          'title': '裂变大师',
          'component': () => import('@layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WeWorkGuestCode'
          },
          'children': [
            {
              'path': '/Social/SocialOperation/CustomerCode/List',
              'name': 'CustomerCodeList',
              'title': '裂变大师',
              'component': () => import('@/pages/Guide/CustomerCode/List.vue')
            },
            {
              'path': '/Social/SocialOperation/CustomerCode/Edit',
              'name': 'CustomerCodeEdit',
              'title': '编辑裂变大师',
              'component': () => import('@/pages/Guide/CustomerCode/Edit.vue')
            },
            {
              'path': '/Social/SocialOperation/CustomerCode/Analysis',
              'name': 'CustomerCodeAnalysis',
              'title': '裂变大师报表',
              'component': () => import('@/pages/Guide/CustomerCode/Analysis.vue')
            }
          ]
        },
        {
          path: '/Guide/LBS/Friends/Index',
          name: 'LBSFriends',
          title: 'LBS好友聚合码',
          meta: { requiresAuth: true },
          component: () => import('@layout/ContentOnly.vue'),
          // redirect: {
          //   path: '/Guide/LBS/Friends/Index'
          // },
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
    },
    {
      'path': '/Social/WeWorkGroup',
      'name': 'WeWorkGroup',
      'title': '群引流',
      'component': () => import('@layout/Content.vue'),
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
          'component': () => import('@layout/ContentOnly.vue'),
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
        },
        {
          path: '/Guide/LBS/Group/Index',
          name: 'LBSGroup',
          title: 'LBS群聚合码',
          meta: { requiresAuth: true },
          component: () => import('@layout/ContentOnly.vue'),
          children: [
            {
              path: '/Guide/LBS/Group/Index',
              name: 'LBSGroup',
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
        }
      ]
    },
    {
      'path': '/Guide/RecruitSet',
      'name': 'RecruitSet',
      'title': '会员引流',
      'component': () => import('@layout/Content.vue'),
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
          'title': '侧边栏会员招募',
          'component': () => import('@/pages/Guide/NotMemberPageConfig/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/chanel/chanel',
      'name': 'ChannelCenter',
      'title': '渠道中心',
      'component': () => import('@layout/Content.vue'),
      'redirect': {
        'name': 'chanel'
      },
      'children': [
        {
          'path': '/Guide/chanel/chanel',
          'name': 'chanel',
          'title': '渠道管理',
          'component': () => import('@/pages/Guide/chanel/chanel.vue')
        },
        {
          'path': '/Guide/chanel/ChannelDetail/:channelCode/:channelName',
          'name': 'ChannelDetail',
          'title': '渠道分析',
          'component': () => import('@/pages/Guide/chanel/ChannelAnalysis/ChannelDetail.vue')
        }
      ]
    }
  ]
}
