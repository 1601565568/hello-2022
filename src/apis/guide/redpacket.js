import { API_ROOT } from '@/config/http.js'
const prefix = '/redpack/'
export default {
  // 获取红包封面
  getCoverList: {
    url: prefix + 'cover/list',
    method: 'post'
  },
  // 新增红包封面
  createCover: {
    url: prefix + 'cover/create',
    method: 'post'
  },
  // 获取红包封面详情
  getCoverDetail (id) {
    return {
      url: prefix + 'cover/' + id,
      method: 'GET'
    }
  },
  // 更新红包封面
  setCover (id) {
    return {
      url: prefix + 'cover/updateById/' + id,
      method: 'POST'
    }
  },
  // 删除红包封面
  deleteCover (id) {
    return {
      url: prefix + 'cover/deleteById/' + id,
      method: 'POST'
    }
  },
  // 设置默认封面
  setDefault (id) {
    return {
      url: prefix + `cover/${id}/setDefault`,
      method: 'POST'
    }
  },
  // 茶轩员工或店铺列表
  getShopOrGuideList: {
    url: prefix + `send/setting/shopOrGuideList`,
    method: 'POST'
  },
  // 获取红包策略列表
  getStrategiesList: {
    url: prefix + 'policy/list',
    method: 'post'
  },
  // 添加红包策略
  createStrategies: {
    url: prefix + 'policy/saveOrUpdate',
    method: 'post'
  },
  // 修改红包状态
  changeStrategiesState: {
    url: prefix + 'policy/updateState',
    method: 'post'
  },
  // 获取🐒包策略
  getStrategies: {
    url: prefix + 'policy/queryById',
    method: 'get'
  },
  // 添加发红包
  createSend: {
    url: prefix + 'send/setting/saveOrUpdate',
    method: 'post'
  },
  // 发红包列表
  getSendList: {
    url: prefix + 'send/setting/list',
    method: 'post'
  },
  // 设置发红包状态
  updateSendState: {
    url: prefix + 'send/setting/updateState',
    method: 'post'
  },
  // 红包领取记录列表
  getReceiverList: {
    url: prefix + 'record/receiver/list',
    method: 'post'
  },
  // 红包发放记录列表
  getRecordList: {
    url: prefix + 'record/list',
    method: 'post'
  },
  // 红包发放记录>发放统计
  getSendStatistics: {
    url: prefix + 'record/sendStatistics',
    method: 'post'
  },
  // 出入帐统计
  getDataAnalysisList: {
    url: prefix + 'dataAnalysis/list',
    method: 'post'
  },
  // 员工纬度出入帐统计
  getDataAnalysisListByGuideId: {
    url: prefix + 'dataAnalysis/listByGuideId',
    method: 'post'
  },
  // 数据分析列表
  getRecordStatistics: {
    url: prefix + 'dataAnalysis/recordStatistics',
    method: 'post'
  },
  // 红包发放记录>领取详情
  getRecordDetail: {
    url: prefix + 'record/receiveDetail',
    method: 'post'
  },
  // // 红包发放记录列表导出
  // exportRecordList: {
  //   url: prefix + 'record/export',
  //   method: 'post'
  // },
  // // 红包领取记录列表导出
  // exportReceiverList: {
  //   url: prefix + 'record/receiver/export',
  //   method: 'post'
  // },
  // // 数据分析列表导出
  // exportDataAnalysisList: {
  //   url: prefix + 'dataAnalysis/export',
  //   method: 'post'
  // },
  // 导出
  exportRecordList: `${API_ROOT}${prefix}record/export`, // 群门店
  exportReceiverList: `${API_ROOT}${prefix}record/receiver/export`, // 群成员
  exportDataAnalysisList: `${API_ROOT}${prefix}dataAnalysis/export` // 好友门店
}
