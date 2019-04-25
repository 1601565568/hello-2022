import transData from 'web-crm/src/utils/transData'
export default {
  queryTable: {
    url: '/touch/yschannel/queryTable',
    method: 'post'
  },
  hasChannelCodeExist: {
    url: '/touch/yschannel/hasChannelCodeExist',
    method: 'post',
    transformRequest: transData
  },
  hasSpNameExist: {
    url: '/touch/yschannel/hasSpNameExist',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdate: {
    url: '/touch/yschannel/saveOrUpdate',
    method: 'post'
  },
  deleteById: {
    url: '/touch/yschannel/deleteById',
    method: 'get'
  },
  queryById: {
    url: '/touch/yschannel/queryById',
    method: 'get'
  },
  queryBrandOptions: {
    url: '/touch/yschannel/queryBrandOptions',
    method: 'get'
  },
  queryAllBrandOptions: {
    url: '/touch/yschannel/queryAllBrandOptions',
    method: 'get'
  },
  querySmsChannelOptions: {
    url: '/touch/yschannel/querySmsChannelOptions',
    method: 'get'
  },
  queryEmailChannelOptions: {
    url: '/touch/yschannel/queryEmailChannelOptions',
    method: 'get'
  },
  querySmsChannelOptionsByAcccount: {
    url: '/touch/yschannel/querySmsChannelOptionsByAcccount',
    method: 'get'
  },
  queryEmailChannelOptionsByAcccount: {
    url: '/touch/yschannel/queryEmailChannelOptionsByAcccount',
    method: 'get'
  },
  changeDefaultStatus: {
    url: '/touch/yschannel/changeDefaultStatus',
    method: 'get'
  },
  hasChannelExist: {
    url: '/touch/yschannel/hasChannelExist',
    method: 'post',
    transformRequest: transData
  },
  getDefaultEmailChannel: {
    url: '/touch/yschannel/getDefaultEmailChannel',
    method: 'get'
  }
}
