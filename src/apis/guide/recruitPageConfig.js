const prefix = '/recruitPageConfig/'

export default {
  getInfo: {
    url: prefix + 'getInfo',
    method: 'GET'
  },
  updateSet: {
    url: prefix + 'updateSet',
    method: 'POST'
  },
  mpFollowStateChange: {
    url: prefix + 'mpFollowStateChange',
    method: 'POST'
  }
}
