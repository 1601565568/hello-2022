/*
 * @Descripttion: 企微方案 - 员工相关接口
 * @Author: yuye.huang
 * @Date: 2020-05-18 16:09:44
 * @LastEditors: yuye.huang
 * @LastEditTime: 2020-05-18 16:19:02
 */
export default {
  /**
   * @msg: 查询企微员工列表
   */
  findGuideList: {
    url: '/wework/guide/findGuideList',
    method: 'post'
  },
  queryGuideList: {
    url: '/wework/repeat/findGuideList',
    method: 'post'
  }
}
