export default {
  'path': '/Risk/RiskManagement',
  'name': 'RiskManagement',
  'component': () => import('@nascent/ecrp-ecrm/src/layout/Default.vue'),
  'meta': {
    'title': '风控管理',
    'requiresAuth': true
  },
  'children': [
    {
      'path': '/Risk/PhoneRiskManagement',
      'name': 'PhoneRiskManagement',
      'title': '手机风控',
      'component': () => import('@nascent/ecrp-ecrm/src/layout/Content.vue'),
      'children': [
        {
          'path': '/Risk/PhoneRiskManagement/CallRecords',
          'name': 'CallRecords',
          'title': '通话记录',
          'component': () => import('@/pages/RiskManagement/PhoneRiskContro/CallRecords/index.vue')
        },
        {
          'path': '/Risk/PhoneRiskManagement/SMSRecords',
          'name': 'SMSRecords',
          'title': '短信记录',
          'component': () => import('@/pages/RiskManagement/PhoneRiskContro/SmsRecords/index.vue')
        }
      ]
    }
  ]
}
