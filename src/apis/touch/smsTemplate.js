import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryTemplateType: {
    url: '/touch/smstemplate/getTemplateType',
    method: 'get'
  },
  saveOrUpdateTemplate: {
    url: '/touch/smstemplate/saveOrUpdateTemplate',
    method: 'post'
  },
  queryTable: {
    url: '/touch/smstemplate/queryTable',
    method: 'post'
  },
  deleteById: {
    url: '/touch/smstemplate/deleteById',
    method: 'get'
  },
  batchDeleteByIds: {
    url: '/touch/smstemplate/batchDeleteByIds',
    method: 'get'
  },
  queryById: {
    url: '/touch/smstemplate/queryById',
    method: 'get'
  },
  hasTitleExist: {
    url: '/touch/smstemplate/hasTitleExist',
    method: 'post',
    transformRequest: transData
  },
  queryByTypeAndTitle: {
    url: '/touch/smstemplate/queryByTypeAndTitle',
    method: 'post',
    transformRequest: transData
  }
}
