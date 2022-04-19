/*
 * @Date: 2022-04-19 19:24:03
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-19 20:48:24
 * @FilePath: \ECRP-SG-WEB\src\apis\weWork\salesStatistics.js
 */
export default {
  /**
   * @msg: 销售数据统计列表
   */
   statisticsUserList: {
    url: '/wework/sales/statistics/user/list',
    method: 'post'
  },
  queryGuideRoomList: {
    url: '/wework/sales/statistics/room/list',
    method: 'post'
  }
}
