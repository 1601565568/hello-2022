import transData from 'web-crm/src/utils/transData'

export default {
  queryTable: {
    url: '/core/user/queryTable',
    method: 'post'
  },
  saveOrUpdate: {
    url: '/core/user/saveOrUpdate',
    method: 'post'
  },
  batchDel: {
    url: '/core/user/batchDelById',
    method: 'post',
    transformRequest: transData
  },
  queryIsAccount: {
    url: '/core/user/queryIsAccount',
    method: 'post',
    transformRequest: transData
  },
  updateUserStatus: {
    url: '/core/user/updateUserStatus',
    method: 'post',
    transformRequest: transData
  },
  queryUserTree: {
    url: '/core/user/queryBrandUserTreeByYun',
    method: 'get'
  },
  queryShopUserTreeByYun: {
    url: '/core/user/queryShopUserTreeByYun',
    method: 'get'
  },
  getUsersAndDepartmentsByShopId: {
    url: '/core/user/getUsersAndDepartmentsByShopId',
    method: 'post'
  }
}
