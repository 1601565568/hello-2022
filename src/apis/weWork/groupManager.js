export default {
  // 群名称下拉列表
  getGroupList: {
    url: '/wework/weworkRooms/name',
    method: 'post'
  },
  // 选择群聊列表
  getGroupNameList: {
    url: '/chatRoom/canJoinList',
    method: 'post'
  },
  // 群主下拉列表
  getOwnerList: {
    url: '/wework/weworkRooms/owner',
    method: 'post'
  },
  // 所有群聊成员
  queryRepeatedInContactList: {
    url: '/wework/externalContact/queryRepeatedInContactList',
    method: 'post'
  },
  // 群聊成员详情
  queryRepeatedInContactDetailList: {
    url: '/wework/weworkRoomMember/queryRepeatedInContactDetailList',
    method: 'post'
  }
}
