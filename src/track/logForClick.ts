import WhatsElement from 'whats-element/pure'
import router from '../router'

const whats = new WhatsElement()

type EventMapOption = {
  alias?: string // 事件别名，如react中click事件为onClick
  includes?:string[] // 仅包含的标签
  excludes?:string[] // 不包含的标签
}
type EventMap = {
  [key:string]: EventMapOption
}
type FrameworkMapItem = {
  getRouter: Function // 获取当前路由path
  getEvent: Function // 获取event对象
  changeRouter?: Function // 页面切换钩子主要为了清空pathuuidMapList，也可以调用emptyUuid手动清空
}
type FrameworkMap = {
  [key:string]: FrameworkMapItem
}

const tools = {
  /**
   * 生成uuid
   */
  getUUID: () => {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  },
  /**
   * 获取元素在dom中的路径
   * @param {HTMLElement} ele
   */
  getElePath: (ele:HTMLElement) => whats.getUniqueId(ele).wid
}

const log = {
  pathuuidMapList: [] as any[],
  event: [] as string[],
  eventMap: {} as EventMap,
  defaultParams: {},
  frameworkMap: {} as FrameworkMapItem,
  init (eventMap: EventMap = { click: {} }, timer: number, framework:string = 'vue', frameworkMap:FrameworkMap = baseFrameworkMap) {
    if (!window.g_config.report) return
    this.frameworkMap = frameworkMap[framework]
    this.frameworkMap.changeRouter && this.frameworkMap.changeRouter()
    this.event = Object.keys(eventMap)
    this.eventMap = this.setAlias(eventMap)
    this.addEventListener(eventMap, timer)
    setTimeout(() => {
      window.logger && (window.logger.send = request.send.bind(window.logger))
      window.logger && (window.logger.query.stringify = request.stringify.bind(window.logger.query))
    }, 0)
  },
  /**
   * 页面事件监听 （不支持阻止冒泡事件）
   * @param {EventMap} eventMap 事件配置
   * @param {string} timer 防抖时间
   */
  addEventListener (eventMap: EventMap, timer: number) {
    let t:any = null
    const handleEvent = (event:any) => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (event.path && event.path.length) {
          // 判断冒泡过程中是否有定义需要监听的事件
          const clickItem = event.path.find((item:any) => {
            const eventDom = this.frameworkMap.getEvent(item)
            if (eventDom) {
              return Object.keys(eventDom).some((itmes:any) => {
                const eventOption = this.eventMap[itmes]
                if (eventOption) {
                  return this.analysisOption(eventOption, item)
                }
                return false
              })
            }
            return false
          })
          if (clickItem) {
            const parmas = this.formatParmas(this.getParmasUuid(clickItem))
            window.logger && window.logger.send(parmas)
          }
        }
      }, timer)
    }
    Object.keys(eventMap).forEach(item => {
      document.body.addEventListener(item, handleEvent, true)
    })
  },
  /**
   * 处理别名
   * @param {eventMap} eventMap
   */
  setAlias (eventMap: EventMap) {
    const obj:EventMap = {}
    Object.keys(eventMap).map(item => {
      const alias = eventMap[item].alias
      if (alias) {
        obj[alias] = { ...eventMap[item] }
      } else {
        obj[item] = { ...eventMap[item] }
      }
    })
    return obj
  },
  /**
   * 处理eventMap配置
   * @param {*} option
   * @param {HTMLElement} ele
   */
  analysisOption: (option:any, ele:HTMLElement):boolean => {
    // 不包含的标签
    if (option.excludes) {
      return !Array.from(ele.children).some((item:any) => option.excludes.includes(item.tagName.toLowerCase()))
    }
    // 仅包含的标签
    if (option.includes) {
      return Array.from(ele.children).some((item:any) => option.includes.includes(item.tagName.toLowerCase()))
    }
    return true
  },
  /**
   * 获取元素在dom中的路径
   * @param {string} uuid
   */
  formatParmas: (uuid:string) => ({ type: 'event', uuid }),
  /**
   * 判断上传uuid
   * @param {HTMLElement} ele
   */
  getParmasUuid (ele:HTMLElement) {
    const elePath = tools.getElePath(ele)
    const result = this.pathuuidMapList.find(item => item.path === elePath)
    if (result) {
      return result.uuid
    } else {
      const uuid = tools.getUUID()
      this.pathuuidMapList.push({
        path: elePath,
        uuid
      })
      return uuid
    }
  },
  /**
   * 设置自定义上传参数
   * @param {object} parmas
   */
  setDefaultParmas (parmas:{[key:string]:any}) {
    this.defaultParams = Object.assign(this.defaultParams, parmas)
  },
  emptyPathuuidMapList () {
    this.pathuuidMapList = []
  }
}

// 以下方法是暂时为了重写log里的方法,让数据格式一致
const request = {
  send: function (this:any, params: { spm: any; type: any }) {
    if (params && !this.config.disabled) {
      var spm = this.getSpmId() // 如果尚未设置过spm,并且成功获取到spm,则锁定spm值
      // 加入队列的时候即固定了此次上报的spm,方便SPA应用通过setConfig动态修改spm
      if (!params.spm && spm) {
        params.spm = spm
      }
      const type = params.type
      this.queue({
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().getTime(),
        url: window.location.origin + window.location.pathname,
        path: log.frameworkMap.getRouter(),
        ...log.defaultParams,
        ...params,
        type
      })
    }
  },
  /**
     * 对象转url字符串
     *
     * @param params
     * @returns {string}
     */
  stringify: function stringify (params:any) {
    var arr = []
    var str = '' // encodeURIComponent异常保护

    try {
      for (var _name2 in params) {
        // eslint-disable-next-line no-prototype-builtins
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
  }
}

// 默认的框架
export const baseFrameworkMap = {
  vue: {
    /**
     * 获取vue router
     * @param {*} item
     */
    getRouter: () => {
      try {
        const route:any = router
        return route.history.current.path
      } catch (e) {
        return window.location.pathname
      }
    },
    /**
     * 获取vue event对象
     * @param {*} item
     */
    getEvent: (item:any) => item.__vue__ && item.__vue__._events ? item.__vue__._events : null,
    changeRouter: () => {
      router.beforeEach((to: any, from: any, next: () => void) => {
        log.pathuuidMapList = []
        next()
      })
    }
  },
  react: {
    /**
     * 获取react router
     * @param {*} item
     */
    getRouter: () => {
      return window.location.pathname
    },
    /**
     * 获取react event对象
     * @param {*} item
     */
    getEvent: (item:any) => {
      const reactPropsKey = Object.keys(item).find(items => items.indexOf('__reactProps') > -1)
      if (reactPropsKey) {
        return item[reactPropsKey]
      }
      return false
    }
  }
}

type EventProxy = (eventMap: EventMap, timer: number, framework?:string, frameworkMap?:FrameworkMap) => void;
export const eventProxy:EventProxy = log.init.bind(log)
/**
 * 设置自定义上传参数
 * @param {object} parmas
 */
export const setDefaultParmas = log.setDefaultParmas.bind(log)
/**
 * 清空缓存的uuid，一般在路由钩子调用
 * @param {string} uuid
 */
export const emptyUuid = log.emptyPathuuidMapList.bind(log)
