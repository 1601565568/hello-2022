const groupPrefix = 'lbs/chatroom/'
const friendsPrefix = 'lbs/friend/'
export default {
  // 群请求列表
  findGroupList: {
    url: `${groupPrefix}list`,
    method: 'post'
  },
  findFriendsList: {
    url: `${friendsPrefix}findLbsList`,
    method: 'post'
  },
  // 群删除活动
  deleteGroupById: {
    url: `${groupPrefix}deleteGroupById`,
    method: 'post'
  },
  // 好友删除活动
  deleteFriendsById: {
    url: `${friendsPrefix}deleteFriendsById`,
    method: 'post'
  },
  // 群请求详情
  getGroupDetail: {
    url: `${groupPrefix}getGroupDetail`,
    method: 'post'
  },
  // 好友请求详情
  getFriendsDetail: {
    url: `${friendsPrefix}getFriendsDetail`,
    method: 'post'
  },
  // 保存群详情
  saveGroupDetail: {
    url: `${groupPrefix}getGroupDetail`,
    method: 'post'
  },
  // 保存好友详情
  saveFriendsDetail: {
    url: `${friendsPrefix}saveFriendsDetail`,
    method: 'post'
  }
}
