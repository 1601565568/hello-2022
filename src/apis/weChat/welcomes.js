/*
 * @Descripttion: 个号-智能欢迎语
 * @Author: zhimin.mo
 * @Date: 2020-02-28 17:30:52
 * @LastEditors: zhimin.mo
 * @LastEditTime: 2020-03-03 18:39:01
 */
export default {
  /**
   * @msg: 查询智能欢迎语列表
   */
  findList: {
    url: '/wechat/wechatwelcomes/findList',
    method: 'post'
  },
  /**
   * @msg: 保存智能欢迎语
   */
  saveWelcomeCode: {
    url: '/wechat/wechatwelcomes/saveWelcomeCode',
    method: 'post'
  },
  /**
   * @msg: 获取智能欢迎语
   */
  getWelcomeCode: {
    url: '/wechat/wechatwelcomes/getWelcomeCode',
    method: 'post'
  }
}
