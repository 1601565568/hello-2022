import transData from 'web-crm/src/utils/transData'
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
    url: '/getSession',
    method: 'post',
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
    url: '/operate/login',
    method: 'post'
  },
  exit: {
    url: '/core/access/exit',
    method: 'get'
  },
  getCloudPlatformAddress: {
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

  }

}
