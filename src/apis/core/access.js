import transData from '@nascent/ecrp-ecrm/src/utils/transData'
import store from '@/store'
import LocalStorage from 'store/dist/store.legacy.min.js'
const treeFn = (err, rows) => {
  if (err) { throw err }
  // get all data
  // create a id= null root for forest 新建id为null的对象做为森林的根
  var result = [{ 'id': '0', 'children': [] }]
  var allMenu = rows
  var output = getAllChild(result)
  return output

  // find some item all child   // 方便阅读依然放上此方法
  function findItemChild (item) {
    var arrayList = []
    for (var i in allMenu) {
      if (Number(allMenu[i].parent) === Number(item.id)) {
        arrayList.push(allMenu[i])
      }
    }
    return arrayList
  }

  // get all child          // 方便阅读依然放上此方法
  function getAllChild (array) {
    var childList = findItemChild(array[0])
    if (childList == null) {
      return []
    } else {
      for (var j in childList) {
        childList[j].children = []
        childList[j].children = getAllChild([childList[j]])
      }
      array[0].children = childList
    }
    return childList
  }
}
export default {
  getUserInfo: {
    cancelToken: false,
    url: '/getSession',
    method: 'post',
    callback: function (res, resolve, reject) {
      //  由于remumber_login_info在node包里生成，只能重新记录一下
      // let user = {
      //   nick: res.data.result.userName? JSON.parse(JSON.stringify(res.data.result.userName)) : '',
      //   nickId: res.data.result.userId? JSON.parse(JSON.stringify(res.data.result.userId))
      // }
      // LocalStorage.set('user', user)
      if (res.data.success) {
        const jsonResult = JSON.parse(JSON.stringify(res.data.result))
        let user = {
          nick: jsonResult.userName || '',
          nickId: jsonResult.userId || '',
          groupId: jsonResult.groupId || 0
        }
        const productConfig = res.data.result.productConfig || {}
        res.data.result = {
          integralActivityUrl: res.data.result.integralActivityUrl,
          openDmWechat: res.data.result.openDmWechat,
          openWechat: res.data.result.openWechat,
          openAhd: res.data.result.openAhd,
          companyName: res.data.result.companyName,
          name: res.data.result.loginAccount,
          nick: res.data.result.userName,
          menus: res.data.result.menus,
          areas: res.data.result.areas,
          areaTree: res.data.result.areaTree,
          views: res.data.result.views,
          // 拓展字段
          productConfig: {
            ...productConfig,
            wxPlan: res.data.result.wxPlan,
            user,
            viewRange: res.data.result.viewRange || 2, // 1-不同品牌不同视角，2-不同区域不同视角
            openGroupOperation: res.data.result.openGroupOperation || 0, // 是否是集团运营
            groupViewId: res.data.result.groupViewId,
            brands: res.data.result.brands,
            viewId: '' // 已选的视角id
          },
          area: {
            id: res.data.result.currentArea.areaId,
            name: res.data.result.currentArea.areaName,
            areaType: res.data.result.currentArea.areaType,
            isHyt: res.data.result.isHyt,
            gradeRuleStatus: res.data.result.gradeRuleStatus
          },
          productCode: res.data.result.productCode,
          dataAuth: res.data.result.dataAuth,
          routerAuth: res.data.result.menus,
          cloudUrl: res.data.result.cloudUrl,
          copyrightInfo: res.data.result.copyrightInfo,
          uiLockBtnEnable: res.data.result.uiLockBtnEnable
        }

        if (res.data.result.menus.length > 0) {
          res.data.result.menus = treeFn(null, res.data.result.menus.map((v) => {
            return {
              path: v.url ? v.url : '',
              name: v.code,
              title: v.name,
              icon: v.icon ? v.icon : '',
              parent: v.parentId,
              id: v.id
            }
          }))
          // 默认跳转到第子级第一个菜单
          res.data.result.menus.map((item) => {
            if (item.children.length > 0) {
              item.children.map((subItem) => {
                if (subItem.children.length > 0 && subItem.children[0].path) {
                  subItem.path = subItem.children[0].path
                }
                return subItem
              })
              item.path = item.children[0].path
            }

            return item
          })
        }

        resolve(res.data.result)
      } else {
        reject(res.data)
      }
    },
    transformRequest: transData
  },
  hasLoginAccountExist: {
    url: '/core/access/hasLoginAccountExist',
    method: 'get'
  },
  getCloudSession: {
    cancelToken: false,
    url: '/operate/getSession',
    method: 'get',
    callback: function (res, resolve, reject) {
      if (res.data.success) {
        res.data.result = {
          name: res.data.result.loginAccount,
          nick: res.data.result.userName,
          menus: res.data.result.menus,
          brands: res.data.result.views,
          brand: {
            id: res.data.result.currentView.viewId,
            name: res.data.result.currentView.viewName,
            brandType: res.data.result.currentView.viewType
          }
        }
        if (res.data.result.menus.length > 0) {
          res.data.result.menus = treeFn(null, res.data.result.menus.map((v) => {
            return {
              path: v.url ? v.url : '',
              name: v.code,
              title: v.name,
              icon: v.icon ? v.icon : '',
              parent: v.parent_id,
              id: v.id
            }
          }))
          // 默认跳转到第子级第一个菜单
          res.data.result.menus.map((item) => {
            if (item.children.length > 0) {
              item.children.map((subItem) => {
                if (subItem.children.length > 0 && subItem.children[0].path) {
                  subItem.path = subItem.children[0].path
                }
                return subItem
              })
              item.path = item.children[0].path
            }
            return item
          })
        }

        resolve(res.data.result)
      } else {
        reject(res.data)
      }
    }
  },
  operateLogin: {
    cancelToken: false,
    url: '/operate/login',
    method: 'post'
  },
  exit: {
    cancelToken: false,
    url: '/core/access/exit',
    method: 'get'
  },
  getCloudPlatformAddress: {
    cancelToken: false,
    url: '/getCloudPlatformAddress',
    method: 'get'
  },
  saveOrUpdateMenu: {
    url: '/operate/action/saveOrUpdateMenu',
    method: 'post'
  },
  deleteMenu: {
    url: '/operate/action/deleteMenu',
    method: 'get'
  },
  getListSession: {
    url: '/operate/getSession',
    method: 'get'

  },
  changeArea: {
    cancelToken: false,
    url: '/core/access/changeView',
    method: 'get'
  }
}
