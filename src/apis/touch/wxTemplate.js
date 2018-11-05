import transData from 'utils/transData'
export default {
  queryTable: {
    url: '/touch/wxtemplate/queryTable',
    method: 'post'
  },
  hasNameExist: {
    url: '/touch/wxtemplate/hasNameExist',
    method: 'get'
  },
  hasTemplateCodeExist: {
    url: '/touch/wxtemplate/hasTemplateCodeExist',
    transformRequest: transData,
    method: 'post'
  },
  saveOrUpdate: {
    url: '/touch/wxtemplate/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/touch/wxtemplate/deleteById',
    method: 'get'
  },
  queryById: {
    url: '/touch/wxtemplate/queryById',
    method: 'get'
  },
  batchDel: {
    url: '/touch/wxtemplate/batchDelete',
    method: 'get'
  },
  queryWxAccountOptions: {
    url: '/touch/wxtemplate/queryWxAccountOptions',
    method: 'get'
  },
  queryTemplateType: {
    url: '/touch/wxtemplate/queryTemplateType',
    method: 'get'
  },
  queryWxTemplateTagsList: {
    url: '/touch/wxtemplate/queryWxTemplateTagsList',
    method: 'get'
  }
}
