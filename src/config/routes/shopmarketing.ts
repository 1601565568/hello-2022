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
    }
  ]
}
