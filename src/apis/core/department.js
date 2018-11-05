import transData from 'utils/transData'
export default {
  queryDepartmentTree: {
    url: '/core/sysdepartment/queryDepartmentTree',
    method: 'get'
  },
  queryDepartmentTreeByYun: {
    url: '/core/sysdepartment/queryDepartmentTreeByYun',
    method: 'get'
  },
  queryDepartmentTreeByCustomerId: {
    url: '/core/sysdepartment/queryDepartmentTreeByCustomerId',
    method: 'get'
  },
  saveOrUpdate: {
    url: '/core/sysdepartment/saveOrUpdate',
    method: 'post'
  },
  hasNameInBrotherExist: {
    url: '/core/sysdepartment/hasNameInBrotherExist',
    method: 'post',
    transformRequest: transData
  },
  queryById: {
    url: '/core/sysdepartment/queryById',
    method: 'get'
  },
  deleteById: {
    url: '/core/sysdepartment/deleteById',
    method: 'get'
  },
  updateDepartmentPath: {
    url: '/core/sysdepartment/updateDepartmentPath',
    method: 'post',
    transformRequest: transData
  }

}
