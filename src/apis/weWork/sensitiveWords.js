export default {
  // 添加敏感词
  add: {
    url: '/guide/sensitiveWords/add',
    method: 'get'
  },
  delete: {
    url: '/guide/sensitiveWords/delete',
    method: 'get'
  },
  list: {
    url: '/guide/sensitiveWords/list',
    method: 'post'
  },
  contentList: {
    url: '/guide/sensitiveWords/contentList',
    method: 'post'
  },
  context: {
    url: '/weWorkchatData/context',
    method: 'post'
  }
}
