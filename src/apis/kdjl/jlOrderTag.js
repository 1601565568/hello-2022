import transData from 'web-crm/src/utils/transData'
export default {
  queryTable: {
    url: '/kdjl/tradetags/queryTable',
    method: 'post'
  },
  save: {
    url: '/kdjl/tradetags/save',
    method: 'post'
  },
  deleteByIds: {
    url: '/kdjl/tradetags/deleteByIds',
    method: 'post',
    transformRequest: transData
  },
  checkTagName: {
    url: '/kdjl/tradetags/checkTagName',
    method: 'post',
    transformRequest: transData
  }
}
