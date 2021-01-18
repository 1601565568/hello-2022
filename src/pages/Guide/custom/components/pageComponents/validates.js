export default {
  validateActivityIntroduction: (length, rule, value, callback) => {
    if (length > 1000) {
      callback(new Error(`活动介绍最多1000个字`))
    } else {
      callback()
    }
  }
}
