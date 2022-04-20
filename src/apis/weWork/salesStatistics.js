/*
 * @Date: 2022-04-19 19:24:03
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-20 15:32:50
 * @FilePath: \ECRP-SG-WEB\src\apis\weWork\salesStatistics.js
 */
export default {
  /**
   * @msg: 销售数据统计企微成员列表
   */
  statisticsUserList: {
    url: '/wework/sales/statistics/user/list',
    method: 'post'
  },
  /**
   * @msg: 销售数据统计群列表
   */
  statisticsRoomList: {
    url: '/wework/sales/statistics/room/list',
    method: 'post'
  },
  /**
  * @msg: 销售数据统计详情
  */
  statisticsDetail: {
    url: '/wework/sales/statistics/detail/list',
    method: 'post'
  },
  /**
   * @msg: 查询销售数据配置项
   */
  findByCode: {
    url: '/operate/sysConfig/findByCode',
    method: 'get'
  },
  /**
   * @msg: 保存销售数据配置项
   */
  saveOrUpdate: {
    url: '/operate/sysConfig/update',
    method: 'post'
  },
  /**
   * @msg: 店铺来源列表
   */
   statisticsShopList: {
    url: '/wework/sales/statistics/shop/list',
    method: 'get'
  }
}
