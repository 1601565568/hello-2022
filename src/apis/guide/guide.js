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
  getCustomerConfig: {// 查询会员配置项
    url: '/guide/customer/getCustomerConfig',
    method: 'get'
  },
  updateCustomerConfig: {// 更新会员配置项
    url: '/guide/customer/updateCustomerConfig',
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
  },
  guideLeave: { // 批量离职
    url: '/guide/guide/guideLeave',
    method: 'post'
  },
  updateShopId: { // 批量更换门店
    url: '/guide/guide/updateShopId',
    method: 'post'
  },
  findGuideShopList: { // 导购门店详情
    url: '/guide/guide/findGuideShopList',
    method: 'get'
  },
  findGuideShopCustomerSum: { // 更改门店导购的客户数
    url: '/guide/guide/findGuideShopCustomerSum',
    method: 'post'
  },
  findShopGuide: { // 查询店铺导购列表
    url: '/guide/guide/findShopGuide',
    method: 'post'
  },
  findShopListOnCondition: { // 按条件查询店铺
    url: '/core/sgshop/findShopListOnCondition',
    method: 'post'
  },
  getWechatQrcode: { // 获取二维码
    url: 'app/guide/whd/getWechatQrcode',
    method: 'post'
  },
  // 刷新小程序信息(包括token信息)
  refreshAuthedAppletInfo: {
    url: '/guide/wechatsetting/refreshAuthedAppletInfo',
    method: 'get'
  },
  // 查询登录日志列表
  loginLogFindList: {
    url: '/core/findLoginList',
    method: 'post'
  },
  // 查询列表
  operationlogFindList: {
    url: '/guide/operationlog/findList',
    method: 'post'
  },
  // 查询详情
  operationlogGetDetail: {
    url: '/guide/operationlog/getDetail',
    method: 'get'
  },
  // 门店管理同步门店
  shopSyn: {
    url: '/core/sgshop/shopSyn',
    method: 'get'
  },
  // 新增员工展示全部接口
  getGuideList: {
    url: '/guide/guide/getGuideList',
    method: 'get'
  },
  // 加解密工具接口
  encryptionAndDecryption: {
    url: '/guide/helptool/encryptionAndDecryption',
    method: 'get'
  },
  // 根据导购ids查询客户数
  findGuideCustomerSum: {
    url: '/guide/guide/findGuideCustomerSum',
    method: 'post'
  },
  // 门店招募二维码下载和小程序二维码下载
  getShopRecruitmentQrcode: {
    url: '/guide/ehd/getShopRecruitmentQrcode',
    method: 'get'
  },
  // 修改权重或者透出次数
  updateMoreAccount: {
    url: '/guide/sgmoreaccount/updateMoreAccount',
    method: 'post'
  }
}
