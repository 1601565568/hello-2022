/*
 * @Descripttion: 个号-智能欢迎语
 * @Author: zhimin.mo
 * @Date: 2020-02-28 17:30:52
 * @LastEditors: zhimin.mo
 * @LastEditTime: 2020-03-03 18:39:01
 */
export default {
  /**
   * @msg: 保存智能欢迎语
   */
  saveOrUpdate: {
    url: '/Guide/AutoReply/saveOrUpdate',
    method: 'post'
  },
  /**
   *  获取智能回复列表
   */
  findList: {
    url: '/Guide/AutoReply/findList',
    method: 'post'
  }
}
