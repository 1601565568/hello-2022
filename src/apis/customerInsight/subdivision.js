import transData from 'utils/transData'
export default {
  getCategoryList: {
    url: '/subdivision/subdivision/getCategoryList',
    method: 'get'
  },
  queryTable: {
    url: '/subdivision/subdivision/queryTable',
    method: 'post'
  },
  getSubdivisionById: {
    url: '/subdivision/subdivision/getSubdivisionById',
    method: 'get'
  },
  saveSubdivision: {
    url: '/subdivision/subdivision/saveSubdivision',
    method: 'post'
  },
  deleteSubdivision: {
    url: '/subdivision/subdivision/deleteSubdivision',
    method: 'post',
    transformRequest: transData
  },
  getSubdivisionDataSource: {
    url: '/subdivision/subdivision/getSubdivisionDataSource',
    method: 'get'
  },
  getSubdivisionCount: {
    url: '/subdivision/subdivision/getSubdivisionCount',
    method: 'get',
    timeout: 60000
  },
  getSubdivisionCountByXml: {
    url: '/subdivision/subdivision/getSubdivisionCountByXml',
    method: 'post',
    transformRequest: transData,
    timeout: 60000
  },
  querySubdivisionCustomerList: {
    url: '/subdivision/subdivision/querySubdivisionCustomerList',
    method: 'post',
    transformRequest: transData,
    timeout: 180000 // 分组客户列表网格，超时时间需要久一点
  },
  getSubdivisionAnalysis: {
    url: '/subdivision/subdivision/getSubdivisionAnalysis',
    method: 'post',
    transformRequest: transData,
    timeout: 180000 // 分组属性分析，超时时间需要久一点
  },
  getSubdivisionList: {
    url: '/subdivision/subdivision/getSubdivisionList',
    method: 'get'
  }
}
