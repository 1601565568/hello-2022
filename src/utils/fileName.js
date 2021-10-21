/**
 * 获取url文件名
 * @param {*} url OSS地址
 */
export const fileName = url => {
  const findOSS = url.split('?')
  let arr = []
  if (findOSS.length > 0) {
    arr = findOSS[0].split('/')
  } else {
    arr = url.split('/')
  }
  if (arr.length > 0) {
    const next = arr[arr.length - 1]
    if (!next.includes('@@')) {
      return next
    } else {
      const strArr = next.split('@@')
      const pArr = next.split('.')
      const suffix = pArr[1] || ''
      return strArr[0] + '.' + suffix
    }
  }
  return ''
}
