import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryAreaAll: {
    url: '/core/common/queryAreaTree4Component',
    method: 'get',
    callback: function (res, resolve, reject) {
      resolve(res.data.result[0].children)
    }
  },
  querySmsPlaceholder: {
    url: '/core/common/querySmsPlaceholderList',
    method: 'get'
  },
  queryBrandOptions: {
    url: '/core/common/queryBrandOptions',
    method: 'get'
  },
  queryProvince: {
    url: '/core/common/queryProvince',
    method: 'get'
  },
  loadSubdivisionTree: {
    url: '/core/common/loadSubdivisionTree',
    method: 'get'
  },
  getKdCouponOptionsMapByShop: {
    url: '/core/common/getKdCouponOptionsMapByShop',
    method: 'get'
  },
  getMarketingTemplateById: {
    url: '/marketing/activitiesdesign/getMarketingTemplateById',
    method: 'get'
  },
  getPointActivityOptions: {
    url: '/core/common/getPointActivityOptions',
    method: 'get'
  },
  getWxAccountOptions: {
    url: '/core/common/getWxAccountOptions',
    method: 'get'
  },
  querySubdivisionCustomerNum: {
    url: '/core/common/querySubdivisionCustomerNum',
    method: 'get'
  },
  getTopCouponOptions: {
    url: '/core/common/getTopCouponOptions',
    method: 'get'
  },
  getUmpActivitiesOptionsMapByShop: {
    url: '/core/common/getUmpActivitiesOptionsMapByShop',
    method: 'get'
  },
  createShortLink: {
    url: '/marketing/activitiesdesign/createShortLink',
    method: 'get'
  },
  // 交易状态
  getTradeStatus: {
    url: '/core/common/getTradeStatus',
    method: 'get'
  },
  getTradeType: {
    url: '/core/common/getTradeType',
    method: 'get'
  },
  // 交易来源
  getTradeFrom: {
    url: '/core/common/getTradeFrom',
    method: 'get'
  },
  // 等级数据
  getGradeOptions: {
    url: '/core/common/getGradeOptions',
    method: 'get'
  },
  // 地区树
  queryAreaTree4Component: {
    url: '/core/common/queryAreaTree4Component',
    method: 'get'
  },
  // 查询商品表格
  queryGoodsTable4Component: {
    url: '/core/common/queryGoodsTable4Component',
    method: 'post'
  },
  // 平台
  queryPlatForm: {
    url: '/core/common/queryPlatForm',
    method: 'get'
  },
  // 获取关怀类型
  queryCareType: {
    url: '/core/common/getCareTypes',
    method: 'get'
  },
  // 分组树
  querySubdivisionTree: {
    url: '/core/common/loadSubdivisionTree',
    method: 'get'
  },
  // 雁书短信占位符信息
  getYsSmsSplitInfo: {
    url: '/core/common/getYsSmsSplitInfo',
    method: 'get'
  },
  // 雁书账号信息
  getYsAccountInfo: {
    url: '/core/common/getYsAccountInfo',
    method: 'get'
  },
  queryNoDistrictAreaTree: {
    url: '/core/common/queryNoDistrictAreaTree',
    method: 'get'
  },
  // 查询淘宝店铺商品表格
  queryTableByTopItem: {
    url: '/core/common/queryTableByTopItem',
    method: 'post'
  },
  // 查询淘宝店铺商品表格
  getTopItemCategoryList: {
    url: '/core/common/getTopItemCategoryList',
    method: 'get'
  },
  // 创建导出任务
  createExportTask: {
    url: '/core/common/createExportTask',
    method: 'post'
  },
  queryShopListForTopByBrand: {
    url: '/core/common/getTopShop4Options',
    method: 'post'
  },
  getShopByIds: {
    url: '/core/common/getShopByIds',
    method: 'get',
    transformRequest: transData
  },
  // 获取淘宝店铺信息
  getTopShopData4Options: {
    url: '/core/common/getTopShop4Options',
    method: 'get'
  },
  // 查询店铺分页表格数据
  queryShopTable4Component: {
    url: '/core/common/getShopTable4Component',
    method: 'post'
  },
  getRecruitVersion: {
    url: '/core/common/getRecruitVersion',
    method: 'post'
  },
  // 查询登录账号的商城列表
  findLoginMallList: {
    url: '/core/common/findLoginMallList',
    method: 'get'
  },
  // 查询客服精灵地址
  findCustomerServiceUrl: {
    url: '/core/common/findCustomerServiceUrl',
    method: 'get'
  },
  // 查询登陆账号
  getLoginAccount: {
    url: '/core/common/getLoginAccount',
    method: 'get'
  },
  getDecryptData: {
    url: '/core/common/getDecryptData',
    method: 'get'
  },
  queryEmployeeList4Component: {
    url: '/core/common/queryEmployeeList4Component',
    method: 'post'
  },
  findViewListByAreaId: { // 区域模式下根据区域id查询该区域下体系列表
    url: '/core/common/findViewListByAreaId',
    method: 'get'
  }
}
