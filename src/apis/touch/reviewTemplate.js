import transData from 'utils/transData'
export default {
  saveOrUpdateTemplate: {
    url: '/touch/reviewtemplate/saveOrUpdateTemplate',
    method: 'post'
  },
  queryTable: {
    url: '/touch/reviewtemplate/queryTable',
    method: 'post'
  },
  queryById: {
    url: '/touch/reviewtemplate/queryById',
    method: 'get'
  },
  queryReviewTemplateOption: {
    url: '/touch/reviewtemplate/queryReviewTemplateOption',
    method: 'get'
  },
  deleteById: {
    url: '/touch/reviewtemplate/deleteById',
    method: 'get'
  },
  hasTitleExist: {
    url: '/touch/reviewtemplate/hasTitleExist',
    method: 'post',
    transformRequest: transData
  },
  batchDeleteReviewTemplate: {
    url: '/touch/reviewtemplate/batchDeleteReviewTemplate',
    method: 'get'
  }
}
