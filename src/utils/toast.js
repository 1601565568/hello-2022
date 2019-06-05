/**
 * 获取异常信息
 * @param prefix 前缀
 * @param error 错误对象
 * @returns {string} 异常信息
 */
export const getErrorMsg = (prefix, error) => {
  const msg = prefix || ''
  return msg.concat(error && error.msg ? error.msg : '网络异常')
}
