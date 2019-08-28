const prefix = '/guide/sensitivePermission/'

export default {
  table: {
    url: prefix + 'table',
    method: 'POST'
  },
  detailTable: {
    url: prefix + 'detailTable',
    method: 'POST'
  },
  detailTableFromLog: {
    url: prefix + 'detailTableFromLog',
    method: 'POST'
  }
}
