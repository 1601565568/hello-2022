const prefix = '/guide/groupData/'

export default {
  getWxGroup: {
    url: prefix + 'getWxGroup'
  },
  table: {
    url: prefix + 'table',
    method: 'POST'
  },
  groupDetailTable: {
    url: prefix + 'groupDetailTable',
    method: 'POST'
  },
  createChatroom: {
    url: prefix + 'createChatroom',
    method: 'POST'
  },
  duplicateTable: {
    url: prefix + 'duplicateTable',
    method: 'POST'
  }
}
