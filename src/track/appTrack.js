/* eslint-disable */
'use strict'
const appEnv = require('./appEnv')

function _typeof (obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    // eslint-disable-next-line no-func-assign
    _typeof = function (obj) {
      return typeof obj
    }
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
    }
  }

  return _typeof(obj)
}

var makeRnd = function makeRnd () {
  return +new Date() + Math.floor(Math.random() * 1000)
}

var spmId = ''

var getSpmId = function getSpmId () {
  var meta = document.getElementsByTagName('meta')
  var id = []
  var spma = ''

  if (spmId) {
    return spmId
  } // spm第一位

  for (var i = 0; i < meta.length; i++) {
    var tag = meta[i]

    if (tag && tag.name && (tag.name === 'data-spm' || tag.name === 'spm-id')) {
      spma = tag.content
    }
  }

  if (spma) {
    id.push(spma)
  } // spm第二位

  if (document.body && document.body.getAttribute('data-spm')) {
    id.push(document.body.getAttribute('data-spm'))
  }

  id = id.length ? id.join('.') : 0

  if (id && id.indexOf('.') !== -1) {
    spmId = id
  }

  return spmId
}

if (!getSpmId.bind) {
  getSpmId.bind = function () {
    return getSpmId
  }
}
/* TODO: 版本新添的代码，就代码无注释，功能暂未分析 */

var win = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : {}
var _catch = ['catch'][0]
var oFetch = typeof win.fetch === 'function' ? win.fetch : undefined

var noop = function noop () {}

var browserConf = {
  sendRequest: function sendRequest (src) {
    var _this = this

    if (!this.debug && !this.config.report) {
      return
    } // 是否使用自定义上报

    if (typeof this.config.fetch === 'function') {
      setTimeout(function () {
        _this.config.fetch(src)
      })
      return
    } // 是否使用 fetch 上报

    if (oFetch) {
      return oFetch(src, {
        method: this.config.fetch.method,
        mode: 'no-cors'
      })[_catch](noop)
    }

    var n = 'jsFeImage_' + makeRnd()
    var img = win[n] = new Image()

    img.onload = img.onerror = function () {
      win[n] = undefined
    }
    img.src = src
    img = null
  },
  getCookie: function getCookie () {
    return document.cookie
  },
  getSessionStorage: function getSessionStorage (key) {
    try {
      return sessionStorage.getItem(key)
    } catch (e) { // console.log(e)
    }
  },
  getSpmId: getSpmId
}

