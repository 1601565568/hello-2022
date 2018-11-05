export default {
  router: (url) => {
    // 在这里做判断，返回布尔值
    return true
  },
  btn: (url) => {
    // 在这里做判断，返回布尔值
    if (url) {
      return false
    } else {
      return true
    }
  }
}
