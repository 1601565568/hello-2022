export default {
  findList: { // 导购列表查询
    url: '/guide/guide/findList',
    method: 'post'
  },
  saveOrUpdateGuide: { // 新增或者修改导购信息
    url: '/guide/guide/saveOrUpdateGuide',
    method: 'post'
  },
  queryGuideShopList: { // 查询店铺列表
    url: '/guide/guide/queryGuideShopList',
    method: 'post'
  },
  shopChange: { // 多店铺时修改店铺
    url: '/guide/guide/shopChange',
    method: 'post'
  },
  updateGuideCustomer: { // 导购离职接口
    url: '/guide/guide/updateGuideCustomer',
    method: 'post'
  },
  findCustomerList: { // 根据导购id查询对应的所有的客户
    url: '/guide/guide/findCustomerList',
    method: 'post'
  },
  getCustomerCount: { // 根据导购id查询对应的所有的客户数量
    url: '/guide/guide/getCustomerCount',
    method: 'post'
  },
  findTransRecordList: { // 客户转移记录列表
    url: '/guide/guide/findTransRecordList',
    method: 'post'
  },
  findCustomerTransRecordList: { // 客户转移记录详情
    url: '/guide/guide/findCustomerTransRecordList',
    method: 'post'
  },
  checkGuideWorkId: {
    url: '/guide/guide/checkGuideWorkId',
    method: 'post'
  },
  uploadImg: { // 上传图片
    url: '/core/file/upload/guide',
    method: 'post'
  },
  shopIndexList: {// 门店指标列表分页查询
    url: '/guide/quotayear/findList',
    method: 'post'
  },
  shopIndexSave: {// 门店指标保存
    url: '/guide/quotayear/save',
    method: 'post'
  },
  shopPerfList: {// 门店工作统计列表分页查询
    url: '/guide/shopperf/findList',
    method: 'post'
  },
  guideperfList: {// 导购工作统计列表分页查询
    url: '/guide/guideperf/findList',
    method: 'post'
  },
  guidePerfDetailList: {// 导购工作统计列表分页查询
    url: '/guide/guideperf/findDetailList',
    method: 'post'
  },
  rewardruleList: {// 门店提成列表分页查询
    url: '/guide/rewardrule/findList',
    method: 'post'
  },
  rewardruleSave: {// 门店提成保存
    url: '/guide/rewardrule/save',
    method: 'post'
  },
  updateGuideStatus: {// 更改导购启用状态
    url: '/guide/guide/updateGuideStatus',
    method: 'get'
  },
  deleteGuides: {// 单个、批量删除导购
    url: '/guide/guide/deleteGuides',
    method: 'post'
  },
  customerFindCustomerList: {// 导购客户管理列表查询
    url: '/guide/customer/findCustomerList',
    method: 'post'
  },
  updateCustomerGuide: {// 导购客户管理更换导购
    url: '/guide/customer/updateCustomerGuide',
    method: 'post'
  },
  customerGetGuideTree: {// 查询店铺导购树
    url: '/guide/guide/getGuideTree',
    method: 'post'
  },
  customerGetDetail: {// 客户详情
    url: '/guide/customer/getDetail',
    method: 'post'
  },
  customerQueryValidPoint: {// 查询会员可用积分
    url: '/guide/customer/queryValidPoint',
    method: 'get'
  },
  queryCustomerCouponNum: {// 查询客户可用优惠券数量
    url: '/guide/customer/queryCustomerCouponNum',
    method: 'get'
  },
  findGuideNewWorkNumAndPrefix: {
    url: '/guide/guide/findGuideNewWorkNumAndPrefix',
    method: 'get'
  },
  taskDeleteTask: {
    url: '/guide/task/deleteTask',
    method: 'get'
  }
}
