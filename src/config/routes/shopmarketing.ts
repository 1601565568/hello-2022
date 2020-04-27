export default {
  'path': '/Guide/Material/imageText',
  'name': 'SHOP_MARKETING',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '门店运营',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Material/imageText',
      'name': 'SHOP_MARKETING2',
      'title': '素材库',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [{
        'path': '/Guide/Material/imageText',
        'name': 'MATERIAL',
        'title': '图文素材',
        'component': () => import('@/pages/Guide/Material/imageText.vue')
      },
      {
        'path': '/Guide/Material/article',
        'name': 'MaterialArticle ',
        'title': '文章素材',
        'component': () => import('@/pages/Guide/Material/article.vue')
      },
      {
        'path': '/Guide/Material/subdivision',
        'name': 'MaterialSubdivision',
        'title': '素材分组',
        'component': () => import('@/pages/Guide/Material/subdivision.vue')
      }]
    },
    {
      'path': '/Guide/SgCoupon/CouponList',
      'name': 'SHOP_MARKETING3',
      'title': '门店营销',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
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
      'path': '/Guide/SgCoupon/CouponList',
      'name': 'SHOP_MARKETING4',
      'title': '社交运营',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
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
        },
        {
          'path': '/Guide/SgPersonalQrcode/List',
          'name': 'AutoPass',
          'title': '聚合二维码',
          'component': () => import('@/pages/Guide/SgPersonalQrcode/List.vue')
        },
        {
          'path': '/Guide/SgPersonalQrcode/List/Edit/:id',
          'name': 'AutoPass',
          'title': '聚合二维码',
          'component': () => import('@/pages/Guide/SgPersonalQrcode/Edit.vue')
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
          'component': () => import('@/pages/WeWork/WelcomeCode/List.vue')
        },
        {
          'path': '/WeWork/WelcomeCode/Edit',
          'name': 'WelcomeCodeEdit',
          'title': '编辑智能欢迎语(企微)',
          'component': () => import('@/pages/WeWork/WelcomeCode/Edit.vue')
        },
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
    }
  ]
}
