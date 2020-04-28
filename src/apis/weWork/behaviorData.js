/*
 * @Descripttion: 企业微信-导购行为数据统计
 * @Author: zhimin.mo
 * @Date: 2020-04-28 15:30:52
 * @LastEditors: zhimin.mo
 * @LastEditTime: 2020-04-28 17:12:39
 */
export default {
  /**
   * @msg: 获取导购行为图表数据
   */
  getBehaviorCount: {
    url: '/wework/guidebehaviorcount/getBehaviorCount',
    method: 'post'
  },
  /**
   * @msg: 获取导购行为图表数据
   */
  findList: {
    url: '/wework/guidebehaviorcount/findList',
    method: 'post'
  }
}
