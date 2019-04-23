import transData from 'web-crm/src/utils/transData'
export default {
  queryTable: {
    url: '/touch/ysaccount/queryTable',
    method: 'post'
  },
  hasAccountExist: {
    url: '/touch/ysaccount/hasAccountExist',
    method: 'post',
    transformRequest: transData
  },
  queryAccountOptions: {
    url: '/touch/ysaccount/queryAccountOptions',
    method: 'get'
  },
  getAccountInfo: {
    url: '/touch/ysaccount/getAccountInfo',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/touch/ysaccount/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/touch/ysaccount/deleteById',
    method: 'get'
  },
  queryById: {
    url: '/touch/ysaccount/queryById',
    method: 'get'
  },
  updateInfo: {
    url: '/touch/ysaccount/updateInfo',
    method: 'get'
  }
}
