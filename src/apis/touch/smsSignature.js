import transData from 'web-crm/src/utils/transData'
export default {
  queryTable: {
    url: '/touch/smssignature/queryTable',
    method: 'post'
  },
  querySmsTemplateOption: {
    url: '/touch/smssignature/querySmsTemplateOption',
    method: 'get'
  },
  querySignatureOption: {
    url: '/touch/smssignature/querySignatureOption',
    method: 'get'
  },
  hasSignatureExist: {
    url: '/touch/smssignature/hasSignatureExist',
    method: 'post',
    transformRequest: transData
  },
  queryById: {
    url: '/touch/smssignature/queryById',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/touch/smssignature/saveOrUpdate',
    method: 'post'
  },
  saveAndSubmit: {
    url: '/touch/smssignature/saveAndSubmitAudit',
    method: 'post'
  },
  deleteById: {
    url: '/touch/smssignature/deleteById',
    method: 'get'
  },
  batchDeleteByIds: {
    url: '/touch/smssignature/batchDeleteByIds',
    method: 'get'
  },
  defaultUpdate: {
    url: '/touch/smssignature/defaultChange',
    method: 'get'
  },
  effectiveUpdate: {
    url: '/touch/smssignature/effectiveChange',
    method: 'get'
  },
  submitAudit: {
    url: '/touch/smssignature/submitAudit',
    method: 'get'
  },
  getDefaultSignature: {
    url: '/touch/smssignature/getDefault',
    method: 'get'
  }
}
