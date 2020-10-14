export default {
  // 活动名称不大于20个子
  validateName: (rule, value, callback) => {
    if (value.length > 20) {
      callback(new Error('活动名称最多20个字'))
    } else {
      callback()
    }
  },
  // 活动说明不大于1000个子
  validateActivityDescription: (name, rule, value, callback) => {
    if (value.length > 1000) {
      callback(new Error(`${name}最多1000个字`))
    } else {
      callback()
    }
  }
}
