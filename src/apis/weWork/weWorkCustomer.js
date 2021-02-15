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
    url: '/weWork/lossCustomer/queryDeleteCustomerList',
    method: 'post'
  },
  /**
   * @msg: 查询删除客户列表
   */
  queryBeDeleteCustomerList: {
    url: '/weWork/lossCustomer/queryBeDeleteCustomerList',
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
    url: '/weWork/friendsAnalysis/queryAnalysisOverview',
    method: 'post'
  },
  /**
   * @msg: 获取分析列表-日期
   */
  queryAnalysisListByDate: {
    url: '/weWork/friendsAnalysis/queryAnalysisListByDate',
    method: 'post'
  },
  /**
   * @msg: 获取分析列表-日期
   */
  queryAnalysisListByDateReturnList: {
    url: '/weWork/friendsAnalysis/queryAnalysisListByDateReturnList',
    method: 'post'
  },
  /**
   * @msg: 获取分析列表-成员
   */
  queryAnalysisListByUser: {
    url: '/weWork/friendsAnalysis/queryAnalysisListByUser',
    method: 'post'
  }
}
