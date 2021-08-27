import test from './test'
import core from './core'
// import coupon from './coupon'
import dataCenter from './dataCenter'
import guide from './guide'
// import isv from './isv'
import mall from './mall'
import marketing from './marketing'
import overView from './overView'
import riskManagement from './riskManagement'
import weChat from './weChat' // 个号
import weWork from './weWork' // 企业微信

export default {
  test,
  core,
  // coupon,
  dataCenter,
  guide,
  // isv,
  mall,
  marketing,
  overView,
  riskManagement,
  weChat, // 个号
  weWork, // 企业微信
  getMoreAccountByWeight: { // 根据权重查询个人号
    url: '/guide/sgmoreaccount/getMoreAccountByWeight',
    method: 'get'
  },
  // 获取三方地址
  getsysUrls: {
    url: '/setting/sys/urls',
    method: 'get'
  },
  getChangeChannel: {
    url: '/group/queryGroupMsg',
    method: 'get'
  }
}
