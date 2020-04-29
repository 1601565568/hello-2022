import numeral from 'numeral'
import 'numeral/locales'

numeral.locale('chs')

/**
 * 格式化货币
 * @returns {*} 格式化后的结果
 */
export const formatCurrency = (value) => {
  return formatNormal(value, '$0,0.00')
}

/**
 * 格式化
 * @param value 原始值
 * @param format 格式
 * @returns {*} 格式化后的结果
 */
export const formatNormal = (value, format) => {
  return numeral(value).format(format)
}

/**
 * 格式化为整型千分位
 * @param value 数字
 * @returns {*}  格式化后的结果
 */
export const formatInteger = (value) => {
  return formatNormal(value, '0,0')
}

export default {
  numeral,
  formatCurrency,
  formatNormal,
  formatInteger
}
