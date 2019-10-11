import transData from '@nascent/ecrp-ecrm/src/utils/transData'
export default {
  queryTable: {
    url: 'report/shopdsr/queryTable',
    method: 'post'
  },
  queryList: {
    url: 'report/shopdsr/queryList',
    method: 'post',
    transformRequest: transData
  },
  getTodayShopDsr: {
    url: 'report/shopdsr/getTodayShopDsr',
    method: 'get'
  }
}
