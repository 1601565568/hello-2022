import transData from 'web-crm/src/utils/transData'
export default {
  batchInsert: {
    url: '/vip/touchblack/batchInsert',
    method: 'post'
  },
  queryTable: {
    url: '/core/customer/queryTable',
    method: 'post'
  },
  sendSms: {
    url: '/core/customer/sendSms',
    method: 'post',
    transformRequest: transData
  },
  queryCustomerBySysCustId: {
    url: '/core/customer/queryCustomerBySysCustId',
    method: 'get'
  }
}
