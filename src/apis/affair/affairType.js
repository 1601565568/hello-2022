import transData from 'utils/transData'

export default {
  queryTable: {
    url: '/affair/affairtype/queryTable',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/affair/affairtype/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/affair/affairtype/deleteById',
    method: 'get'
  },
  updateAffairTypeState: {
    url: '/affair/affairtype/updateAffairTypeState',
    method: 'post'
  },
  updateAffairTypeOrder: {
    url: '/affair/affairtype/updateAffairTypeOrder',
    method: 'post'
  },
  checkAffairTypeName: {
    url: '/affair/affairtype/checkAffairTypeName',
    transformRequest: transData,
    method: 'post'
  }
}
