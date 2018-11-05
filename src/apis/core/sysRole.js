import transData from 'utils/transData'

export default {
  queryTable: {
    url: '/core/role/findTable',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/core/role/saveOrUpdate',
    method: 'post'
  },
  batchDetele: {
    url: '/core/role/batchDetele',
    method: 'post',
    transformRequest: transData
  },
  findByRoleName: {
    url: '/core/role/findByRoleName',
    method: 'post',
    transformRequest: transData
  },
  findByRoleNameAndId: {
    url: '/core/role/findByRoleNameAndId',
    method: 'get'
  },
  findShopGrant: {
    url: '/core/role/getShopGrantData',
    method: 'post'
  },
  queryShopByRole: {
    url: '/core/role/queryShopByRole',
    method: 'post'
  },
  getRoleById: {
    url: '/core/role/getRoleById',
    method: 'get',
    transformRequest: transData
  },
  queryOptionItem: {
    url: '/core/role/queryOptionItem',
    method: 'post'
  }
}
