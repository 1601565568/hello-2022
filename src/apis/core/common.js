import MenuDev from 'configs/menu.dev.json'
import transData from 'utils/transData'
const treeFn = (err, rows) => {
  if (err) throw err
  // get all data
  // create a id= null root for forest 新建id为null的对象做为森林的根
  var result = [{'id': '0', 'children': []}]
  var allMenu = rows
  var output = getAllChild(result)
  return output

  // find some item all child   // 方便阅读依然放上此方法
  function findItemChild (item) {
    var arrayList = []
    for (var i in allMenu) {
      if (allMenu[i].parent === item.id) {
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
  login: {
    url: '/core/access/login',
    method: 'post',
    callback: function (res, resolve, reject) {
      if (res.data.success) {
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
          // 在开启环境追加页面原型菜单
          // if (process.env.NODE_ENV !== 'production') {
          res.data.result.menus.push(MenuDev)
          // }
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
        res.data.result.name = res.data.result.loginAccount
        res.data.result.nick = res.data.result.userName
        resolve(res.data.result)
      } else {
        reject(res.data)
      }
    },
    transformRequest: transData
  },
  queryAreaAll: {
    url: '/core/common/queryAreaTree4Component',
    method: 'get',
    callback: function (res, resolve, reject) {
      resolve(res.data.result[0].children)
    }
  },
  querySmsPlaceholder: {
    url: '/core/common/querySmsPlaceholderList',
    method: 'get'
  },
  getWxTemplateList: {
    url: '/core/common/getWxTemplateList',
    method: 'get'
  },
  queryBrandOptions: {
    url: '/core/common/queryBrandOptions',
    method: 'get'
  },
  queryProvince: {
    url: '/core/common/queryProvince',
    method: 'get'
  },
  loadSubdivisionTree: {
    url: '/core/common/loadSubdivisionTree',
    method: 'get'
  },
  getKdCouponOptionsMapByShop: {
    url: '/core/common/getKdCouponOptionsMapByShop',
    method: 'get'
  },
  getSmsSignatures: {
    url: '/core/common/getSmsSignatures',
    method: 'get'
  },
  getMarketingTemplateOptions: {
    url: '/core/common/getMarketingTemplateOptions',
    method: 'get'
  },
  getMarketingTemplateById: {
    url: '/marketing/activitiesdesign/getMarketingTemplateById',
    method: 'get'
  },
  getPointActivityOptions: {
    url: '/core/common/getPointActivityOptions',
    method: 'get'
  },
  getWxAccountOptions: {
    url: '/core/common/getWxAccountOptions',
    method: 'get'
  },
  querySubdivisionCustomerNum: {
    url: '/core/common/querySubdivisionCustomerNum',
    method: 'get'
  },
  getTopCouponOptions: {
    url: '/core/common/getTopCouponOptions',
    method: 'get'
  },
  getUmpActivitiesOptionsMapByShop: {
    url: '/core/common/getUmpActivitiesOptionsMapByShop',
    method: 'get'
  },
  createShortLink: {
    url: '/marketing/activitiesdesign/createShortLink',
    method: 'get'
  },
  // 交易状态
  getTradeStatus: {
    url: '/core/common/getTradeStatus',
    method: 'get'
  },
  getTradeType: {
    url: '/core/common/getTradeType',
    method: 'get'
  },
  // 交易来源
  getTradeFrom: {
    url: '/core/common/getTradeFrom',
    method: 'get'
  },
  // 等级数据
  getGradeOptions: {
    url: '/core/common/getGradeOptions',
    method: 'get'
  },
  // 地区树
  queryAreaTree4Component: {
    url: '/core/common/queryAreaTree4Component',
    method: 'post'
  },
  // 渠道树
  queryChannelTree4Component: {
    url: '/core/common/queryChannelTree4Component',
    method: 'post'
  },
  // 查询商品表格
  queryGoodsTable4Component: {
    url: '/core/common/queryGoodsTable4Component',
    method: 'post'
  },
  // 平台
  queryPlatForm: {
    url: '/core/common/queryPlatForm',
    method: 'get'
  },
  // 获取关怀类型
  queryCareType: {
    url: '/core/common/getCareTypes',
    method: 'get'
  },
  // 分组树
  querySubdivisionTree: {
    url: '/core/common/loadSubdivisionTree',
    method: 'get'
  },
  // 雁书短信占位符信息
  getYsSmsSplitInfo: {
    url: '/core/common/getYsSmsSplitInfo',
    method: 'get'
  },
  // 雁书账号信息
  getYsAccountInfo: {
    url: '/core/common/getYsAccountInfo',
    method: 'get'
  },
  queryNoDistrictAreaTree: {
    url: '/core/common/queryNoDistrictAreaTree',
    method: 'get'
  },
  // 查询淘宝店铺商品表格
  queryTableByTopItem: {
    url: '/core/common/queryTableByTopItem',
    method: 'post'
  },
  // 查询淘宝店铺商品表格
  getTopItemCategoryList: {
    url: '/core/common/getTopItemCategoryList',
    method: 'get'
  },
  // 创建导出任务
  createExportTask: {
    url: '/core/common/createExportTask',
    method: 'post'
  },
  queryShopListForTopByBrand: {
    url: '/core/common/getTopShop4Options',
    method: 'post'
  },
  getShopByIds: {
    url: '/core/common/getShopByIds',
    method: 'get',
    transformRequest: transData
  },
  querySysShopOptions: {
    url: '/core/common/getSysShop4Options',
    method: 'get'
  },
  // 获取淘宝店铺信息
  getTopShopData4Options: {
    url: '/core/common/getTopShop4Options',
    method: 'get'
  },
  // 获取所有店铺信息
  getSysShopData4Options: {
    url: '/core/common/getSysShop4Options',
    method: 'get'
  },
  // 查询店铺分页表格数据
  queryShopTable4Component: {
    url: '/core/common/getShopTable4Component',
    method: 'post'
  }
}
