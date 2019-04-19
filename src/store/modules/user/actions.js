import http from '../../../extends/http'
import api from '../../../apis'
import * as types from './mutations_types'

export default {
  update_user_brand: ({ commit }, { brand }) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_USER_BRAND, {
        brand
      })
      resolve()
    })
  },
  remove_user_brand: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(types.REMOVE_USER_BRAND)
      resolve()
    })
  },
  /**
   * 验证登陆权限
   * @param commit
   * @param state
   * @returns {Promise<any>}
   */
  login: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      // if (new Date().getTime() - state.remumber.remumber_login_info.lastCheckTime > 60 * 1000) {
      // console.log('验证登陆已超过60秒，重新远程验证')
      http
        .fetch(api.core.access.getSession)
        .then(data => {
          // 登录成功之后，验证是否记住密码，如果记住密码，本地保存记住信息
          commit(types.UPDATE_REMUMBER, {
            remumber_flag: true,
            remumber_login_info: {
              name: data.name,
              nick: data.nick,
              token: data.token,
              lastCheckTime: new Date().getTime()
            }
          })
          // 菜单初始化
          commit(types.UPDATE_USER_MENUS, {
            menus: data.menus
          })
          // 视角初始化
          commit(types.UPDATE_USER_BRANDS, {
            brands: data.brands
          })
          // 当前视角初始化
          commit(types.UPDATE_USER_BRAND, {
            brand: data.brand
          })

          resolve(state)
        })
        .catch(data => {
          reject(data)
        })
      // } else {
      //   resolve(state)
      // }
    })
  },
  /**
   * 删除登陆权限
   * @param commit
   * @param state
   * @returns {Promise<any>}
   */
  logout: ({ commit }) => {
    return new Promise((resolve, reject) => {
      http
        .fetch(api.core.access.exit)
        .then(resp => {
          // commit(types.REMOVE_REMUMBER)
          // commit(types.REMOVE_USER_MENUS)
          // commit(types.REMOVE_USER_BRANDS)
          // commit(types.REMOVE_USER_BRAND)
          window.location.href = resp.result ? resp.result : '/casLogin'
          resolve(resp)
        })
        .catch(reject)
    })
  },
  regainSession: ({ commit }) => {
    window.location.href =
      '/casLogin?router=' +
      encodeURIComponent(window.location.pathname + window.location.search)
    // return new Promise((resolve, reject) => {
    //   commit(types.UPDATE_LOGIN_REFRESH, true)
    //   commit(types.REMOVE_REMUMBER)
    //   commit(types.REMOVE_USER_MENUS)
    //   commit(types.REMOVE_USER_BRANDS)
    //   commit(types.REMOVE_USER_BRAND)
    //   window.location.href = '/casLogin'
    //   resolve()
    // })
  }
}
