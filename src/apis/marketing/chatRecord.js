export default {
  // 拉取企业最新聊天数据
  getWeWorkChatDataToDb: {
    url: 'weWorkchatData/getWeWorkChatDataToDb',
    method: 'post'
  },
  // 获取客户列表数据
  externalUserList: {
    url: 'guide/talk/externalUserList',
    method: 'post'
  },
  // 获取导购列表
  guideList: {
    url: 'guide/talk/guideList',
    method: 'post'
  },
  // 获取群列表
  chatRoomList: {
    url: 'guide/talk/chatRoomList',
    method: 'post'
  },
  talkToGuideList: {
    url: 'guide/talk/talkToGuideList',
    method: 'post'
  }
}
