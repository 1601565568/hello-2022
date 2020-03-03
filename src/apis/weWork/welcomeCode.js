/*
 * @Descripttion: 企业微信-智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-02-28 17:30:52
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-03-03 14:54:56
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
   * @msg: 查询智能欢迎语使用渠道列表
   */
  findWelcomeCodeChannelList: {
    url: '/wework/welcomecode/findWelcomeCodeChannelList',
    method: 'post'
  },
  /**
   * @msg: 查询智能欢迎语详情
   */
  getWelcomeCode: {
    url: '/wework/welcomecode/getWelcomeCode',
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
