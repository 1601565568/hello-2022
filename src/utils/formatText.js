/*
 * @Date: 2022-04-11 10:56:53
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-11 11:04:08
 * @FilePath: \ECRP-SG-WEB\src\utils\formatText.js
 */
import store from '@/store'
const cloudPlatformType = store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType

export const formatText = (data = {}) => {
  return data[cloudPlatformType] || ''
}
