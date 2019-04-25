import LocalStorage from 'store/dist/store.legacy.min.js'

import * as types from './mutations_types'

export default {
  /**
   * 更新用户拥有的菜单信息
   * @param state
   * @param operate_menus  用户拥有的菜单信息
   */
  UPDATE_OPERATE_MENUS (state, { menus }) {
    state.menus = menus
    LocalStorage.set('operate_menus', state.menus)
  },

  /**
   * 移除用户拥有的菜单信息
   * @param state
   * @param operate_menus  用户拥有的菜单信息
   */
  [types.REMOVE_OPERATE_MENUS] (state) {
    state.menus = []
    LocalStorage.remove('operate_menus')
  },

  /**
   * 更新用户拥有的品牌视角信息
   * @param state
   * @param operate_menus  用户拥有的品牌视角信息
   */
  [types.UPDATE_OPERATE_BRANDS] (state, { brands }) {
    state.brands = brands
    LocalStorage.set('operate_brands', state.brands)
  },

  /**
   * 移除用户拥有的品牌视角信息
   * @param state
   * @param operate_menus  用户拥有的品牌视角信息
   */
  [types.REMOVE_OPERATE_BRANDS] (state) {
    state.brands = []
    LocalStorage.remove('operate_brands')
  },
  /**
   * 更新用户当前的品牌视角信息
   * @param state
   * @param operate_menus  用户拥有的品牌视角信息
   */
  [types.UPDATE_OPERATE_BRAND] (state, { brand }) {
    state.brand = brand
    LocalStorage.set('operate_brand', state.brand)
  },

  /**
   * 移除用户当前品牌视角信息
   * @param state
   * @param operate_menus  用户拥有的品牌视角信息
   */
  [types.REMOVE_OPERATE_BRAND] (state) {
    state.brand = []
    LocalStorage.remove('operate_brand')
  },
  /**
   * 更新是否记住密码
   * @param state
   * @param operate_db 用户信息
   */
  [types.UPDATE_REMUMBER] (state, operateDb) {
    state.remumber.remumber_flag = operateDb.remumber_flag
    state.remumber.remumber_login_info = operateDb.remumber_login_info

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
  }
}
