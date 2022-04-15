/*
 * @Date: 2022-04-15 16:57:29
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-15 18:07:20
 * @FilePath: \ECRP-SG-WEB\src\directives\modules\platform-show.js
 */

/*
 * 根据平台类型区分节点元素是否显示
 * demo:
 * v-platform-show="'kd'" or v-platform-show="['kd', ecrp]"
 */

import store from '@/store'

export default {
  inserted (el, { value }) {
    const cloudPlatformType = store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    let flag = false
    if (Array.isArray(value)) {
      flag = value.includes(cloudPlatformType)
    } else if (value === cloudPlatformType) {
      flag = true
    }
    if (flag) return
    el.parentNode.removeChild(el)
  }
}
