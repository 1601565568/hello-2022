/*
 * @Descripttion: 企微方案 - 企微群相关接口
 * @Author: Miracle
 * @Date: 2020-05-18 16:09:44
 */
export default {
  /**
   * @msg: 查询企微群列表
   */
  queryWeWorkRoomsTable: {
    url: '/wework/weworkRooms/queryWeWorkRoomsTable',
    method: 'post'
  },
  /**
   * @msg: 查询企微群群主列表
   */
  queryWeWorkRoomsLeaderOptions: {
    url: '/wework/weworkRooms/queryWeWorkRoomsLeaderOptions',
    method: 'post'
  },
  /**
   * @msg: 查询企微群群主列表
   */
  export: {
    url: '/wework/weworkRooms/export',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  /**
   * @msg: 查询企微群名称
   */
  queryWeWorkRoomsNameOptions: {
    url: '/wework/weworkRooms/name',
    method: 'post'
  },
  /**
   * @msg: 查询企微群群成员信息
   */
  queryWeWorkRoomsMemberTable: {
    url: '/wework/weworkRoomMember/queryWeWorkRoomsMemberTable',
    method: 'post'
  },
  // 群分析
  analysis_general: {
    url: '/chat-room/analysis/general',
    method: 'get'
  },
  analysis_owner: {
    url: '/wework/weworkRooms/owner',
    method: 'post'
  },
  analysis_page_list_by_date: {
    url: '/chat-room/analysis/page_list_by_date',
    method: 'post'
  },
  analysis_page_list_by_user: {
    url: '/chat-room/analysis/page_list_by_user',
    method: 'post'
  },
  // 获取群会话(群分析)统计图表接口
  analysis_list: {
    url: '/chat-room/analysis/list',
    method: 'post'
  },
  // 群会话统计
  general: {
    url: '/chat-room/session-statistics/general',
    method: 'get'
  },
  page_list_by_date: {
    url: '/chat-room/session-statistics/page_list_by_date',
    method: 'post'
  },
  page_list_by_user: {
    url: '/chat-room/session-statistics/page_list_by_user',
    method: 'post'
  },
  // 获取群会话(群分析)统计图表接口
  list: {
    url: '/chat-room/session-statistics/list',
    method: 'post'
  },
  // 群分析导出
  chat_room_list_export: {
    url: '/chat-room/analysis/list_export',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  // 群会话导出
  session_list_export: {
    url: '/chat-room/session-statistics/list_export',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  }
}
