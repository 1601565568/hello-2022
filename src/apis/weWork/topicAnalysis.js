export default {
  // 获取话题列表
  getKeyWordTopicList: {
    url: 'weWorkchatTopic/getKeyWordTopicList',
    method: 'post'
  },
  // 新增话题
  addKeyWordTopic: {
    url: 'weWorkchatTopic/addKeyWordTopic',
    method: 'post'
  },
  // 新增话题关键词
  addKeyWord: {
    url: 'weWorkchatTopic/addKeyWord',
    method: 'post'
  },
  // 删除话题
  deleteKeyWordTopic: {
    url: 'weWorkchatTopic/deleteKeyWordTopic',
    method: 'get'
  },
  // 删除关键字
  deleteKeyWord: {
    url: 'weWorkchatTopic/deleteKeyWord',
    method: 'get'
  },
  contentList: {
    url: 'weWorkchatTopic/contentList',
    method: 'post'
  }
}
