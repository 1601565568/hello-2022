import transData from 'web-crm/src/utils/transData'

export default {
  queryMenuTree: {
    url: '/core/menu/queryMenuTree',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/core/menu/saveOrUpdate',
    method: 'post'
  },
  hasNameInBrotherExist: {
    url: '/core/menu/hasNameInBrotherExist',
    method: 'post',
    transformRequest: transData
  },
  hasCodeExist: {
    url: '/core/menu/hasCodeExist',
    method: 'post',
    transformRequest: transData
  },
  queryMenuById: {
    url: '/core/menu/queryMenuById',
    method: 'get'
  },
  deleteById: {
    url: '/core/menu/deleteById',
    method: 'get'
  },
  deleteBatch: {
    url: '/core/menu/deleteBatch',
    method: 'post',
    transformRequest: transData
  },
  updateMenuPath: {
    url: '/core/menu/updateMenuPath',
    method: 'post'
  },
  queryMenuTreeNotCondition: {
    url: '/core/menu/queryMenuTreeNotCondition',
    method: 'post'
  }
}
