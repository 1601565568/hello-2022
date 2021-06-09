export default {
  'path': '/Guide/ActivityIndex/ShopSetList',
  'name': 'ACTIVITY_INDEX',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '数据运营',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/ActivityIndex/ShopSetList',
      'name': 'WeWorkOperateAnalysis',
      'title': '企微运营分析',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          path: '/AnalysisWechatData/EnterpriseWechatFriendData',
          name: 'EnterpriseWechatFriendData',
          title: '企微好友数据分析',
          component: () => import('@/pages/WeWork/CRMTectonicMigration/AnalysisData/EnterpriseWechatFriendData/index.vue')
        },
        {
          'path': '/Social/OperationData/CircleOfFriends',
          'name': 'CircleOfFriends',
          'title': '朋友圈看板',
          'component': () => import('@/pages/WeWork/CircleofFriends/index.vue')
        },
        {
          'path': '/Social/WeComCustomerOperation/FriendsAnalysis',
          'name': 'WeComFriendsAnalysis',
          'title': '好友分析',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
          'redirect': {
            'name': 'WeComRepeatCustomer'
          },
          'children': [
            {
              'path': '/Social/WeComCustomerOperation/FriendsAnalysis',
              'name': 'WeComFriendsAnalysis',
              'title': '好友分析',
              'component': () => import('@/pages/WeWork/FriendsAnalysis/friendsAnalysis.vue')
            }
          ]
        },
        {
          'path': '/Social/WeComCustomerOperation/LossCustomers',
          'name': 'WeComLossCustomers',
          'title': '流失客户',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentTab.vue'),
          'redirect': {
            'name': 'WeComDeleteCustomers'
          },
          children: [
            {
              path: '/Social/WeComCustomerOperation/DeleteCustomers',
              name: 'WeComDeleteCustomers',
              title: '企微流失好友-删除',
              component: () => import('@/pages/WeWork/LossCustomers/deleteCustomers.vue')
            },
            {
              path: '/Social/WeComCustomerOperation/BeDeleteCustomers',
              name: 'WeComBeDeleteCustomers',
              title: '企微流失好友-被删除',
              component: () => import('@/pages/WeWork/LossCustomers/beDeletedCustomers.vue')
            }
          ]
        },
        {
          path: '/Social/OperationData/MaterialData',
          name: 'MaterialData',
          title: '素材库明细统计',
          component: () => import('@/pages/WeWork/MaterialData/index.vue')
        },
        {
          path: '/Social/OperationData/MaterialChat',
          name: 'MaterialChat',
          title: '素材库累计数据',
          component: () => import('@/pages/WeWork/MaterialChat/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/SgGuide',
      'name': 'WeChatOperateAnalysis',
      'title': '微信运营分析',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SgGuide/ActivityAnalysis',
          'name': 'ActivityAnalysis',
          'title': '导购行为分析',
          'component': () => import('@/pages/Guide/ActivityAnalysis/Index.vue')
        }
      ]
    },
    {
      'path': '/Risk/PhoneRiskManagement/SMSRecords',
      'name': 'RiskManage',
      'title': '风控管理',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Risk/PhoneRiskManagement/CallRecords',
          'name': 'CallRecords',
          'title': '通话记录',
          'component': () => import('@/pages/RiskManagement/PhoneRiskContro/CallRecords/index.vue')
        },
        {
          'path': '/Risk/PhoneRiskManagement/SMSRecords',
          'name': 'SMSRecords',
          'title': '短信记录',
          'component': () => import('@/pages/RiskManagement/PhoneRiskContro/SmsRecords/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/ActivityIndex/WorkStatistics',
      'name': 'ShopOperateAnalysis',
      'title': '门店运营分析',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/ActivityIndex/WorkStatistics',
          'name': 'ACTIVITY_INDEX_WORK_STATISTICS',
          'title': '导购工作统计',
          'component': () => import('@/pages/Guide/ActivityIndex/WorkStatistics.vue')
        },
        {
          'path': '/Guide/ActivityIndex/ShopStatistics',
          'name': 'ACTIVITY_INDEX_SHOP_STATISTICS',
          'title': '门店工作统计',
          'component': () => import('@/pages/Guide/ActivityIndex/ShopStatistics.vue')
        },
        {
          path: '/DataCenter/VisitStatistics',
          name: 'VisitStatistics',
          title: '员工访问统计',
          component: () =>
            import('@/pages/DataCenter/SystemAnalysis/VisitStatistics/index.vue')
        }
      ]
    },
    {
      'path': '/Guide/OperationLog/List',
      'name': 'SystemLog',
      'title': '系统日志',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/OperationLog/List',
          'name': 'SG_WX_ACCOUNT',
          'title': '操作日志',
          'component': () => import('@/pages/Guide/OperationLog/List.vue')
        },
        {
          'path': '/Guide/LoginLog/List',
          'name': 'SG_LOGIN_LOG',
          'title': '登录日志',
          'component': () => import('@/pages/Guide/LoginLog/List.vue')
        }
      ]
    },
    {
      'path': '/Social/SocialOperation/RedPacket/Analysis',
      'name': 'redPacketAnalysis',
      'title': '',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'redirect': {
        'name': 'redPacketAnalysis'
      },
      'children': [
        {
          'path': '/Social/SocialOperation/RedPacket/Analysis',
          'name': 'redPacketAnalysis',
          'title': '数据概览',
          'component': () => import('@/pages/Guide/RedPacket/Analysis/Analysis/index.vue')
        },
        {
          'path': '/Social/SocialOperation/RedPacket/ReceiveRecord',
          'name': 'redPacketAnalysis',
          'title': '领取记录',
          'component': () => import('@/pages/Guide/RedPacket/Analysis/ReceiveRecord/index.vue')
        },
        {
          'path': '/Social/SocialOperation/RedPacket/SendRecord',
          'name': 'redPacketAnalysis',
          'title': '发放记录',
          'component': () => import('@/pages/Guide/RedPacket/Analysis/SendRecord/index.vue')
        }
      ]
    }
  ]
}
