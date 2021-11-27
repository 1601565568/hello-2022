import guide from './guide'
import shop from './shop'
import material from './materials'
import materialSubdivision from './materialsubdivision'
import activityCoupon from './activityCoupon'
import assets from './assets'
import goods from './goods'
import sgwxaccount from './sgwxaccount'
import marketing from './marketing'
import task from './task'
import moreAccount from './moreAccount'
import quicklyword from './quicklyword'
import groupData from './groupData'
import wxPrivateAccount from './wxPrivateAccount'
import sensitivePermission from './sensitivePermission'
import sensitiveWord from './sensitiveWord'
import wxDeviceGuideRelation from './wxDeviceGuideRelation'
import friendData from './friendData'
import wxChat from './wxChat'
import myMoments from './myMoments'
import friendMoments from './friendMoments'
import wxGroup from './wxGroup'
import guideDevice from './guideDevice'
import group from './group'
import autoPass from './autoPass'
import secruitmentSet from './secruitmentSet'
import notMemberSet from './notMemberSet'
import sgPersonalQrcode from './sgPersonalQrcode'
import recruitPageConfig from './recruitPageConfig'
import systemPreset from './SystemPreset'
import sgGuideActivityAnalysis from './sgGuideActivityAnalysis'
import chatRoomConfig from './chatRoomConfig'
import customerCode from './customerCode'
import materialAnalysis from './materialAnalysis'
import operationConfig from './operationConfig'
import customerService from './customerService'
import momentList from './momentList'
import custom from './custom'
import channel from './channel'
import qrcodePoster from './qrcodePoster'
import lbs from './lbs'
import redpacket from './redpacket'
import pay from './pay'
export default {
  secruitmentSet,
  guide,
  shop,
  material,
  materialSubdivision,
  activityCoupon,
  assets,
  goods,
  sgwxaccount,
  marketing,
  task,
  friendData,
  moreAccount,
  quicklyword,
  groupData,
  wxPrivateAccount,
  sensitivePermission,
  sensitiveWord,
  wxDeviceGuideRelation,
  wxChat,
  myMoments,
  friendMoments,
  wxGroup,
  guideDevice,
  group,
  autoPass,
  sgPersonalQrcode,
  recruitPageConfig,
  systemPreset,
  sgGuideActivityAnalysis,
  chatRoomConfig,
  customerCode,
  materialAnalysis,
  notMemberSet,
  operationConfig,
  customerService,
  momentList,
  custom,
  channel,
  qrcodePoster,
  lbs,
  redpacket,
  pay,
  // 所有导购模块全部整合在此
  comGetBrandForShopList: {
    // 获取品牌下的店铺
    url: '/core/sgshop/getBrandList',
    method: 'get'
  },

  /**
   * 素材纬度:获取素材未完成统计明细
   */
  getNoCompleteStatisticsDetailByMaterial: {
    // 素材列表
    url: '/guide/material/statistics/getNoCompleteStatisticsDetailByMaterial',
    method: 'post'
  },
  /**
   * 素材纬度:获取素材未完成统计明细
   */
  exportExcelByNoCompleteByMaterial: {
    // 素材列表
    url: '/guide/material/statistics/exportExcelByNoCompleteByMaterial',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  /**
   * 素材纬度:获取素材未完成统计列表
   */
  exportExcelByNoComplete: {
    // 素材列表
    url: '/guide/material/statistics/exportExcelByNoComplete',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },

  /**
   * 素材纬度:获取素材未完成统计列表
   */
  getNoCompleteStatisticsByMaterial: {
    // 素材列表
    url: '/guide/material/statistics/getNoCompleteStatisticsByMaterial',
    method: 'post'
  },

  /**
   * 获取日期完成明细
   */
  getStatisticsDetailByDate: {
    // 素材列表
    url: '/guide/material/statistics/getStatisticsDetailByDate',
    method: 'post'
  },

  /**
   * 获取日期完成明细
   */
  getOperateStatisticsDetailByDate: {
    // 素材列表
    url: '/guide/material/statistics/getOperateStatisticsDetailByDate',
    method: 'post'
  },

  /**
   * 获取员工完成明细
   */
  getOperateStatisticsDetailsByGuideId: {
    // 素材列表
    url: '/guide/material/statistics/getOperateStatisticsDetailsByGuideId',
    method: 'post'
  },

  /**
   * 素材纬度:获取完成明细
   */
  getStatisticsDetailByMaterial: {
    // 素材列表
    url: '/guide/material/statistics/getStatisticsDetailByMaterial',
    method: 'post'
  },

  /**
   * 素材纬度:获取完成明细
   */
  getOperateStatisticsDetailByMaterial: {
    // 素材列表
    url: '/guide/material/statistics/getOperateStatisticsDetailByMaterial',
    method: 'post'
  },

  /**
   * 完成统计:EXCEL导出
   */
  exportExcelByComplete: {
    // 素材列表
    url: '/guide/material/statistics/exportExcelByComplete',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },

  /**
   * 完成统计:EXCEL导出
   */
  exportOperateExcelByComplete: {
    // 素材列表
    url: '/guide/material/statistics/exportOperateExcelByComplete',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },

  /**
   * 数据统计图表数据
   */
  getChartData: {
    // 素材列表
    url: '/guide/material/statistics/getChartData',
    method: 'post'
  },

  /**
   * 以素材为纬度,获取统计报表
   */
  getStatisticsListByMaterial: {
    // 素材列表
    url: '/guide/material/statistics/getStatisticsListByMaterial',
    method: 'post'
  },
  /**
   * 以员工为纬度,获取统计报表
   */
  getOperateStatisticsListByGuideId: {
    // 素材列表
    url: '/guide/material/statistics/getOperateStatisticsListByGuideId',
    method: 'post'
  },
  /**
   * 以素材为纬度,获取统计报表
   */
  getOperateStatisticsListByMaterial: {
    // 素材列表
    url: '/guide/material/statistics/getOperateStatisticsListByMaterial',
    method: 'post'
  },

  /**
   * 以日期为纬度,获取统计报表
   */
  getStatisticsListByDate: {
    // 素材列表
    url: '/guide/material/statistics/getStatisticsListByDate',
    method: 'post'
  },

  /**
   * 以日期为纬度,获取统计报表
   */
  getOperateStatisticsListByDate: {
    // 素材列表
    url: '/guide/material/statistics/getOperateStatisticsListByDate',
    method: 'post'
  },

  /**
   * 数据统计总数
   */
  getSumData: {
    // 素材列表
    url: '/guide/material/statistics/getSumData',
    method: 'post'
  },
  /**
   * 素材相关接口
   */
  findMaterialListByShare: {
    // 素材分享
    url: '/guide/material/findMaterialList',
    method: 'post'
  },
  materialList: {
    // 素材列表
    url: '/guide/material/findMaterialList',
    method: 'post'
  },
  customImage: {
    // 素材编辑
    url: '/core/sgfile/uploadFile/message',
    method: 'post'
  },
  findWxAppletsList: {
    // 素材编辑
    url: '/setting/sys/findWxAppletsList',
    method: 'get'
  },
  materialEdit: {
    // 素材编辑
    url: '/guide/material/saveMaterial',
    method: 'post'
  },
  queryCompanyPlan: {
    url: '/guide/material/queryCompanyPlan',
    method: 'get'
  },
  queryMaterial: {
    // 素材详情
    url: '/guide/material/queryMaterial',
    method: 'get'
  },
  materialDel: {
    // 素材删除
    url: '/guide/material/delete',
    method: 'post'
  },
  materialFindListByBrandId: {
    // 素材列表--简洁版
    url: '/guide/material/findListByBrandId',
    method: 'post'
  },
  materialSetGroud: {
    // 素材设置标签
    url: '/guide/material/setSubdivision',
    method: 'post'
  },
  updateCurrentStatus: {
    // 素材设置状态
    url: '/guide/material/updateCurrentStatus',
    method: 'post'
  },
  findDirectoryList: {
    // 查询文件夹列表
    url: '/guide/material/findDirectoryList',
    method: 'post'
  },
  getDirectoryTree: {
    // 查询文件夹树
    url: '/guide/material/getDirectoryTree',
    method: 'post'
  },
  batchDeleteMaterial: {
    // 批量删除素材或文件夹
    url: '/guide/material/batchDeleteMaterial',
    method: 'post'
  },
  batchMoveMaterial: {
    // 批量移动素材或文件夹
    url: '/guide/material/batchMoveMaterial',
    method: 'post'
  },
  getParentPath: {
    // 获取文件夹路径
    url: 'guide/material/getParentPath',
    method: 'get'
  },
  findScriptCompletionDetailList: {
    // 指定导购补充素材明细
    url: 'guide/material/findScriptCompletionDetailList',
    method: 'post'
  },
  exportMaterialCompletionByExcel: {
    // 导出剧本素材自创明细EXCEL
    url: 'guide/material/exportMaterialCompletionByExcel',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  delScriptCompletionDetailByGuideId: {
    // 指定导购补充素材明细
    url: 'guide/material/delScriptCompletionDetailByGuideId',
    method: 'post'
  },
  getScriptCompletionNumber: {
    // 获取剧本员工完成/未完成总数
    url: 'guide/material/getScriptCompletionNumber',
    method: 'post'
  },
  findScriptCompletionDetailByGuideId: {
    // 指定导购补充素材明细
    url: 'guide/material/findScriptCompletionDetailByGuideId',
    method: 'post'
  },
  /**
   * 素材标签
   */
  materialExchangeSort: {
    // 素材标签排序
    url: '/guide/material/exchangeSort',
    method: 'post'
  },
  materialGroudList: {
    // 素材标签列表
    url: '/guide/material/findSubdivisionList',
    method: 'post'
  },
  materialGroudDeit: {
    // 素材标签编辑
    url: '/guide/material/saveOrUpdateSubdivision',
    method: 'post'
  },
  materialGroudDel: {
    // 素材标签删除
    url: '/guide/material/deleteSubdivision',
    method: 'post'
  },
  materialGroudListAll: {
    // 所有素材标签
    url: '/guide/material/findSubdivisionAll',
    method: 'post'
  },
  /**
   * 素材文件夹
   */
  saveOrUpdateDirectory: {
    // 保存或更新文件夹
    url: '/guide/material/saveOrUpdateDirectory',
    method: 'post'
  },
  // 任务模块开始
  taskList: {
    // 查询品牌任务列表
    url: '/guide/task/findList',
    method: 'post'
  },
  queryProgressStatistics: {
    // 查询任务进度统计
    url: '/guide/task/queryProgressStatistics',
    method: 'post'
  },
  // 获取品牌任务详情
  queryTask: {
    // 查询品牌任务列表
    url: '/guide/task/queryTask',
    method: 'post'
  },
  // 获取任务详情
  queryShopTask: {
    // 查询品牌任务列表
    url: '/guide/task/queryShopTask',
    method: 'post'
  },
  // 查询任务店铺详情列表
  queryShopTaskDetail: {
    // 查询品牌任务列表
    url: '/guide/task/queryShopTaskDetail',
    method: 'post'
  },
  taskEdit: {
    // 品牌任务编辑
    url: '/guide/task/saveOrUpdateTask',
    method: 'post'
  },
  queryArea: {
    // 查询登录账号数据权限区域
    url: '/guide/task/queryView',
    method: 'post'
  },
  querySubgroup: {
    // 根据视角信息获取分组列表
    url: '/guide/task/querySubgroup',
    method: 'post'
  },
  querySubgroupMsg: {
    // 根据视角信息获取分组列表
    url: '/guide/task/querySubgroupMsg',
    method: 'post'
  },
  queryDetailSubgroupMsg: {
    // 根据视角信息和时间获取分组列表
    url: '/guide/task/queryDetailSubgroupMsg',
    method: 'post'
  },
  importFileAndManual: {
    // 上传外部店铺编码 和 EXCEL文件
    url: '/guide/task/importFileAndManual',
    method: 'post'
  },
  taskQueryTaskShopInfo: {
    // 品牌任务--指派门店详情
    url: '/guide/task/queryTaskShopInfo',
    method: 'post'
  },
  taskBrandDel: {
    // 品牌任务--删除
    url: '/guide/task/deleteTask',
    method: 'get'
  },
  taskUpdateState: {
    // 修改任务状态
    url: '/guide/task/updateTaskState',
    method: 'post'
  },
  taskShopList: {
    // 门店任务列表
    url: '/guide/task/findShopList',
    method: 'post'
  },
  taskQueryShopGuideList: {
    // 门店任务详情
    url: '/guide/task/queryShopGuideList',
    method: 'post'
  },
  queryShopTaskExecution: {
    // 门店任务详情新
    url: '/guide/task/queryShopTaskExecution',
    method: 'post'
  },
  // 快捷话术分组列表
  findQuicklyWordGroupList: {
    url: '/guide/quicklyword/findQuicklyWordGroupList',
    method: 'post'
  },
  // 快捷话术添加人列表
  getAddNameList: {
    url: '/guide/quicklyword/getAddNameList',
    method: 'post'
  },
  // 快捷话术列表查询
  findQuicklyWordList: {
    url: '/guide/quicklyword/findQuicklyWordList',
    method: 'post'
  },
  // 快捷话术新增编辑
  saveOrUpdateQuicklyWord: {
    url: '/guide/quicklyword/saveOrUpdateQuicklyWord',
    method: 'post'
  },
  // 查找快捷话术当前用户名
  findAddName: {
    url: '/guide/quicklyword/findAddName',
    method: 'post'
  },
  // 快捷话术删除
  deleteQuicklyWord: {
    url: '/guide/quicklyword/deleteQuicklyWord',
    method: 'post'
  },
  // 快捷话术排序
  updateQuicklyWordSort: {
    url: '/guide/quicklyword/updateQuicklyWordSort',
    method: 'post'
  },
  // 快捷话术分组新增编辑
  saveOrUpdateQuicklyWordGroup: {
    url: '/guide/quicklyword/saveOrUpdateQuicklyWordGroup',
    method: 'post'
  },
  // 快捷话术分组删除
  deleteQuicklyWordGroup: {
    url: '/guide/quicklyword/deleteQuicklyWordGroup',
    method: 'post'
  },
  // 快捷话术分组排序
  updateQuicklyWordGroupSort: {
    url: '/guide/quicklyword/updateQuicklyWordGroupSort',
    method: 'post'
  },
  // 快捷话术批量编辑
  patchChange: {
    url: '/guide/quicklyword/patchChang',
    method: 'post'
  },
  // 拖拽修改快捷话术分组顺序
  changeQuicklyWordGroupSort: {
    url: '/guide/quicklyword/changeQuicklyWordGroupSort',
    method: 'post'
  },
  // 删除渠道
  chanelDel: {
    // 素材删除
    url: '/guide/material/delete',
    method: 'post'
  },
  // 渠道列表
  chanelList: {
    // 素材列表
    url: '/guide/material/findMaterialList',
    method: 'post'
  },
  // 三方是否授权
  getAppIdletInfo: {
    url: '/guide/sgwxaccount/getAppIdletInfo',
    method: 'get'
  }
}
