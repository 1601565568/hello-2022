/*
 * @Date: 2022-04-08 14:16:34
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-08 15:03:26
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\SessionStatistics\utils\index.js
 */
import store from '@/store'
const cloudPlatformType = store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType

export const formatText = (data = {}) => {
  return data[cloudPlatformType] || ''
}
