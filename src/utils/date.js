/*
 * @Date: 2022-03-30 14:04:18
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-24 14:59:05
 * @FilePath: \ECRP-SG-WEB\src\utils\date.js
 */
import moment from 'moment'
export const formatTime = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date).format(fmt)
}
// 天数转日期
export const getDuringDateArray = (day) => {
  const todayStartTime = new Date(new Date().toLocaleDateString())
  const todayEndTeime = new Date(todayStartTime.getTime() + 24 * 3600 * 1000 - 1)

  const duringDays = new Date(todayStartTime.getTime() - (day - 1) * 24 * 3600 * 1000)
  return [formatTime(duringDays), formatTime(todayEndTeime)]
}
// 获取当月1号到现在日期
export const getCurrentMonthArray = () => {
  const day = new Date().getDate()
  return getDuringDateArray(day)
}

/**
 * @description: 禁选未来日期
 * @param {*} time
 * @return {*}
 */
export const disabledAfterDate = (time) => {
  return time.getTime() > Date.now()
}