function core (wpo, root, conf, name) {
  var cookies = {}
  var count = 0
  var uid
  var timer
  var config = {
    // 默认上报
    imgUrl: '',
    sample: 10,
    modVal: 1,
    // 是否开启动态配置功能
    dynamic: false,
    // API抽样率
    retCode: {},
    delayOfReady: null,
    fetch: {
      method: 'HEAD'
    },
    // 消息是否上报
    report: true
  }
  /**
   * safety function caller
   * @param  {Function} fn
   * @param  {Array}   args
   * @param  {*}   defaultValue
   * @return {*}
   */

  var safetyCall = function safetyCall (fn, args, defaultValue) {
    if (typeof fn !== 'function') return defaultValue

    try {
      return fn.apply(this, args)
    } catch (ex) {
      return defaultValue
    }
  }

  var sendRequest = conf.sendRequest

  var _send = function _send () {
    var params
    var obj // 发送log.js异步加载前的数据队列

    if (wpo.asyncQueue && wpo.asyncQueue.length > 0) {
      var asyncQueue = wpo.asyncQueue
      var item

      while (item = asyncQueue.shift()) {
        var method = item.method

        if (typeof wpo[method] === 'function') {
          wpo[method].apply(wpo, item.args || [])
        }
      }
    }

    while (params = core.dequeue()) {
      const model = JSON.parse(params.params || '')
      obj = core.extend({
        uid: uid,
        userNick: wpo.getNick(),
        appType: appEnv.getWebDev(),
        appEnv: appEnv.getAppEnv(),
        nodeEnv: process.env.NODE_ENV,
        times: params.times ? params.times : 1,
        type: model.type || '',
        // _t: ~new Date() + (count++).toString(),
        tag: wpo.config.tag && (safetyCall(wpo.config.tag, [], wpo.config.tag + '') || ''),
        ...appTrackOptions
      }, params) // 最后一次尝试补齐spm值

      if (!obj.spm) {
        obj.spm = wpo.getSpmId()
      }

      if (!obj.spm) {
        break
      }

      if (wpo.debug && (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.console) {
        console.log(obj)
      }
      sendRequest.call(wpo, config.imgUrl + core.query.stringify(obj))
    }

    timer = null
  }
  /**
   * 延时发送
   *
   * @param _clear 是否立即发送
   * @param delay 延时多久发送
   * @private
   */

  var _wait = function _wait (_clear) {
    if (_clear && timer) {
      clearTimeout(timer)

      _send()
    }

    if (!timer) {
      timer = setTimeout(_send, 1000)
    }
  }

  var core = {
    _key: 'wpokey',
    // 版本号
    ver: '0.3.2',
    // dynamically updates itself without queue
    requestQueue: wpo.requestQueue || [],

    /**
     * 获取cookie
     *
     * @param name
     * @returns {*}
     */
    getCookie: function getCookie (name) {
      var reg
      var matches
      var cookie = ''

      if (!cookies[name]) {
        reg = new RegExp(name + ' = ([^;]+)') //
        // to make it compatible with nodejs
        //

        try {
          cookie = conf.getCookie(this)
        } catch (e) {}

        matches = reg.exec(cookie)

        if (matches) {
          cookies[name] = matches[1]
        }
      }

      return cookies[name]
    },

    /**
     * 设置cookie
     *
     * @param key
     * @param value
     * @param expires
     * @param domain
     * @param path
     */
    setCookie: function setCookie (key, value, expires, domain, path) {
      var str = key + ' = ' + value

      if (domain) {
        str += '; domain = ' + domain
      }

      if (path) {
        str += '; path = ' + path
      }

      if (expires) {
        str += '; expires = ' + expires
      }

      document.cookie = str
    },
    getSessionStorage: function getSessionStorage (name) {
      var storage = ''

      if (!cookies[name]) {
        //
        // to make it compatible with nodejs
        //
        try {
          storage = conf.getSessionStorage(name)
        } catch (e) { // console.log(e)
        }

        if (storage) {
          cookies[name] = storage
        }
      }

      return cookies[name]
    },

    /**
     * 扩展对象
     *
     * @param target
     * @returns {*}
     */
    extend: function extend (target) {
      var args = Array.prototype.slice.call(arguments, 1)

      for (var i = 0, len = args.length, arg; i < len; i++) {
        arg = args[i]

        for (var _name in arg) {
          if (arg.hasOwnProperty(_name)) {
            target[_name] = arg[_name]
          }
        }
      }

      return target
    },

    /**
     * 获取guid
     *
     * @returns {string}
     */
    guid: function guid () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : r & 0x3 | 0x8
        return v.toString(16)
      })
    },

    /**
     * 发送请求
     *
     * @param params
     */
    send: function send (params) {
      // 如果没有禁用wpo则上报, e.g., daily环境可禁用wpo上报,防止数据污染
      if (params && !wpo.config.disabled) {
        var spm = core.getSpmId() // 如果尚未设置过spm,并且成功获取到spm,则锁定spm值
        // 加入队列的时候即固定了此次上报的spm,方便SPA应用通过setConfig动态修改spm

        if (!params.spm && spm) {
          params.spm = spm
        }

        this.queue({params:JSON.stringify(params),timestamp: new Date().getTime(),path:window.location.origin+window.location.pathname})
      }
    },
    query: {
      /**
       * 对象转url字符串
       *
       * @param params
       * @returns {string}
       */
      stringify: function stringify (params) {
        var arr = []
        var str = '' // encodeURIComponent异常保护

        try {
          for (var _name2 in params) {
            if (params.hasOwnProperty(_name2) && params[_name2] !== undefined) {
              var encodeInfo = ''

              if (_name2 === 'spm') {
                encodeInfo = encodeURI(params[_name2])
              } else {
                encodeInfo = encodeURIComponent(params[_name2])
              }

              arr.push(_name2 + '=' + encodeInfo)
            }
          }

          if (arr.length > 0) {
            str = arr.join('&')
          }
        } catch (e) {}
        return str
      },

      /**
       * url字符串转对象
       *
       * @param str
       * @returns {{}}
       */
      parse: function parse (str) {
        var pairs = str.split('&')
        var obj = {}
        var pair // decodeURIComponent异常保护

        try {
          for (var i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split(' = ')
            obj[pair[0]] = decodeURIComponent(pair[1])
          }
        } catch (e) {}

        return obj
      }
    },

    /**
     * 获取spmId
     *
     * @returns {*}
     */
    getSpmId: function getSpmId () {
      if (config.spmId) {
        return config.spmId
      } else if (typeof conf.getSpmId === 'function') {
        return conf.getSpmId.call(this)
      }

      return 0
    },

    /**
     * 事件绑定
     *
     * @param el
     * @param type
     * @param func
     * @param isRemoving
     */
    on: function on (el, type, func, isRemoving) {
      if (el.addEventListener) {
        el.addEventListener(type, isRemoving ? function () {
          el.removeEventListener(type, func, false)
          func()
        } : func, false)
      } else if (el.attachEvent) {
        el.attachEvent('on' + type, function () {
          if (isRemoving) {
            el.detachEvent('on' + type, arguments.callee)
          }

          func()
        })
      }
    },

    /**
     * 获取用户的taobao nick
     *
     * @returns {*}
     */
    getNick: function getNick () {
      var nick = ''

      try {
        // 优先取业务方主动配置的nick
        if (wpo.config.nick) {
          nick = wpo.config.nick
        } else {
          // 否则从cookie中读取
          // 分别取淘宝PC,淘宝无线,商家子账号cookie
          nick = this.getSessionStorage('_nk_') || this.getSessionStorage('_co_') || ''
          nick = decodeURIComponent(nick)
        }
      } catch (e) {}

      return nick
    },

    /**
     * 设置config
     * @param inConfig
     * @returns {*}
     */
    setConfig: function setConfig (conf) {
      if (conf && _typeof(conf) !== 'object') {
        throw new Error('args of wpo.setConfig is not object')
      } // weex环境

      if (conf && conf.user && typeof conf.user.getUserInfo === 'function' && this.env === 'weex') {
        // 设置nick
        conf.user.getUserInfo(function (res) {
          try {
            res = JSON.parse(res)
          } catch (e) {}

          core.extend(config, {
            nick: res.info && res.info.nick
          })
        })
      }

      return core.extend(config, conf)
    },

    /**
     * 快捷配置spm,返回wpo自身方便链式调用
     *
     * @param spm
     * @returns {core}
     */
    spm: function spm (_spm) {
      if (_spm) {
        this.setConfig({
          spmId: _spm
        })
      }

      return this
    },

    /**
     * 动态配置
     *
     * @param obj
     */
    dynamicConfig: function dynamicConfig (obj) {
      var config = this.query.stringify(obj)

      try {
        localStorage.setItem(this._key, config)
      } catch (e) {
        this.setCookie(this._key, config, new Date(obj.expTime))
      }

      this.setConfig({
        sample: parseInt(obj.sample, 10)
      })
      this.ready()
    },

    /**
     * ready
     *
     */
    ready: function ready () {
      var _ready = function _ready () {
        wpo._ready = true

        _wait()
      }

      if (wpo.config.delayOfReady) {
        setTimeout(function () {
          _ready()
        }, wpo.config.delayOfReady)
      } else {
        _ready()
      }
    },

    /**
     * 加入请求队列
     *
     * @param obj
     */
    queue: function queue (obj) {
      var queue = this.requestQueue
      var compare

      if (obj.type === 'jserror') {
        if (queue.length) {
          compare = queue[queue.length - 1]

          if (obj.msg === compare.msg) {
            compare.times++
            return
          }
        }

        if (!obj.times) {
          obj.times = 1
        }
      }

      queue.push(obj)

      if (this._ready) {
        if (obj.type === 'jserror') {
          // js error延时1s发送,方便合并大量同类错误
          _wait(false)
        } else {
          _send()
        }
      }
    },

    /**
     * 从请求队列取头部取一个(第一个)
     *
     * @returns {T}
     */
    dequeue: function dequeue () {
      return this.requestQueue.shift()
    },

    /**
     * clear
     */
    clear: function clear () {
      _wait(true)
    }
  }
  core.uid = uid = core.guid()
  core.config = core.setConfig(wpo.config)
  core.safetyCall = safetyCall
  core.extend(wpo, core)
  root[name] = wpo
  return wpo
}

