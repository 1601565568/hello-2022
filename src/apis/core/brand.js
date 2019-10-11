import transData from '@nascent/ecrp-ecrm/src/utils/transData'

export default {
  queryTable: {
    url: '/core/systags/queryTable',
    method: 'post'
  },
  queryOptionBrand: {
    url: '/core/systags/queryOptionBrand',
    method: 'post'
  },
  deleteById: {
    url: '/core/systags/deleteById',
    method: 'post',
    transformRequest: transData
  },
  saveOrUpdateSysTags: {
    url: '/core/systags/saveOrUpdateSysTags',
    method: 'post'
  },
  queryByTagName: {
    url: '/core/systags/queryByTagName',
    method: 'get'
  },
  queryShop: {
    url: '/core/sysshop/queryListByOnLineAndTagName',
    method: 'post'
  },
  queryShopId: {
    url: '/core/sysshop/queryShopIdByTagId',
    method: 'get'
  },
  queryShopIdByTagId: {
    url: '/core/sysshop/queryShopIdByTagId',
    method: 'get'
  },
  saveShopAndTags: {
    url: '/core/systags/saveSysShopAndSyStags',
    method: 'post',
    transformRequest: transData
  }
}
