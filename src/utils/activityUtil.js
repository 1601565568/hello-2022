export default {
  /**
   * 复制属性
   * @param destObj
   * @param oriObj
   */
  copyProperties (destObj, oriObj) {
    let destProperties = Object.keys(destObj)
    let oriProperties = Object.keys(oriObj)
    for (let property of destProperties) {
      if (oriProperties.indexOf(property) >= 0) {
        destObj[property] = oriObj[property]
      }
    }
  },
  /**
   * 同步休眠
   * @param delay
   */
  sleep (delay) {
    let p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve()
      }, delay)
    })
    return p
  },
  /**
   * 获取验证失败第一个元素的错误信息
   * @param errObj
   */
  getValidatorFirstErrObj (errObj) {
    let keys = Object.keys(errObj)
    if (errObj.length <= 0) {
      return null
    }
    return errObj[keys[0]][0]
  }
}
