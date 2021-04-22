const prefix = '/redpack/'
export default {
  // 获取红包封面
  getCoverList: {
    url: prefix + 'cover/list',
    method: 'post'
  },
  // 新增红包封面
  createCover: {
    url: prefix + 'cover/create',
    method: 'post'
  },
  // 获取红包封面详情
  getCoverDetail (id) {
    return {
      url: prefix + 'cover/' + id,
      method: 'GET'
    }
  },
  // 更新红包封面
  setCover (id) {
    return {
      url: prefix + 'cover/updateById/' + id,
      method: 'POST'
    }
  },
  // 删除红包封面
  deleteCover (id) {
    return {
      url: prefix + 'cover/deleteById/' + id,
      method: 'POST'
    }
  },
  // 获取红包策略列表
  getStrategiesList: {
    url: prefix + 'policy/list',
    method: 'post'
  },
  // 添加红包策略
  createStrategies: {
    url: prefix + 'policy/saveOrUpdate',
    method: 'post'
  },
  // 修改红包状态
  changeStrategiesState: {
    url: prefix + 'policy/updateState',
    method: 'post'
  },
  // 获取🐒包策略
  getStrategies: {
    url: prefix + 'policy/queryById',
    method: 'get'
  },
  // 添加发红包
  createSend: {
    url: prefix + 'send/setting/saveOrUpdate',
    method: 'post'
  },
  // 发红包列表
  getSendList: {
    url: prefix + 'send/setting/list',
    method: 'post'
  }
}
