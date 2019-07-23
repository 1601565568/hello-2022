const prefix = '/guide/wxChat/'

export default {
  // 查询聊天对象列表
  findChatTargetList: {
    url: prefix + 'findChatTargetList',
    method: 'post'
  },
  // 查询聊天记录
  findChatHistoryList: {
    url: prefix + 'findChatHistoryList',
    method: 'post'
  }
}
