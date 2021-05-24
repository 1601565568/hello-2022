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
   * @msg: 查询企微群名称
   */
  queryWeWorkRoomsNameOptions: {
    url: '/wework/weworkRooms/queryWeWorkRoomsNameOptions',
    method: 'post'
  },
  /**
   * @msg: 查询企微群群成员信息
   */
  queryWeWorkRoomsMemberTable: {
    url: '/wework/weworkRoomMember/queryWeWorkRoomsMemberTable',
    method: 'post'
  },
  general: {
    url: '/chat-room/statistics/general',
    method: 'get'
  },
  page_list_by_date: {
    url: '/chat-room/statistics/page_list_by_date',
    method: 'post'
  },
  page_list_by_owner: {
    url: '/chat-room/statistics/page_list_by_owner',
    method: 'post'
  },
  list: {
    url: '/chat-room/statistics/list',
    method: 'post'
  },
  chat_room_list_export: {
    url: '/chat-room/statistics/chat_room_list_export',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  },
  session_list_export: {
    url: '/chat-room/statistics/session_list_export',
    method: 'post',
    responseType: 'blob',
    timeout: 600000
  }
}
