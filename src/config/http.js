/**
 * API 默认请求方式
 * @type {string}
 */
export const API_DEFAULT_TYPE = 'get'

/**
 * API 请求根，可以是完整域名
 * @type {string}
 */
export const API_ROOT = window.GlobalConfig ? '' : '/crmWebApi' // '/crmWebApi' // process.env.NODE_ENV === 'production' ? '' : '/crmWebApi'

/**
 * API 默认请求超时时间
 * @type {number}
 */
export const API_TIMEOUT = 60000

/**
 * API 默认headers
 * @type {{token: string}}
 */
export const API_HEADERS = {
  XRequestedWith: 'XMLHttpRequest' //  用来后端API判断是ajax请求的头，不要删除
}

/**
 * 自定义接口代表状态的字段名
 * @type {string}
 */
export const API_SUCCESS_FIELD = 'success'

/**
 * 自定义接口代表状态的字段名
 * @type {string}
 */
export const API_STATUS_FIELD = 'code'

/**
 * 自定义接口状态不成功时返回的错误消息字段
 * @type {string}
 */
export const API_STATUS_ERROR_MSG_FIELD = 'msg'

/**
 * 自定义接口状态不成功时返回的成功消息字段
 * @type {string}
 */
export const API_STATUS_SUCCESS_MSG_FIELD = 'msg'

/**
 * 自定义接口代表代表状态的成功值
 * @type {number}
 */
export const API_STATUS_VALUE = 200

/**
 * 自定义接口存储成功数据的key,如果为空且状态成功，直接返回接口整个数据
 * @type {string}
 */
export const API_DATA_FIELD = 'result'

export default {
  API_DEFAULT_TYPE,
  API_ROOT,
  API_TIMEOUT,
  API_HEADERS,
  API_SUCCESS_FIELD,
  API_STATUS_FIELD,
  API_STATUS_ERROR_MSG_FIELD,
  API_STATUS_SUCCESS_MSG_FIELD,
  API_STATUS_VALUE,
  API_DATA_FIELD
}
