/*
 * @Descripttion: 企业微信-客户
 * @Author: zhimin.mo
 * @Date: 2020-04-28 15:30:52
 * @LastEditors: zhimin.mo
 * @LastEditTime: 2020-04-28 17:12:39
 */
export default {
  /**
   * @msg: 查询删除客户列表
   */
  queryDeleteCustomerList: {
    url: '/wework/lossCustomer/queryDeleteCustomerList',
    method: 'post'
  },
  /**
   * @msg: 查询删除客户列表
   */
  queryBeDeleteCustomerList: {
    url: '/wework/lossCustomer/queryBeDeleteCustomerList',
    method: 'post'
  },
  /**
   * @msg: 查询重复好友
   */
  getRepeatCustomerList: {
    url: '/wework/repeat/getRepeatCustomerList',
    method: 'post'
  },
  /**
   * @msg: 查询重复导购
   */
  getRepeatGuideList: {
    url: '/wework/repeat/getRepeatGuideList',
    method: 'get'
  },
  /**
   * @msg: 获取客户分析顶部数据
   */
  queryAnalysisOverview: {
    url: '/wework/friendsAnalysis/queryAnalysisOverview',
    method: 'post'
  },
  /**
   * @msg: 获取分析列表-日期
   */
  queryAnalysisListByDate: {
    url: '/wework/friendsAnalysis/queryAnalysisListByDate',
    method: 'post'
  },
  /**
   * @msg: 获取分析列表-日期
   */
  queryAnalysisListByDateReturnList: {
    url: '/wework/friendsAnalysis/queryAnalysisListByDateReturnList',
    method: 'post'
  },
  /**
   * @msg: 获取分析列表-成员
   */
  queryAnalysisListByUser: {
    url: '/wework/friendsAnalysis/queryAnalysisListByUser',
    method: 'post'
  },
  // 会话统计导出
  export: {
    url: '/wework/friendsAnalysis/export',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  //  群流失好友流失
  queryLossFriendsList: {
    url: '/wework/lossFriends/queryLossFriendsList',
    method: 'post'
  },
  // 群流失好友流失导出
  exportLossFriendsList: {
    url: '/wework/lossFriends/exportLossFriendsList',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 群流失提醒设置
  saveOrUpdateTask: {
    url: '/wework/lossFriendsWarnConf/saveOrUpdateTask',
    method: 'post'
  },
  // 群流失提醒设置详情
  findDefaultTask: {
    url: '/wework/lossFriendsWarnConf/findDefaultTask',
    method: 'get'
  }
}
