export default {
  // 群名称下拉列表
  getGroupList: {
    url: '/wework/weworkRooms/name',
    method: 'post'
  },
  getGroupMemberList: {
    url: '/userCenter/groupManager/queryGroupMemberList',
    method: 'post'
  },
  queryGroupListByOwnerId: {
    url: '/userCenter/groupManager/queryGroupListByOwnerId',
    method: 'post'
  },
  // 选择群聊列表
  getGroupNameList: {
    url: '/chatRoom/canJoinList',
    method: 'post'
  },
  findGroupNameTable: {
    url: '/userCenter/groupManager/findGroupNameTable',
    method: 'post'
  },
  getRepeatMemberListByChatId: {
    url: '/userCenter/groupManager/queryRepeatMemberListByChatId',
    method: 'post'
  },
  getGroupAnalysisByDate: {
    url: '/userCenter/groupManager/queryGroupAnalysisByDate',
    method: 'post'
  },
  getGroupAnalysisByUser: {
    url: '/userCenter/groupManager/queryGroupAnalysisByUser',
    method: 'post'
  },
  getGroupAnalysisList: {
    url: '/userCenter/groupManager/getGroupAnalysisList',
    method: 'post'
  },
  // 群主下拉列表
  getOwnerList: {
    url: '/wework/weworkRooms/owner',
    method: 'post'
  },
  findGroupMemberDetail: {
    url: '/userCenter/customerList/findGroupMemberDetail',
    method: 'post'
  },
  queryGroupAnalysisOverview: {
    url: '/userCenter/groupManager/queryGroupAnalysisOverview',
    method: 'post'
  },
  // 所有用户
  queryRepeatedInContactList: {
    url: '/wework/externalContact/queryRepeatedInContactList',
    method: 'post'
  },
  // 详情
  queryRepeatedInContactDetailList: {
    url: '/wework/weworkRoomMember/queryRepeatedInContactDetailList',
    method: 'post'
  }
}
