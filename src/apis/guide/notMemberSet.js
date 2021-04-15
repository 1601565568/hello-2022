const prefix = '/notMemberConfig/'

export default {
  saveOrUpdate: {
    url: prefix + 'saveOrUpdate',
    method: 'post'
  },
  search: {
    url: prefix + 'search',
    method: 'get'
  }
}
