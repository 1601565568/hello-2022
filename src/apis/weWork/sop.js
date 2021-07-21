/*
 * @Descripttion: 企微方案 - sop社群日历
 * @Author: yinghao.liu
 * @Date: 2021-04-20 09:52:10
 * @LastEditors: yuye.huang
 * @LastEditTime: 2021-07-19 11:43:37
 */
export default {
  list: { // 日历列表数据
    url: '/roomSOP/list',
    method: 'post'
  },
  getCode: { // 获取编号接口
    url: '/roomSOP/getCode',
    method: 'get'
  },
  addOrUp: { // 创建/更新社群日历
    url: '/roomSOP/addOrUp',
    method: 'post'
  },
  findById: { // 查看详情接口
    url: '/roomSOP/findById',
    method: 'get'
  },
  delete: { // 查看详情接口
    url: '/roomSOP/delete',
    method: 'get'
  },
  updateStatus: { // 变更审核状态
    url: '/roomSOP/updateStatus',
    method: 'get'
  },
  getChatRoomInfoList: { // 群列表
    url: '/roomSOP/getChatRoomInfoList',
    method: 'post'
  },
  getEveryDayForCountByMonth: { // 查看月份下每天的任务数量
    url: '/roomSOP/getEveryDayForCountByMonth',
    method: 'get'
  },
  setAuthRange: { // 设置使用范围
    url: '/roomSOP/setAuthRange',
    method: 'post'
  },
  getAuthRange: { // 获取使用认证范围
    url: '/roomSOP/getAuthRange',
    method: 'get'
  },
  getLogForChatRoom: { // 群详情列表导出
    url: '/roomSOP/getLogForChatRoom',
    method: 'get',
    responseType: 'blob',
    callback: false
  },
  getCountByStatus: { // 查看不同活动状态的总数量
    url: '/roomSOP/getCountByStatus',
    method: 'get'
  },
  getSuccessTotal: { // 任务群发送成功数量
    url: '/roomSOP/getSuccessTotal',
    method: 'get'
  },
  getSendSucceedLog: { // 下载成功的日志数据流
    url: '/roomSOP/getLog',
    method: 'get',
    responseType: 'blob',
    callback: false
  },
  exportMomentStatistics: { // 导出朋友圈统计数据
    url: '/guide/momentList/exportMomentStatistics',
    method: 'post',
    responseType: 'blob',
    callback: false
  }
}
