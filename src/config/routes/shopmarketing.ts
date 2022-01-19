export default {
  'path': '/Guide/Material/imageText',
  'name': 'SHOP_MARKETING',
  'component': () => import('@layout/Default.vue'),
  'meta': {
    'title': '内容管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Material/Library',
      'name': 'SHOP_MARKETING2',
      'title': '素材中心',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Material/Library',
          'name': 'Library',
          'title': '素材库',
          'component': () => import('@layout/ContentOnly.vue'),
          'redirect': {
            'name': 'LibraryList'
          },
          'children': [
            {
              'path': '/Guide/Material/Library',
              'name': 'LibraryList',
              'title': '素材库列表',
              'component': () => import('@/pages/Guide/Material/Library/Index.vue')
            },
            {
              'path': '/Guide/Material/Edit',
              'name': 'LibraryEdit',
              'title': '编辑素材',
              'component': () => import('@/pages/Guide/Material/Library/Edit.vue')
            }
          ]
        },
        {
          'path': '/Guide/Material/MaterialAnalysis',
          'name': 'MaterialAnalysis',
          'title': '素材分析',
          'component': () => import('@/pages/Guide/Material/MaterialAnalysis/index.vue')
        },
        {
          'path': '/Guide/Material/MaterialAnalysis/details/:targetId',
          'name': 'MaterialAnalysisDetails',
          'title': '素材分析详情',
          'component': () => import('@/pages/Guide/Material/MaterialAnalysis/details.vue')
        }
      ]
    },
    {
      'path': '/Guide/SgCoupon/CouponList',
      'name': 'SHOP_MARKETING3',
      'title': '门店营销',
      'component': () => import('@layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/SgCoupon/CouponList',
          'name': 'KQGL',
          'title': '优惠券发放',
          'component': () => import('@/pages/Guide/SgCoupon/CouponList.vue')
        },
        {
          'path': '/Guide/SgQuicklyWord/List',
          'name': 'QuicklyWord',
          'title': '快捷话术',
          'component': () => import('@/pages/Guide/SgQuicklyWord/List.vue')
        }
      ]
    },
    {
      'path': '/Social/SocialOperation/QrcodePoster/List',
      'name': 'qrcodePoster',
      'title': '二维码海报',
      'component': () => import('@layout/Content.vue'),
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
      'component': () => import('@layout/Content.vue'),
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
    },
    {
      'path': '/Social/SocialOperation/RedPacket/Strategies/List',
      'name': 'redPacketStrategies',
      'title': '',
      'component': () => import('@layout/Content.vue'),
      'redirect': {
        'name': 'redPacketStrategiesList'
      },
      'children': [
        {
          'path': '/Social/SocialOperation/RedPacket/Strategies/List',
          'name': 'redPacketStrategiesList',
          'title': '红包策略',
          'component': () => import('@/pages/Guide/RedPacket/Strategies/List.vue')
        },
        {
          'path': '/Social/SocialOperation/RedPacket/Strategies/Edit',
          'name': 'redPacketStrategiesEdit',
          'title': '新建红包策略',
          'component': () => import('@/pages/Guide/RedPacket/Strategies/Edit.vue')
        }
      ]
    },
    {
      'path': '/Social/SocialOperation/RedPacket/Poster/List',
      'name': 'redPacketPoster',
      'title': '',
      'component': () => import('@layout/Content.vue'),
      'redirect': {
        'name': 'redPacketPosterList'
      },
      'children': [
        {
          'path': '/Social/SocialOperation/RedPacket/Poster/List',
          'name': 'redPacketPosterList',
          'title': '红包封面',
          'component': () => import('@/pages/Guide/RedPacket/Poster/List.vue')
        },
        {
          'path': '/Social/SocialOperation/RedPacket/Poster/Edit',
          'name': 'redPacketPosterEdit',
          'title': '新建红包封面',
          'component': () => import('@/pages/Guide/RedPacket/Poster/Edit.vue')
        }
      ]
    }
    // {
    //   'path': '/Social/SocialOperation/RedPacket/Analysis',
    //   'name': 'redPacketAnalysis',
    //   'title': '',
    //   'component': () => import('@layout/Content.vue'),
    //   'redirect': {
    //     'name': 'redPacketAnalysis'
    //   },
    //   'children': [
    //     {
    //       'path': '/Social/SocialOperation/RedPacket/Analysis',
    //       'name': 'redPacketAnalysis',
    //       'title': '数据概览',
    //       'component': () => import('@/pages/Guide/RedPacket/Analysis/Analysis/index.vue')
    //     },
    //     {
    //       'path': '/Social/SocialOperation/RedPacket/ReceiveRecord',
    //       'name': 'redPacketAnalysis',
    //       'title': '领取记录',
    //       'component': () => import('@/pages/Guide/RedPacket/Analysis/ReceiveRecord/index.vue')
    //     },
    //     {
    //       'path': '/Social/SocialOperation/RedPacket/SendRecord',
    //       'name': 'redPacketAnalysis',
    //       'title': '发放记录',
    //       'component': () => import('@/pages/Guide/RedPacket/Analysis/SendRecord/index.vue')
    //     }
    //   ]
    // }
  ]
}
