import transData from 'web-crm/src/utils/transData'
export default {
  queryTable: {
    url: '/care/eventcare/queryTable',
    method: 'post'
  },
  updateTaskStatus: {
    url: '/care/eventcare/updateTaskStatus',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/care/eventcare/saveOrUpdate',
    method: 'post'
  },
  hasExistTitleByType: {
    url: '/care/eventcare/hasExistTitleByType',
    transformRequest: transData,
    method: 'post'
  },
  queryById: {
    url: '/care/eventcare/queryById',
    method: 'get'
  },
  queryDetail: {
    url: '/care/eventcare/queryDetail',
    method: 'get'
  },
  deleteById: {
    url: '/care/eventcare/deleteById',
    method: 'get'
  },
  getInitData: {
    url: '/care/eventcare/getInitData',
    method: 'get'
  },
  updateOrderNum: {
    url: '/care/eventcare/updateOrderNum',
    method: 'get'
  },
  getFestivalPatterns: {
    url: '/care/eventcare/getFestivalPatterns',
    method: 'get'
  }

}
