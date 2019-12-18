const hasClass = function (elem, cls) {
  cls = cls || ''
  if (cls.replace(/\s/g, '').length === 0 || !elem) { return false }
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}
const addClass = function (ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className = ele.className === '' ? cls : ele.className + ' ' + cls
  }
}
const isPhoneNum = function (tel) {
  const mobile = /^1[2|3|4|5|6|7|8|9]\d{9}$/
  return mobile.test(tel)
}
const isURL = function (strUrl) {
  // 验证url
  var strRegex = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
  if (strRegex.test(strUrl)) {
    return true
  } else {
    return false
  }
}
export { addClass, isPhoneNum, isURL }
