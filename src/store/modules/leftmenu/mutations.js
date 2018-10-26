import store from 'store/dist/store.legacy.min.js'
import * as types from './mutations_types'
import config from './config'

export default {
  [types.SET_MENU_OPEN] (state) {
    let conf = {width: config.width.open, top: config.top, menu_flag: true}
    state.width = conf.width
    state.menu_flag = conf.menu_flag
    store.set('menu_config', conf)
  },
  [types.SET_MENU_CLOSE] (state) {
    let conf = {width: config.width.close, top: config.top, menu_flag: false}
    state.width = conf.width
    state.menu_flag = conf.menu_flag
    store.set('menu_config', conf)
  },
  [types.SET_MENU_OPEN_FLAG] (state) {
    let conf = {width: config.width.close, top: config.top, menu_flag: true}
    state.menu_flag = conf.menu_flag
    store.set('menu_config', conf)
  },
  [types.SET_MENU_CLOSE_FLAG] (state) {
    let conf = {width: config.width.close, top: config.top, menu_flag: false}
    state.menu_flag = conf.menu_flag
    store.set('menu_config', conf)
  },
  [types.SET_MENU_INIT] (state) {
    let thatConf = store.get('menu_config')
    let conf = {width: config.width.open, top: config.top, menu_flag: config.menu_flag}
    if (thatConf && thatConf.width !== config.width.open && thatConf.width !== config.width.close) {
      state.width = conf.width
      state.top = conf.top
      state.menu_flag = conf.menu_flag
      store.set('menu_config', conf)
    }
  }
}
