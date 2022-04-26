/*
 * @Date: 2022-04-22 19:41:32
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-24 15:42:54
 * @FilePath: \ECRP-SG-WEB\src\apis\weWork\sessionCollect.js
 */
export default {
  /**
   * @msg: 会话统计分析数据
   */
  getSessionStatistics: {
    url: '/guide/talk/getSessionStatistics',
    method: 'post'
  },
  /**
   * @msg: 导出会话统计分析数据
   */
  exportSessionStatistics: {
    url: '/guide/talk/exportSessionStatistics',
    method: 'post'
  }
}
