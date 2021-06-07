/*
 * @Descripttion: 企业微信-好友会话统计
 * @Author: zhimin.mo
 * @Date: 2021-06-04 15:30:52
 * @LastEditors: zhimin.mo
 * @LastEditTime: 2021-06-04 15:30:52
 */
export default {
  /**
   * @msg: 查询昨天好友会话统计分析数据
   */
  queryAnalysisOverview: {
    url: '/wework/sessionStatistics/queryAnalysisOverview',
    method: 'post'
  },
  /**
   * @msg: 查询好友会话统计分析列表数据
   */
  queryAnalysisListByDate: {
    url: '/wework/sessionStatistics/queryAnalysisListByDate',
    method: 'post'
  },
  /**
   * @msg: 查询好友会话统计分析报表数据
   */
  queryAnalysisListByDateReturnList: {
    url: '/wework/sessionStatistics/queryAnalysisListByDateReturnList',
    method: 'post'
  },
  /**
   * @msg: 查询好友会话统计分析列表数据-成员
   */
  queryAnalysisListByUser: {
    url: '/wework/sessionStatistics/queryAnalysisListByUser',
    method: 'post'
  },
  // 会话统计导出
  export: {
    url: '/wework/sessionStatistics/export',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  }
}