//
// 修改抽样算法，以前以uid作为抽样的key，在大于100抽样率下会呈现正态分布
// 改用random可以规避这个问题
//
// (function (n) {
//     const guid = function () {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//             let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
//             return v.toString(16);
//         });
//     };
//     const parseGuid = function (uid) {
//         let num = 0;
//         for (let i = 0, len = uid.length; i < len; i++) {
//             num += uid.charCodeAt(i);
//         }
//         return num;
//     };
//     let arr = [];
//     for (let i = 0, n = n || 1000000; i++ < n;) {
//         // arr.push(parseGuid(guid()) % 100);
//         arr.push(Math.floor(Math.random() * 100));
//     }
//     let map = {};
//     arr.forEach(function (num) {
//         if (!map[num]) {
//             map[num] = 0;
//         }
//         map[num]++;
//     });
//     console.log(map);
// })();
function sampling (wpo) {
  var map = {}

  wpo.sampling = function (mod, isApi) {
    if (mod === 1) {
      return 1 // 100%
    } // api采样率使用动态api

    if (isApi) {
      return Math.floor(Math.random() * mod)
    }

    if (typeof map[mod] === 'number') {
      return map[mod]
    } //
    // 抽样算法改为Math.random
    //

    map[mod] = Math.floor(Math.random() * mod)
    return map[mod]
  }
}

