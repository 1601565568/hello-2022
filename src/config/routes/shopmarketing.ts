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
      'path': '/Guide/Material/Library',
      'name': 'SHOP_MARKETING2',
      'title': '内容运营',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Guide/Material/Library',
          'name': 'Library',
          'title': '素材库',
          'component': () => import('@nascent/ecrp-ecrm/src/layout/ContentOnly.vue'),
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
          'path': '/Guide/Material/MaterialAnalysis/details',
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
