/**
 * 是否数字
 * @param val
 * @returns {boolean}
 */
let isNumber = function (val) {
  let valid = false
  if (val !== undefined) {
    valid = /^[0-9]+$/.test(val)
  }
  return valid
}

let isDecimal = function (val) {
  let valid = false
  if (val !== undefined) {
    valid = /^(\d+)(\.\d{0,2})?$/.test(val)
  }
  return valid
}

export default {
  isNumber,
  isDecimal
}
