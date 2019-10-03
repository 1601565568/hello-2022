const prefix = '/guide/wxChat/'

export default {
  // 查询聊天对象列表
  findTargetList: {
    url: prefix + 'findTargetList',
    method: 'post'
  },
  // 查询聊天记录
  findChatList: {
    url: prefix + 'findChatList',
    method: 'post'
  },
  // 按内容查询聊天记录
  findByContent: {
    url: prefix + 'findByContent',
    method: 'post'
  }
}
