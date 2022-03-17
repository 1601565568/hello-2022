import WhatsElement from 'whats-element/pure'
import router from '../router'
const whats = new WhatsElement()
let pathuuidMapList:any[] = []

type EventMapOption = {
  includes?:String[] // 仅包含的标签
  excludes?:String[] // 不包含的标签
}
type EventMap = {
  [key:string]: EventMapOption
}

/**
 * vue页面事件监听 （不支持阻止冒泡事件）
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
          const clickItem = event.path.find((item:any) => {
            // 判断冒泡过程中是否有定义需要监听的事件
            const vueEvent = getVueEvent(item)
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
            window.logger.send(parmas)
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

/**
 * 获取vue event对象
 */
const getVueEvent = (item:any) => item.__vue__ && item.__vue__._events ? item.__vue__._events : null

/**
 * 处理eventMap配置
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
 * @param {String} uuid
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

router.beforeEach((to, from, next) => {
  pathuuidMapList = []
  next()
})