function apis (wpo, undef) {
  // startTime配置兼容
  var startTime = wpo.startTime || wpo.config.startTime
  var scriptStart = startTime

  if (!startTime) {
    try {
      startTime = window.performance.timing.responseStart || +new Date()
      scriptStart = +new Date()
    } catch (e) {
      scriptStart = startTime = +new Date()
    }
  }

  var send = function send (params, sampling) {
    sampling = sampling || wpo.config.sample
    params.tag = wpo.config.tag && (wpo.safetyCall(wpo.config.tag, [], wpo.config.tag + '') || '') // retcode api上报做特殊处理

    if (wpo.sampling(sampling, params.type === 'retcode') === (wpo.config.modVal || 1)) {
      params.sampling = sampling
      wpo.send(params)
    }
  }
  /**
   * [custom description]
   * @param  {[int/string]} category [0/'time'，1/'count']
   * @param  {[string]} key      [自定义值]
   * @param  {[any]} value    [自定义值，如果type为count，自动忽略该值]
   * @return {[void]}
   */

  wpo.custom = function (category, key, value) {
    var customParam = {
      type: 'custom'
    }
    var arr = ['time', 'count']
    category = arr[category] || category

    if (category === 'time' || category === 'count') {
      customParam.category = category
    }

    if (customParam.type) {
      customParam.key = key
      customParam.value = category === 'time' ? value : undef
      send(customParam)
    }
  }
  /**
   * 过滤规则检测 filter by pattern
   * @param  {String} msg
   * @param  {*} filterPattern
   * @return {Boolean} 是否被略过
   */

  var filterErrMsg = function filterErrMsg (msg, filterPattern) {
    // 空白消息省略
    if (!msg) return true
    if (!filterPattern) return false

    try {
      var type = Object.prototype.toString.call(filterPattern).substring(8).replace(']', '')

      if (type === 'Function') {
        return !!filterPattern(msg)
      } else if (type === 'RegExp') {
        return filterPattern.test(msg)
      } else if (type === 'String') {
        return msg.indexOf(filterPattern) >= 0
      }
    } catch (err) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.console) {
        console.error('retcode log errMsgFitler error', err)
      }
    } // 未识别的过滤规则统一不过滤

    return false
  }
  /**
   * [error description]
   * @param  {[str]} category [可选参，错误类型，默认为sys]
   * @param  {[str]} msg      [自定义错误信息]
   * @return {[void]}
   */

  wpo.error = function (category, msg, file, line, col, stack) {
    var errorParam = {
      type: 'jserror'
    }

    if (arguments.length === 1) {
      msg = category
      category = undefined
    } // 有错误信息才上报

    if (msg) {
      errorParam.category = category || 'sys'

      if (_typeof(msg) === 'object' && msg.message) {
        // event处理https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent
        var msgEvent = msg

        try {
          msg = msgEvent.message
          file = file || msgEvent.filename
          line = line || msgEvent.lineno
          col = col || msgEvent.colno
        } catch (e) {}
      } else {
        if (_typeof(msg) === 'object') {
          try {
            msg = JSON.stringify(msg)
          } catch (e) {}
        }
      }

      try {
        if (msg) {
          msg = msg.substring(0, 1e3)
        } else {
          msg = ''
        }
      } catch (e) {
        msg = ''
      }

      stack = stack ? stack.substring(0, 1e3) : '' // 限制1000个字符

      errorParam.msg = msg // 若有设置errMsgFilter

      if (wpo.config && wpo.config.errMsgFilter) {
        // 检测符合规则直接忽略
        if (filterErrMsg(msg, wpo.config.errMsgFilter)) return
      } // separate msg file name

      if (file) {
        errorParam.file = file
      }

      if (line) {
        errorParam.line = line
      }

      if (col) {
        errorParam.col = col
      }

      if (stack) {
        errorParam.stack = stack
      }

      send(errorParam, 1)
    }
  }
  /**
   * [performance description]
   * @param  {[obj]} params [性能相关信息]
   * @return {[void]}
   */

  wpo.performance = function (params) {
    var perParam = {
      type: 'per'
    }
    send(wpo.extend(perParam, params))
  }
  /**
   * [retCode description]
   * @param  {[str / obj]} api       [所调用的api]
   * @param  {[boolean]} issuccess [是否成功，不成功会100%发送，成功按照抽样发送]
   * @param  {[type]} delay    [调用时间]
   * @param  {[type]} code     [错误码]
   * @param  {string} msg      [错误详情]
   * @return {[void]}
   */

  wpo.retCode = function (api, issuccess, delay, code, msg) {
    var retParam = {
      type: 'retcode',
      sampling: this.config.retCode[api]
    }

    if (_typeof(api) === 'object') {
      // 新接口
      try {
        api.msg = api.msg ? api.msg.substring(0, 1e3) : ''
      } catch (e) {
        api.msg = ''
      }

      retParam.sampling = api.api ? this.config.retCode[api.api] : 1
      retParam.api = api.api
      retParam.issucess = api.issuccess
      retParam.delay = typeof api.delay === 'number' ? parseInt(api.delay, 10) : new Date() - startTime
      retParam.msg = api.msg || (api.issuccess ? 'success' : 'fail')
      retParam.detail = api.detail || ''
      retParam.traceId = api.traceId || ''
      retParam = wpo.extend(api, retParam)
      delete retParam.issuccess
    } else {
      // 兼容老的接口
      try {
        msg = msg ? msg.substring(0, 1e3) : ''
      } catch (e) {
        msg = ''
      }

      retParam = wpo.extend({
        api: api,
        issucess: issuccess,
        delay: typeof delay === 'number' ? parseInt(delay, 10) : new Date() - startTime,
        msg: code || (issuccess ? 'success' : 'fail'),
        detail: msg || ''
      }, retParam)
    }

    if (typeof retParam.delay !== 'undefined' && typeof retParam.issucess !== 'undefined') {
      send(retParam, retParam.issucess ? retParam.sampling : 1)
    }
  }

  var sendSpeed = function sendSpeed () {
    var perParam = {
      type: 'speed'
    }
    var val

    for (var i = 0, len = wpo.speed.points.length; i < len; i++) {
      val = wpo.speed.points[i]

      if (val) {
        perParam['s' + i] = val
        wpo.speed.points[i] = null
      }
    }

    send(perParam)
  }
  /**
   * [speed description]
   * @param  {number} pos          [0/'s0',1/'s1',2/'s2'....10/'s10']
   * @param  {[int]} delay        [耗时，如果没有定义，这按照当前时间减去页面起始时间]
   * @param  {[boolean]} _immediately [内部使用，是否强制发送，不强制发送会尽量收集3s内的所有点的数据一次性发送]
   * @return {[void]}
   */

  wpo.speed = function (pos, delay, _immediately) {
    var sArr

    if (typeof pos === 'string') {
      pos = parseInt(pos.slice(1), 10)
    }

    if (typeof pos === 'number') {
      sArr = wpo.speed.points || new Array(11)
      sArr[pos] = typeof delay === 'number' ? delay > 86400000 ? delay - startTime : delay : new Date() - startTime

      if (sArr[pos] < 0) {
        sArr[pos] = new Date() - scriptStart
      }

      wpo.speed.points = sArr
    }

    clearTimeout(wpo.speed.timer)

    if (!_immediately) {
      wpo.speed.timer = setTimeout(sendSpeed, 3000)
    } else {
      sendSpeed()
    }
  }
  /**
   * [log 日志统计]
   * @param  {[string]} msg      [发送的内容]
   * @param  {[int]} sampling [可以自定义发送的抽样]
   * @return {[void]}
   */

  wpo.log = function (msg, sampling) {
    var param = {
      type: 'log',
      msg: msg
    }
    send(param, sampling)
  }
}

