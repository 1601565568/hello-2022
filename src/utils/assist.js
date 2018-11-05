const hasClass = function (elem, cls) {
  cls = cls || ''
  if (cls.replace(/\s/g, '').length === 0 || !elem) return false
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
export {addClass, isPhoneNum}
