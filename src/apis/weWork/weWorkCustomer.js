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
  }
}
