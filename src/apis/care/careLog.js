import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryCareLogBySysCustomerId: { // 根据系统会员id找触达日志列表
    url: '/care/carelog/queryCareLogBySysCustomerId',
    method: 'post'
  },
  groupCareLogBySysCustomerId: { // 根据系统会员id查找不同发送来源分组
    url: '/care/carelog/groupCareLogBySysCustomerId',
    method: 'post',
    transformRequest: transData
  },
  querySmsCareLog: {
    url: '/care/carelog/querySmsCareLog',
    method: 'post'
  },
  queryEmailCareLog: {
    url: '/care/carelog/queryEmailCareLog',
    method: 'post'
  },
  getTypeMarkOption: {
    url: '/care/carelog/getTypeMarkOption',
    method: 'get'
  },
  getSendStatusOption: {
    url: '/care/carelog/getSendStatusOption',
    method: 'get'
  },
  countFestivalCareCostByDate: {
    url: '/care/carelog/countFestivalCareCostByDate',
    method: 'get'
  }
}
