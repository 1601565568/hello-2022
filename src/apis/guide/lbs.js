import { API_ROOT } from '@/config/http.js'
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
  // 群查询门店
  getGroupShop: {
    url: `${groupPrefix}activityShop`,
    method: 'post'
  },
  // 好友查询门店
  shopSearch: {
    url: `${friendsPrefix}shopSearch`,
    method: 'post'
  },
  // 群删除活动
  deleteGroupById: {
    url: `${groupPrefix}endActivity`,
    method: 'post'
  },
  // 好友删除活动
  deleteFriendsById: {
    url: `${friendsPrefix}endActivity`,
    method: 'post'
  },
  // 群请求详情
  getGroupDetail: {
    url: `${groupPrefix}edit`,
    method: 'post'
  },
  // 好友请求详情
  getFriendsDetail: {
    url: `${friendsPrefix}edit`,
    method: 'post'
  },
  // 保存群详情
  saveGroupDetail: {
    url: `${groupPrefix}saveOrUpdate`,
    method: 'post'
  },
  // 保存好友详情
  saveFriendsDetail: {
    url: `${friendsPrefix}saveOrUpdate`,
    method: 'post'
  },
  // 查询群二维码总数
  getGroupStatisticsCount: {
    url: `${groupPrefix}activityShopAndAdduserNum`,
    method: 'post'
  },
  // 查询好友二维码总数
  getFirendsStatisticsCount: {
    url: `${friendsPrefix}activityShopAndAdduserNum`,
    method: 'post'
  },
  // 添加群聊
  addGroup: {
    url: `${groupPrefix}addChatroom`,
    method: 'post'
  },
  // 删除群聊
  deleteGroup: {
    url: `${groupPrefix}deleteChatroom`,
    method: 'post'
  },
  // 群参与门店
  getGroupByshop: {
    url: `${groupPrefix}activityAnalysisShopList`,
    method: 'post'
  },
  // 好友参与门店
  getFriendsByshop: {
    url: `${friendsPrefix}activityAnalysisShopList`,
    method: 'post'
  },
  // 群门店下群列表
  activityShopDetail: {
    url: `${groupPrefix}activityShopDetail`,
    method: 'post'
  },
  // 好友门店下好友列表
  activityShopDetailByFriends: {
    url: `${friendsPrefix}friendActivityAnalysisDetailsList`,
    method: 'post'
  },
  // 群新增好友列表
  getGroupFriends: {
    url: `${groupPrefix}activityAdduserList`,
    method: 'post'
  },
  // 好友新增好友列表
  getFriendsFriends: {
    url: `${friendsPrefix}activityAdduserList`,
    method: 'post'
  },
  // 导出
  exportActivityShopData: `${API_ROOT}/${groupPrefix}exportActivityShopData`, // 群门店
  exportActivityAddUserData: `${API_ROOT}/${groupPrefix}exportActivityAddUserData`, // 群成员
  shopListDataExport: `${API_ROOT}/${friendsPrefix}shopListDataExport`, // 好友门店
  addUserDataExport: `${API_ROOT}/${friendsPrefix}addUserDataExport` // 好友新增好友
}
