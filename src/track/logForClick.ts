import WhatsElement from 'whats-element/pure'
import router from '../router'

const whats = new WhatsElement()
let pathuuidMapList:any[] = []
let defaultParams = {}

type EventMapOption = {
  includes?:string[] // 仅包含的标签
  excludes?:string[] // 不包含的标签
}
type EventMap = {
  [key:string]: EventMapOption
}

/**
 * 页面事件监听 （不支持阻止冒泡事件）
 * @param {EventMap} eventMap 事件配置
 * @param {string} timer 防抖时间
 */
export const eventProxy = (eventMap:EventMap = { click: {} }, timer:number) => {
  if (!window.g_config.report) return
  try {
    let t:any = null
    const handleEvent = function (event:any) {
      clearTimeout(t)
      t = setTimeout(() => {
        if (event.path && event.path.length) {
          // 判断冒泡过程中是否有定义需要监听的事件
          const clickItem = event.path.find((item:any) => {
            const vueEvent = getVueEvent(item) // vue的event对象
            if (vueEvent) {
              return Object.keys(vueEvent).some(itmes => {
                const eventOption = eventMap[itmes]
                if (eventOption) {
                  return analysisOption(eventOption, item)
                }
                return false
              })
            }
            return false
          })
          if (clickItem) {
            const parmas = formatParmas(getParmasUuid(clickItem))
            window.logger.send({ ...parmas, ...defaultParams })
          }
        }
      }, timer)
    }
    Object.keys(eventMap).forEach(item => {
      document.body.addEventListener(item, handleEvent, true)
    })
  } catch (e) {
  }
}
export const setDefaultParmas = (parmas:{[key:string]:any}) => {
  defaultParams = Object.assign(defaultParams, parmas)
}

/**
 * 处理eventMap配置
 * @param {*} option
 * @param {HTMLElement} ele
 */
const analysisOption = (option:any, ele:HTMLElement):boolean => {
  // 不包含的标签
  if (option.excludes) {
    return !Array.from(ele.children).some((item:any) => option.excludes.includes(item.tagName.toLowerCase()))
  }
  // 仅包含的标签
  if (option.includes) {
    return Array.from(ele.children).some((item:any) => option.includes.includes(item.tagName.toLowerCase()))
  }
  return true
}

/**
 * 获取元素在dom中的路径
 * @param {HTMLElement} ele
 */
const getElePath = (ele:HTMLElement) => whats.getUniqueId(ele).wid

/**
 * 判断上传uuid
 * @param {HTMLElement} ele
 */
const getParmasUuid = (ele:HTMLElement) => {
  const elePath = getElePath(ele)
  const result = pathuuidMapList.find(item => item.path === elePath)
  if (result) {
    return result.uuid
  } else {
    const uuid = getUUID()
    pathuuidMapList.push({
      path: elePath,
      uuid
    })
    return uuid
  }
}

/**
 * 获取元素在dom中的路径
 * @param {string} uuid
 */
const formatParmas = (uuid:string) => ({ type: 'event', uuid })

/**
 * 生成uuid
 */
const getUUID = () => {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/**
 * log里组装的数据和想要的不同，暂时通过重写替换window.logger.send方法
 *
 */
const send = function (this:any, params: { spm: any; type: any }) {
  if (params && !this.config.disabled) {
    var spm = this.getSpmId() // 如果尚未设置过spm,并且成功获取到spm,则锁定spm值
    // 加入队列的时候即固定了此次上报的spm,方便SPA应用通过setConfig动态修改spm

    if (!params.spm && spm) {
      params.spm = spm
    }
    const type = params.type
    this.queue({
      // appType: appEnv.getWebDev(),
      // appEnv: appEnv.getAppEnv(),
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().getTime(),
      url: window.location.origin + window.location.pathname,
      path: getVueRouter(),
      ...defaultParams,
      ...params,
      type
    })
  }
}
setTimeout(() => {
  window.logger.send = send.bind(window.logger)
}, 0)

/**
 * 获取vue event对象
 * @param {*} item
 */
const getVueEvent = (item:any) => item.__vue__ && item.__vue__._events ? item.__vue__._events : null

/**
 * 获取vue router
 * @param {*} item
 */
const getVueRouter = () => {
  try {
    return router.history.current.path
  } catch (e) {
    return window.location.pathname
  }
}

router.beforeEach((to, from, next) => {
  pathuuidMapList = []
  next()
})