function browserPerformance (wpo, win, browserConf) {
  // performance初始数据
  var performanceData = {}

  try {
    // 首次尝试获取spm值
    performanceData.spm = wpo.getSpmId()
  } catch (e) {} // 页面已绑定的onerror事件

  var onErrorHandler = win.onerror
  var browser = {
    /**
     * 初始化浏览器端调用
     *
     * @return {void}
     */
    init: function init () {
      try {
        // 尝试启动上报
        this.lockPerformanceSpm() // 上报性能数据

        this.sendPerformance()
      } catch (e) {}

      this.bind() // debug模式

      if (wpo.config.debug) {
        wpo.config.sample = 1
        wpo.config.modVal = 1
        wpo.debug = true
        wpo.report = true
      }
    },

    /**
     * 事件绑定
     *
     * @return {void}
     */
    bind: function bind () {
      // unload
      wpo.on(win, 'beforeunload', function () {
        wpo.clear()

        if (wpo.speed.points) {
          wpo.speed(null, null, true)
        }
      }, true) // error处理

      win.onerror = function (msg, file, line, col, error) {
        if (onErrorHandler) {
          onErrorHandler(msg, file, line, col, error)
        }

        var stack = error && error.stack

        if (file) {
          wpo.error('sys', msg, file, line, col, stack)
        } else {
          wpo.error(msg)
        }
      }
    },

    /**
     * 获取performance性能数据
     *
     * @returns {{}}
     */
    analyzeTiming: function analyzeTiming () {
      var datas = {
        'rrt': ['responseStart', 'requestStart'],
        // 整个网络请求时间（不包括unload）
        'dns': ['domainLookupEnd', 'domainLookupStart'],
        // dns lookup
        'cnt': ['connectEnd', 'connectStart'],
        // 建立 tcp 时间 /tcp"
        'ntw': ['responseStart', 'fetchStart'],
        // network time / ttfb
        'dct': ['domContentLoadedEventStart', 'fetchStart'],
        // dom content loaded time
        'flt': ['loadEventStart', 'fetchStart'] // full load time 页面完全加载时间 /load
        // "flv": this._getFlashVersion(),

      }

      try {
        var timing = performance.timing

        for (var name in datas) {
          var start = timing[datas[name][1]]
          var end = timing[datas[name][0]] // 脏数据过滤: 部分浏览器,特别是移动端(如UC,windvane容器)某些时间点可能返回0或者null,排除掉此部分

          if (start && end) {
            var cost = end - start // 脏数据过滤: 耗时大于0并且小于1天(1e3 * 3600 * 24)

            if (cost >= 0 && cost < 86400000) {
              performanceData[name] = cost
            }
          }
        }

        var navigator = win.navigator
        var connection = navigator.connection
        /**
         * 获取网络连接类型 connection effectiveType
         * 例：slow-2g/2g/3g/4g
         * 目前只在 chrome 中能拿到数据
         */

        performanceData.ct = connection ? connection.effectiveType || connection.type : ''
      } catch (e) { // console.log('error');
      }

      return performanceData
    },

    /**
     * 在body标签完成渲染后,提前锁定测速上报的spm值
     *
     * @returns {void}
     */
    lockPerformanceSpm: function lockPerformanceSpm () {
      // 如果首次没有成功锁定spm,则在domReady后,再尝试在meta和body上取一次
      if (!performanceData.spm) {
        var lockSpm = function lockSpm () {
          var spm = browserConf && browserConf.getSpmId && browserConf.getSpmId()

          if (spm) {
            performanceData.spm = spm
          }
        }

        var ready = function ready () {
          if (document.readyState === 'complete') {
            lockSpm()
          } else if (document.addEventListener) {
            document.removeEventListener('DOMContentLoaded', ready, false)
            lockSpm()
          } else if (document.readyState === 'complete') {
            document.detachEvent('onreadystatechange', ready)
            lockSpm()
          }
        }

        if (document.addEventListener) {
          document.addEventListener('DOMContentLoaded', ready, false)
        } else if (document.attachEvent) {
          document.attachEvent('onreadystatechange', ready)
        }
      }
    },

    /**
     * 上报performance性能数据
     */
    sendPerformance: function sendPerformance () {
      var me = this // support log.js async loaded

      if (document.readyState === 'complete') {
        wpo.performance(me.analyzeTiming())
      } else {
        wpo.on(win, 'load', function () {
          wpo.performance(me.analyzeTiming())
        }, true)
      }
    }
  }
  browser.init()
}

