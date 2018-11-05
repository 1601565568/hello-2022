import transData from 'utils/transData'
export default {
  queryTable: {
    url: '/core/customerproperty/queryTable',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/core/customerproperty/saveOrUpdate',
    method: 'post'
  },
  queryById: {
    url: '/core/customerproperty/queryById',
    method: 'get'
  },
  updateState: {
    url: '/core/customerproperty/updateState',
    method: 'get'
  },
  batchUpdateState: {
    url: '/core/customerproperty/batchUpdateState',
    method: 'get'
  },
  hasPropertyNameExist: {
    url: '/core/customerproperty/hasPropertyNameExist',
    transformRequest: transData,
    method: 'post'
  }
}
