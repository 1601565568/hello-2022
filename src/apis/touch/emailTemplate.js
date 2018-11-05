import transData from 'utils/transData'
export default {
  queryTemplateType: {
    url: '/touch/emailtemplate/getTemplateType',
    method: 'get'
  },
  saveOrUpdateTemplate: {
    url: '/touch/emailtemplate/saveOrUpdateTemplate',
    method: 'post'
  },
  queryTable: {
    url: '/touch/emailtemplate/queryTable',
    method: 'post'
  },
  queryById: {
    url: '/touch/emailtemplate/queryById',
    method: 'get'
  },
  deleteById: {
    url: '/touch/emailtemplate/deleteById',
    method: 'get'
  },
  hasTitleExist: {
    url: '/touch/emailtemplate/hasTitleExist',
    method: 'post',
    transformRequest: transData
  },
  batchDeleteEmailTemplate: {
    url: '/touch/emailtemplate/batchDeleteEmailTemplate',
    method: 'get'
  },
  emailSend: {
    url: '/touch/emailtemplate/sendEmail',
    method: 'post'
  },
  queryEmailTemplateType: {
    url: '/touch/emailtemplate/getEmailTemplateType',
    method: 'get'
  },
  queryEmailTemplateOption: {
    url: '/touch/emailtemplate/queryEmailTemplateOption',
    method: 'get'
  }
}
