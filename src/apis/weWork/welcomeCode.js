/*
 * @Descripttion: 企业微信-智能欢迎语
 * @Author: yuye.huang
 * @Date: 2020-02-28 17:30:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-03 13:46:06
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
    method: 'get'
  },
  /**
   * @msg: 查询智能欢迎语使用门店列表
   */
  findWelcomeCodeShopList: {
    url: '/wework/welcomecode/findWelcomeCodeShopList',
    method: 'post'
  },
  /**
   * @msg: 查询渠道列表
   */
  findChannelList: {
    url: '/wework/welcomecode/findChannelList',
    method: 'get'
  },
  /**
   * @msg: 查询智能欢迎语详情
   */
  getWelcomeCode: {
    url: '/wework/welcomecode/getWelcomeCode',
    method: 'get'
  },
  /**
   * @msg: 新增/更新智能欢迎语
   */
  saveOrUpdateWelcomeCode: {
    url: '/wework/welcomecode/saveOrUpdateWelcomeCode',
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
