/*
 * @Date: 2022-04-11 10:04:23
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-11 10:05:47
 * @FilePath: \ECRP-SG-WEB\src\pages\Guide\CustomerGroup\utils\index.js
 */
import store from '@/store'
const cloudPlatformType = store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType

export const formatText = (data = {}) => {
  return data[cloudPlatformType] || ''
}
