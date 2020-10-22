import test from './test'
import core from './core'
import guide from './guide'
import coupon from './coupon'
import isv from './isv'
import mall from './mall'
import overView from './overView'
import riskManagement from './riskManagement'
import weWork from './weWork' // 企业微信
import weChat from './weChat' // 个号
import dataCenter from './dataCenter'
export default {
  test,
  core,
  guide,
  coupon,
  isv,
  mall,
  riskManagement,
  overView,
  getMoreAccountByWeight: { // 根据权重查询个人号
    url: '/guide/sgmoreaccount/getMoreAccountByWeight',
    method: 'get'
  },
  dataCenter,
  weWork, // 企业微信
  weChat // 个号
}
