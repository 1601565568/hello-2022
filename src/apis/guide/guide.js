export default {
  findList: { // 导购列表查询
    url: '/guide/guide/findList',
    method: 'post'
  },
  findGuideDetail: { // 导购列表查询
    url: '/guide/guide/findGuideDetail',
    method: 'get'
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
    url: '/guide/customertransferlog/findList',
    method: 'post'
  },
  findCustomerTransferLogDetailList: { // 客户转移明细
    url: '/guide/customertransferlog/findCustomerTransferLogDetailList',
    method: 'post'
  },
  exportTaskDetailList: {
    // 素材列表
    url: '/guide/customertransferlog/exportTaskDetailList',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  findCustomerTransRecordList: { // 客户转移记录详情
    url: '/guide/customertransferlog/findCustomerTransferLogDetailList',
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
  downloadtemplate: {// 通用下载模板
    url: '/guide/importquota/downloadtemplate',
    method: 'get'
  },
  updateList: {
    url: '/guide/importquota/updateList',
    method: 'post'
  },
  importQuickExcel: {// 快捷话术 导入Excel数据接口
    url: '/guide/quicklyword/importQuickExcel',
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
  findCustomerTotal: {// 导购客户管理列表门店的导购总数
    url: '/guide/customer/findCustomerTotal',
    method: 'get'
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
  getShopAndGuideTree: {// 查询店铺导购树 区域搜索、状态等
    url: 'guide/guide/getShopAndGuideTree',
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
  queryCustomerIntegral: { // 查询会员积分日志 20190924 add
    url: '/guide/customer/getIntegralList',
    method: 'post'
  },
  queryCustomerRfmInfo: { // 查询会员Rfm信息 20190924 add
    url: '/guide/customer/getRfmInfo',
    method: 'post'
  },
  queryCustomerGradeInfo: { // 查询会员等级信息 20191004 add
    url: '/guide/customer/getGradeInfo',
    method: 'post'
  },
  queryCustomerCouponNum: {// 查询客户可用优惠券数量
    url: '/guide/customer/queryCustomerCouponNum',
    method: 'get'
  },
  queryAllTag: {// 查询店铺启动标签接口
    url: '/guide/customer/getAllTag',
    method: 'post'
  },
  queryCustomerTag: {// 查询会员已有标签接口
    url: '/guide/customer/getCustomerTag',
    method: 'post'
  },
  saveTag: {// 更新会员属性
    url: '/guide/customer/saveTag',
    method: 'post'
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
  findBrandListOnCondition: { // 按条件查询店铺改版
    url: '/core/sgshop/findBrandListOnCondition',
    method: 'post'
  },
  findShopInfoByIds: { // 按门店Ids查询店铺
    url: '/core/sgshop/findShopInfoByIds',
    method: 'post'
  },
  getWechatQrcode: { // 获取二维码
    url: 'app/guide/whd/getWechatQrcode',
    method: 'post'
  },
  // 查询登录日志列表
  loginLogFindList: {
    url: '/core/findLoginList',
    method: 'post'
  },
  // 查询登录日志是否符合导出标准
  findExcelLoginIsOk: {
    url: '/core/findExcelLoginIsOk',
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
  },
  // 上传员工导入文件
  uploadGuideImportFile: {
    url: '/guide/guide/uploadGuideImportFile',
    method: 'post'
  },
  // 查询手工输入内容类型列表
  findManualInputTypeList: {
    url: '/guide/guide/findManualInputTypeList',
    method: 'get'
  },
  // 导入员工查询-手工输入+文件导入
  importGuideQuery: {
    url: '/guide/guide/importGuideQuery',
    method: 'post'
  }
}
