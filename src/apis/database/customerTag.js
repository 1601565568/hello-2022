import transData from 'web-crm/src/utils/transData'
export default {
  queryTable: {
    url: '/core/kdcustomertags/queryTable',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/core/kdcustomertags/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/core/kdcustomertags/deleteById',
    method: 'post',
    transformRequest: transData
  },
  updateOrder: {
    url: '/core/kdcustomertags/updateOrder',
    method: 'post',
    transformRequest: transData
  },
  updateStatus: {
    url: '/core/kdcustomertags/updateStatus',
    method: 'post',
    transformRequest: transData
  },
  queryByTagName: {
    url: '/core/kdcustomertags/queryByTagName',
    method: 'post',
    transformRequest: transData
  }
}
