import LocalStorage from 'store/dist/store.legacy.min.js'
import storage from 'store/storages/sessionStorage'
import * as types from './mutations_types'

const sessionStorage = LocalStorage.createStore(storage)

export default {
  /**
   * 更新用户拥有的菜单信息
   * @param state
   * @param user_menus  用户拥有的菜单信息
   */
  [types.UPDATE_USER_MENUS] (state, { menus }) {
    state.menus = menus
    LocalStorage.set('user_menus', state.menus)
  },

  /**
   * 移除用户拥有的菜单信息
   * @param state
   * @param user_menus  用户拥有的菜单信息
   */
  [types.REMOVE_USER_MENUS] (state) {
    state.menus = []
    LocalStorage.remove('user_menus')
  },

  /**
   * 更新用户拥有的区域
   * @param state
   */
  [types.UPDATE_USER_AREAS] (state, { areas }) {
    state.areas = areas
    LocalStorage.set('user_areas', state.areas)
  },

  /**
   * 移除用户拥有的区域
   * @param state
   */
  [types.REMOVE_USER_AREAS] (state) {
    state.area = []
    LocalStorage.remove('user_areas')
  },
  /**
   * 更新用户拥有的区域树
   * @param state
   */
  [types.UPDATE_USER_AREA_TREE] (state, { areaTree }) {
    state.areaTree = areaTree
    LocalStorage.set('user_area_tree', state.areaTree)
  },

  /**
   * 移除用户拥有的区域树
   * @param state
   */
  [types.REMOVE_USER_AREA_TREE] (state) {
    state.areaTree = []
    LocalStorage.remove('user_area_tree')
  },
  /**
   * 更新用户拥有的视角
   * @param state
   */
  [types.UPDATE_USER_VIEWS] (state, { views }) {
    state.views = views
    LocalStorage.set('user_views', state.views)
  },
  /**
   * 移除用户拥有的视角
   * @param state
   */
  [types.REMOVE_USER_VIEWS] (state) {
    state.views = []
    LocalStorage.remove('user_views')
  },
  /**
   * 更新用户当前的区域
   * @param state
   */
  [types.UPDATE_USER_AREA] (state, { area }) {
    state.area = area
    LocalStorage.set('user_area', state.area)
  },

  /**
   * 移除用户当前品牌视角信息
   * @param state
   * @param user_menus  用户拥有的品牌视角信息
   */
  [types.REMOVE_USER_AREA] (state) {
    state.area = []
    LocalStorage.remove('user_area')
  },
  /**
   * 更新是否记住密码
   * @param state
   * @param user_db 用户信息
   */
  [types.UPDATE_REMUMBER] (state, userDb) {
    state.remumber.remumber_flag = userDb.remumber_flag
    state.remumber.remumber_login_info = userDb.remumber_login_info
    sessionStorage.set('_nk_', `${userDb.remumber_login_info.companyName}/${userDb.remumber_login_info.nick}`)
    LocalStorage.set('remumber_flag', state.remumber.remumber_flag)
    LocalStorage.set('remumber_login_info', state.remumber.remumber_login_info)
  },

  /**
   * 移除记住密码功能
   * @param state
   */
  [types.REMOVE_REMUMBER] (state) {
    LocalStorage.remove('remumber_flag')
    LocalStorage.remove('remumber_login_info')

    state.remumber.remumber_flag = false
    state.remumber.remumber_login_info = {
      name: '',
      token: ''
    }
  },
  [types.UPDATE_COPYRIGHT_INFO] (state, data) {
    state.copyright_info = JSON.parse(JSON.stringify(data))
  }
}
