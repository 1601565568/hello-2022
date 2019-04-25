import transData from 'web-crm/src/utils/transData'
export default {
  importMember: {
    url: '/marketing/activitiesdesign/importMember',
    method: 'post'
  },
  saveMsgTemplate: {
    url: '/marketing/activitiesdesign/saveMsgTemplate',
    method: 'post',
    transformRequest: transData
  },
  saveActivitiesDesign: {
    url: '/marketing/activitiesdesign/saveActivitiesDesign',
    method: 'post'
  },
  queryNodeDate: {
    url: '/marketing/activities/queryNodeDate',
    method: 'post',
    transformRequest: transData
  },
  queryNodeDateTable: {
    url: '/marketing/activities/queryNodeDateTable',
    method: 'post',
    transformRequest: transData
  },
  queryNodeTableDate: {
    url: '/marketing/activities/queryNodeTableDate',
    method: 'post'
  },
  activityProgress: {
    url: '/marketing/activitiesdesign/activityProgress',
    method: 'post',
    transformRequest: transData
  },
  getMarketing: {
    url: '/marketing/activitiesdesign/getMarketing',
    method: 'post',
    transformRequest: transData
  },
  findAnalysisNodeStatus: {
    url: '/marketing/activitiesdesign/findAnalysisNodeStatus',
    method: 'post',
    transformRequest: transData
  },
  resetErrorMarketing: {
    url: '/marketing/activitiesdesign/resetErrorMarketing',
    method: 'post',
    transformRequest: transData
  },
  loadActivitiesDesign: {
    url: '/marketing/activitiesdesign/loadActivitiesDesign',
    method: 'get'
  },
  queryBrandPropertiesMapping: {
    url: '/marketing/activitiesdesign/queryBrandPropertiesMapping',
    method: 'get'
  },
  updateSignTemplate: {
    url: '/marketing/activitiesdesign/updateSignTemplate',
    method: 'post',
    transformRequest: transData
  },
  loadActivitiesAnalysis: {
    url: '/marketing/activitiesdesign/loadActivitiesAnalysis',
    method: 'post',
    transformRequest: transData
  },
  loadTransactedCustomer: {
    url: '/marketing/activitiesdesign/loadTransactedCustomer',
    method: 'post',
    transformRequest: transData
  },
  findAnalysisReportDetail: {
    url: '/marketing/activitiesdesign/findAnalysisReportDetail',
    method: 'post'
  },
  findCustomerDetailData: {
    url: '/marketing/activitiesdesign/findCustomerDetailData',
    method: 'post'
  },
  findGoodsDetailData: {
    url: '/marketing/activitiesdesign/findGoodsDetailData',
    method: 'post'
  },
  findCustomerProperty: {
    url: '/marketing/activitiesdesign/findCustomerProperty',
    method: 'post'
  },
  findActivitiesProperty: {
    url: '/marketing/activitiesdesign/findActivitiesProperty',
    method: 'post'
  },
  loadAllAnalyze: {
    url: '/marketing/activitiesdesign/loadAllAnalyze',
    method: 'get'
  },
  checkIntegralRule: {
    url: '/marketing/activitiesdesign/checkIntegralRule',
    method: 'get'
  }
}
