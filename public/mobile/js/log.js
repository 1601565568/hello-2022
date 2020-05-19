/**
 * 日志上报工具类
 */
const logUrl = (function () {
  let returnUrl
  var hostUrl = window.location.protocol + '//' + window.location.host
  if (hostUrl.includes('localhost') || hostUrl.includes('127.0.0.1')) {
    hostUrl = 'http://localhost:30004/liberty/url/appUrl'
  } else {
    hostUrl += '/crmWebApi/liberty/url/appUrl'
  }
  $.ajax({
    url: hostUrl,
    type: 'post',
    dataType: 'JSON',
    method: 'post',
    async: false,
    contentType: 'application/json;charset=UTF-8',
    success: function (res) {
      returnUrl = res.result
    },
    error: function (res) {
      window.location.replace('./invalid/invalid.html?msg=获取服务器地址异常')
    }
  })
  return returnUrl + '/app'
}())
/**
 * 日志上报
 * @param level 日志级别
 * @param module 模块
 * @param message 消息
 * @param ext 扩展对象
 */
const upLog = (level, module, message, ext) => {
  try {
    switch (level) {
      case 3:
        // console.error('日志上报', module, message, ext)
        break
      case 2:
        // console.warn('日志上报', module, message, ext)
        break
      case 1:
      default:
        // console.log('日志上报', module, message, ext)
    }
    let count = 0
    const up = () => {
      count++
      let data = {
        level,
        module,
        message,
        ext,
        source: '导购'
      }
      let url = logUrl + '/liberty/log/write'
      $.ajax({
        url: url,
        type: 'post',
        async: true,
        dataType: 'JSON',
        data: JSON.stringify(data),
        method: 'post',
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
        },
        error: function (res) {
          // 重试三次，若都失败则不上传日志了
          if (count < 3) {
            // console.log('上报日志失败......重试第' + count + '次')
            up()
          } else {
            // console.error('上报日志异常', error)
          }
        }
      })
    }
    up()
  } catch (e) {
    // console.error('上报日志异常', e)
  }
}

const log = {
  /**
   * 普通日志上报
   * @param module 模块
   * @param message 消息
   * @param ext 扩展对象
   */
  info: (module, message, ext = {}) => {
    upLog(1, module, message, ext)
  },
  /**
   * 警告日志上报
   * @param module 模块
   * @param message 消息
   * @param ext 扩展对象
   */
  warn: (module, message, ext = {}) => {
    upLog(2, module, message, ext)
  },
  /**
   * 错误日志上报
   * @param module 模块
   * @param message 消息
   * @param ext 扩展对象
   */
  error: (module, message, ext = {}) => {
    upLog(3, module, message, ext)
  }
}
