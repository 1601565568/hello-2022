export default {
  'path': '/Guide/Material/imageText',
  'name': 'SHOP_MARKETING',
  'componentPath': () => import('@/views/Default'),
  'meta': {
    'title': '门店营销',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Guide/Material/imageText',
      'name': 'SHOP_MARKETING2',
      'title': '素材库',
      'componentPath': () => import('@/views/Content'),
      'children': [{
        'path': '/Guide/Material/imageText',
        'name': 'MATERIAL',
        'title': '图文素材',
        'componentPath': () => import('@/views/Guide/Material/imageText')
      },
      {
        'path': '/Guide/Material/article',
        'name': 'MaterialArticle ',
        'title': '文章素材',
        'componentPath': () => import('@/views/Guide/Material/article')
      },
      {
        'path': '/Guide/Material/subdivision',
        'name': 'MaterialSubdivision',
        'title': '素材分组',
        'componentPath': () => import('@/views/Guide/Material/subdivision')
      }
      ]
    },
    {
      'path': '/Guide/SgCoupon/CouponList',
      'name': 'SHOP_MARKETING3',
      'title': '门店营销',
      'componentPath': () => import('@/views/Content'),
      'children': [
        {
          'path': '/Guide/SgCoupon/CouponList',
          'name': 'KQGL',
          'title': '优惠券发放',
          'componentPath': () => import('@/views/Guide/SgCoupon/CouponList')
        }
      ]
    }
  ]
}
