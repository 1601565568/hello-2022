import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryTable: {
    url: '/kdjl/clazzphrase/queryTable',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/kdjl/clazzphrase/saveOrUpdate',
    method: 'post'
  },
  batchUpdateClassTypeId: {
    url: '/kdjl/clazzphrase/batchUpdateClassTypeId',
    method: 'post',
    transformRequest: transData
  },
  importFile: {
    url: '/kdjl/clazzphrase/importFile',
    method: 'post'
  },
  exportFile: {
    url: '/kdjl/clazzphrase/exportFile',
    method: 'post',
    responseType: 'blob', // 表明返回服务器返回的数据类型
    transformRequest: transData
  },
  countPhrase: {
    url: '/kdjl/clazzphrase/countPhrase',
    method: 'get',
    transformRequest: transData
  },
  deleteById: {
    url: '/kdjl/clazzphrase/deleteById',
    method: 'post',
    transformRequest: transData
  },
  checkType: {
    url: '/kdjl/clazzphrase/checkByTypeNameAndParentId',
    method: 'post',
    transformRequest: transData
  }
}
