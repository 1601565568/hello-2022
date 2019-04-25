import transData from 'web-crm/src/utils/transData'
export default {
  queryTree: {
    url: '/kdjl/clazzphrasetype/queryTree',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/kdjl/clazzphrasetype/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/kdjl/clazzphrasetype/deleteById',
    method: 'post',
    transformRequest: transData
  },
  checkType: {
    url: '/kdjl/clazzphrasetype/checkByTypeNameAndParentId',
    method: 'post',
    transformRequest: transData
  }
}
