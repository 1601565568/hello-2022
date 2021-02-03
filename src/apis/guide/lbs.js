const prefix = 'activity/lbs/'
export default {
  // 群请求列表
  findGroupList: {
    url: `${prefix}findGroupList`,
    method: 'post'
  },
  findFriendsList: {
    url: `${prefix}findFriendsList`,
    method: 'post'
  },
  // 群删除活动
  deleteGroupById: {
    url: `${prefix}deleteGroupById`,
    method: 'post'
  },
  // 好友删除活动
  deleteFriendsById: {
    url: `${prefix}deleteFriendsById`,
    method: 'post'
  },
  // 群请求详情
  getGroupDetail: {
    url: `${prefix}getGroupDetail`,
    method: 'post'
  },
  // 好友请求详情
  getFriendsDetail: {
    url: `${prefix}getFriendsDetail`,
    method: 'post'
  },
  // 保存群详情
  saveGroupDetail: {
    url: `${prefix}getGroupDetail`,
    method: 'post'
  },
  // 保存好友详情
  saveFriendsDetail: {
    url: `${prefix}saveFriendsDetail`,
    method: 'post'
  }
}
