import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryTable: {
    url: '/marketing/activities/activitieslist',
    method: 'post'
  },
  queryActivitiesList: {
    url: '/marketing/activities/getActivitiesList',
    method: 'post'
  },
  queryActivitiesAuditList: {
    url: '/marketing/activities/queryAuditList',
    method: 'post'
  },
  queryActivitiesAuditlogList: {
    url: '/marketing/activities/queryAuditlogList',
    method: 'post'
  },
  saveActivities: {
    url: '/marketing/activities/saveActivities',
    method: 'post'
  },
  modifyActivitiesAnalyzeDate: {
    url: '/marketing/activities/modifyActivitiesAnalyzeDate',
    method: 'post'
  },
  auditActivities: {
    url: '/marketing/activities/auditActivities',
    method: 'post',
    transformRequest: transData
  },
  submitActivies: {
    url: '/marketing/activities/submitActivies',
    method: 'get'
  },
  unSubmitActivies: {
    url: '/marketing/activities/unSubmitActivies',
    method: 'get'
  },
  preExecution: {
    url: '/marketing/activities/preExecution',
    method: 'get'
  },
  stopPreExecution: {
    url: '/marketing/activities/stopPreExecution',
    method: 'get'
  },
  continueActivities: {
    url: '/marketing/activities/continueActivities',
    method: 'get'
  },
  pauseActivities: {
    url: '/marketing/activities/pauseActivities',
    method: 'get'
  },
  loadActivities: {
    url: '/marketing/activities/loadActivities',
    method: 'get'
  },
  deleteById: {
    url: '/marketing/activities/deleteById',
    method: 'get'
  },
  loadActivitiesAnalyze: {
    url: '/marketing/activities/loadActivitiesAnalyze',
    method: 'get'
  },
  decrypt: {
    url: '/open/decode/decrypt',
    method: 'post'
  },
  findStopReport: {
    url: '/marketing/activities/findStopReport',
    method: 'get'
  }
}
