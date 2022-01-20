import http from '@nascent/ecrp-ecrm/src/extends/http'
import api from '@/apis'
import * as types from './mutations_types'

export default {
  update_user_area: ({ commit }, {
    area
  }) => {
    return new Promise((resolve) => {
      commit(types.UPDATE_USER_AREA, {
        area
      })
      resolve()
    })
  },
  remove_user_area: ({ commit }) => {
    return new Promise((resolve) => {
      commit(types.REMOVE_USER_AREA)
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
      http.fetch(api.core.access.getUserInfo).then((data) => {
        // 登录成功之后，验证是否记住密码，如果记住密码，本地保存记住信息
        commit(types.UPDATE_REMUMBER, {
          remumber_flag: true,
          remumber_login_info: {
            openWechat: data.openWechat,
            openAhd: data.openAhd,
            companyName: data.companyName,
            productConfig: data.productConfig,
            name: data.name,
            nick: data.nick,
            token: data.token,
            lastCheckTime: new Date().getTime(),
            productCode: data.productCode,
            dataAuth: data.dataAuth,
            dataUrl: data.dataUrl,
            ecrmUrl: data.ecrmUrl,
            cloudUrl: data.cloudUrl,
            routerAuth: data.routerAuth,
            applicationType: data.applicationType + '',
            uiLockBtnEnable: data.uiLockBtnEnable,
            platformInfoMap: data.platformInfoMap,
            openGroupOperation: data.openGroupOperation,
            customerOrderShowType: data.customerOrderShowType,
            viewRange: data.viewRange,
            // 会员管理方案设置:1企业微信方案;2个人号方案
            memberManagePlan: data.memberManagePlan,
            // 企业类型
            companyType: data.companyType,
            // 第三方菜单
            thirdMenus: data.thirdMenus,
            themeType: data.themeType,
            homeUrl: data.homeUrl,
            // 是否一个【区域/店铺】绑定多个雁书账号
            bindMultYsAccount: data.bindMultYsAccount
          }
        })
        // 菜单初始化
        commit(types.UPDATE_USER_MENUS, {
          menus: data.menus
        })
        // 区域初始化
        commit(types.UPDATE_USER_AREAS, {
          areas: data.areas
        })
        // 区域初始化
        commit(types.UPDATE_USER_AREA_TREE, {
          areaTree: data.areaTree
        })
        // 视角初始化
        commit(types.UPDATE_USER_VIEWS, {
          views: data.views
        })
        // 当前视角初始化
        commit(types.UPDATE_USER_AREA, {
          area: data.area
        })
        /* 设置版权 / 备案信息 */
        if (data.copyrightInfo) {
          const infos = [{
            name: data.copyrightInfo.domain,
            path: data.copyrightInfo.domainUrl
          },
          {
            name: data.copyrightInfo.icpName,
            path: data.copyrightInfo.icpUrl
          },
          {
            name: data.copyrightInfo.publicName,
            path: data.copyrightInfo.publicUrl
          }
          ]
          commit(types.UPDATE_COPYRIGHT_INFO, {
            isShow: true,
            info: infos
          })
        } else {
          commit(types.UPDATE_COPYRIGHT_INFO, {
            isShow: false,
            info: []
          })
        }
        resolve(state)
      }).catch((data) => {
        reject(data)
      })
    })
  },
  /**
   * 删除登陆权限
   * @param commit
   * @param state
   * @returns {Promise<any>}
   */
  logout: () => {
    return new Promise((resolve, reject) => {
      http.fetch(api.core.access.exit).then((resp) => {
        window.location.href = resp.result ? resp.result : '/casLogin'
      }).catch(reject)
    })
  },
  regainSession: () => {
    let url = '/casLogin'
    const params = window.location.search
    url += params
    if (params.indexOf('router=') === -1) {
      url += (encodeURIComponent(params) ? '&' : '?') + 'router=' + encodeURIComponent(window.location.pathname)
    }
    window.location.href = url
  },
  /* 设置隐藏底部版权 */
  setCopyRightInfoUnShow: ({ commit }) => {
    return new Promise((resolve) => {
      commit(types.UPDATE_COPYRIGHT_INFO, {
        isShow: false
      })
      resolve()
    })
  }
}
