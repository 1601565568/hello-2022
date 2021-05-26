import moment from 'moment'
export const formatTime = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}
// 天数转日期
export const getDuringDateArray = (day) => {
  const todayStartTime = new Date(new Date().toLocaleDateString())
  const todayEndTeime = new Date(todayStartTime.getTime() + 24 * 3600 * 1000 - 1)

  const duringDays = new Date(todayStartTime.getTime() - (day - 1) * 24 * 3600 * 1000)
  return [ formatTime(duringDays), formatTime(todayEndTeime) ]
}
// 获取当月1号到现在日期
export const getCurrentMonthArray = () => {
  const day = new Date().getDate()
  return getDuringDateArray(day)
}
