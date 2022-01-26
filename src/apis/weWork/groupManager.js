export default {
  getGroupList: {
    url: '/userCenter/groupManager/queryGroupList',
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
  getAllUser: {
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
  }
}
