const prefix = '/secruitmentSet/'

export default {
  getInfo: {
    url: prefix + 'getInfo',
    method: 'GET'
  },
  saveOrUpdateSet: {
    url: prefix + 'saveOrUpdateSet',
    method: 'POST'
  }
}
