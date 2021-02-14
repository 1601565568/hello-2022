import moment from 'moment'
// 获取敏感词列表
export const formatList = result => {
  let list = result || []
  return list.map(item => {
    return {
      count: item.count,
      id: parseInt(item.id),
      word: item.word
    }
  })
}

export const formatWeWorkChatData = result => {
  let list = result || []
  return list.map(item => {
    let obj = {
      avatar: item.avatar, // 用户头像
      content: item.content, // 消息内容
      msgtime: moment(parseInt(item.msgtime)).format('YYYY-MM-DD HH:mm:ss'), // 时间
      msgtype: item.msgtype, // text 文本 image 图片 video 视频
      seq: item.seq, // 聊天的序列号
      seqId: parseInt(item.seq),
      sender: item.sender, // 用户名
      left: item.left, // true:放在聊天窗口左侧 false:放在右侧
      name: item.name
    }
    if (item.msgtype === 'link') {
      obj = {
        ...obj,
        title: item.title,
        description: item.description,
        link_url: item.link_url,
        image_url: item.image_url
      }
    }
    return obj
  })
}
