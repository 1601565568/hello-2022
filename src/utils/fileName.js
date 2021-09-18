/**
 * 获取url文件名
 * @param {*} url OSS地址
 */
export const fileName = url => {
  const arr = url.split('/')
  if (arr.length > 0) {
    const next = arr[arr.length - 1]
    const strArr = next.split('@@')
    const pArr = next.split('.')
    const suffix = pArr[1] || ''
    return strArr[0] + '.' + suffix
  }
  return ''
}
