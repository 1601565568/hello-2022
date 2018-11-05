/**
 * 下划线转驼峰
 * @param val
 * @returns {*}
 */
let underline2CamelCase = function (val) {
  /*eslint-disable*/
  return val.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转下划线
 * @param val
 * @returns {string}
 */
let camelCase2Underline = function (val) {
  return val.replace(/([A-Z])/g, '_$1').toLowerCase()
}

let common = {
  camelCase2Underline,
  underline2CamelCase
}
export default common
