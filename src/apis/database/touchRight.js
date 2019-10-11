import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  save: {
    url: '/vip/touchblack/save',
    method: 'post'
  },
  queryTable: {
    url: '/vip/rightblack/queryRightBlackList',
    method: 'post'
  },
  queryCustomerTable: {
    url: '/vip/rightblack/queryCustomerNoRightBlack',
    method: 'post',
    timeout: 20000
  },
  deleteById: {
    url: '/vip/rightblack/deleteById',
    method: 'post'
  },
  batchDelete: {
    url: '/vip/rightblack/batchDelete',
    method: 'post'
  },
  importRight: {
    url: '/vip/rightblack/importRight',
    method: 'post'
  },
  batchInsert: {
    url: '/vip/rightblack/batchInsert',
    method: 'post'
  },
  batchInputInsert: {
    url: '/vip/rightblack/batchInputInsert',
    method: 'post',
    transformRequest: transData
  },
  insertBySysCustomerIdAndBrandId: {
    url: '/vip/rightblack/insertBySysCustomerIdAndBrandId',
    method: 'post',
    transformRequest: transData
  }
}
