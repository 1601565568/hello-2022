/*
 * @Descripttion: 企业微信-智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-02-28 17:30:52
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-01 21:43:27
 */
export default {
  /**
   * @msg: 查询智能欢迎语列表
   */
  findList: {
    url: '/wework/welcomecode/findList',
    method: 'post'
  },
  /**
   * @msg: 查询智能欢迎语使用员工列表
   */
  findWelcomeCodeEmployeeList: {
    url: '/wework/welcomecode/findWelcomeCodeEmployeeList',
    method: 'post'
  },
  /**
   * @msg: 新增智能欢迎语
   */
  saveWelcomeCode: {
    url: '/wework/welcomecode/saveWelcomeCode',
    method: 'post'
  },
  /**
   * @msg: 删除智能欢迎语
   */
  deleteWelcomeCode: {
    url: '/wework/welcomecode/deleteWelcomeCode',
    method: 'post'
  }
}
