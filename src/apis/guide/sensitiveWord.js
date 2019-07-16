const prefix = '/guide/sensitiveWord/'

export default {
  // 查询敏感词
  findWordList: {
    url: prefix + 'findWordList',
    method: 'post'
  },
  // 新增分组
  saveGroup: {
    url: prefix + 'saveGroup',
    method: 'post'
  },
  // 修改分组
  updateGroup: {
    url: prefix + 'updateGroup',
    method: 'post'
  },
  // 删除分组
  removeGroup: {
    url: prefix + 'removeGroup',
    method: 'post'
  },
  // 分组树
  getGroupTree: {
    url: prefix + 'getGroupTree',
    method: 'post'
  },
  // 保存敏感词
  saveWord: {
    url: prefix + 'saveWord',
    method: 'post'
  },
  // 删除敏感词
  removeWord: {
    url: prefix + 'removeWord',
    method: 'post'
  }
}