// 页面事件监听 （暂不支持阻止冒泡事件）
const eventProxy = function (wpo) {
  const eventList = ['click'] //  监听的事件列表
  // 处理点击事件上传的数据
  const formatParmas = (parmas) => (
    { type: 'event', dataset: parmas.dataset }
  )
  const handleEvent = function (event) {
    if (event.path && event.path.length) {
      const clickItem = event.path.find(item =>
        // 判断冒泡过程中是否有定义click事件
        !!(item.__vue__ && item.__vue__._events && item.__vue__._events.click)
      )
      clickItem && wpo.send(formatParmas(clickItem))
    }
  }
  eventList.forEach(item => {
    document.body.addEventListener(item, handleEvent, true)
  })
}

// import serverConfig from './server-config'

var install = function install (win, name) {
  var wpo = win[name] || {}
  /**
   * browser环境下，如果已经初始化就不再重复初始化
   * 修改设置需要通过WPO.setConfig改变
   */

  if (wpo.__hasInitBlSdk) {
    return
  } // env设置

  wpo.env = 'browser'
  core(wpo, win, browserConf, name)

  var exec = function exec () {
    sampling(wpo)
    apis(wpo)
    browserPerformance(wpo, win, browserConf)
    eventProxy(wpo)
    wpo.__hasInitBlSdk = true
  }

  if (wpo.config.dynamic) ;

  {
    // 如使用document 初始化失败就尝试直接启动
    try {
      // support log.js async loaded
      if (document.readyState === 'complete') {
        wpo.ready()
      } else {
        wpo.on(win, 'load', function () {
          wpo.ready()
        }, true)
      }
    } catch (e) {
      try {
        wpo.ready()
      } catch (e) { // 无法启动成功
      }
    }
  }

  exec()
}

var appTrackOptions = {}
var index = {
  init: function init (conf, root) {
    var name = conf.name || 'logger' // 定义挂载对象 如空 使用 window

    if (!root) {
      install(window, name)
      window[name].setConfig(conf)
      return
    } // 定义挂载对象 不如空 且 window 环境，先初始化到window再挂载到自定义对象

    if (root && (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object') {
      install(root, name)
      root[name].setConfig(conf)
      return
    } // 定义挂载对象 不如空 且不等于 window 环境，初始化到自定义对象

    if (root && (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      install(window, name)
      window[name].setConfig(conf)
      root[name] = window[name]
      root[name].setConfig = window[name].setConfig
    }
  },
  customConfig: function customConfig(options) {
    appTrackOptions = options
  }
}

module.exports = index;
