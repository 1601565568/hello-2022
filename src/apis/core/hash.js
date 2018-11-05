import apiRequestConfirm from 'utils/apiRequestConfirm'

export default {
  queryTable: {
    url: '/core/hash/queryTable',
    method: 'post'
  },
  isExistHashKey: {
    url: '/core/hash/isExistHashKey',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/core/hash/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/core/hash/deleteById',
    method: 'get',
    request: function (config, params) {
      apiRequestConfirm('该哈希删除')
    }
  },
  queryById: {
    url: '/core/hash/queryById',
    method: 'get'
  }
}
