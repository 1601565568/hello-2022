import test from './test'
import core from './core'
import guide from './guide'
import coupon from './coupon'
import isv from './isv'
import mall from './mall'
import overView from './overView'
import groupData from './groupData'
export default {
  test,
  core,
  guide,
  coupon,
  isv,
  mall,
  overView,
  groupData,
  getMoreAccountByWeight: { // 根据权重查询个人号
    url: '/guide/sgmoreaccount/getMoreAccountByWeight',
    method: 'get'
  }
}
