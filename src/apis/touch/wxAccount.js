import transData from 'web-crm/src/utils/transData'
/**
 * 微信公众号api
 */
export default {
  queryTable: {
    url: '/touch/wxaccount/queryTable',
    method: 'post'
  },
  syncWxAccount: {
    url: '/touch/wxaccount/syncWxAccount',
    method: 'get'
  },
  updateOrderNum: {
    url: '/touch/wxaccount/updateOrderNum',
    method: 'get'
  },
  hasNameExist: {
    url: '/touch/wxaccount/hasNameExist',
    method: 'get'
  },
  hasAppKeyExist: {
    url: '/touch/wxaccount/hasAppKeyExist',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/touch/wxaccount/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/touch/wxaccount/deleteById',
    method: 'get'
  },
  isUsing: {
    url: '/touch/wxaccount/isUsing',
    method: 'get'
  },
  queryById: {
    url: '/touch/wxaccount/queryById',
    method: 'post',
    transformRequest: transData
  },
  statusUpdate: {
    url: '/touch/wxaccount/statusUpdate',
    method: 'get'
  }
}
