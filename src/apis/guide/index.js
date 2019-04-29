import guide from './guide'
import shop from './shop'
import material from './materials'
import materialSubdivision from './materialsubdivision'
import activityCoupon from './activityCoupon'
import assets from './assets'
import goods from './goods'
import sgwxaccount from './sgwxaccount'
import marketing from './marketing'
import task from './task'
import quicklyword from './quicklyword'
export default {
  guide,
  shop,
  material,
  materialSubdivision,
  activityCoupon,
  assets,
  goods,
  sgwxaccount,
  marketing,
  task,
  quicklyword,
  // 所有导购模块全部整合在此
  comGetBrandForShopList: {// 获取品牌下的店铺
    url: '/core/sgshop/getBrandList',
    method: 'get'
  },
  materialList: {
    // 素材列表
    url: '/guide/material/findMaterialList',
    method: 'post'
  },
  materialEdit: {
    // 素材编辑
    url: '/guide/material/saveMaterial',
    method: 'post'
  },
  queryMaterial: {
    // 素材编辑
    url: '/guide/material/queryMaterial',
    method: 'get'
  },
  materialDel: {
    // 素材删除
    url: '/guide/material/delete',
    method: 'post'
  },
  materialSetGroud: {
    // 素材设置分组
    url: '/guide/material/setSubdivision',
    method: 'post'
  },
  materialExchangeSort: {
    // 素材设置分组
    url: '/guide/material/exchangeSort',
    method: 'post'
  },
  materialFindListByBrandId: {
    // 素材列表--简洁版
    url: '/guide/material/findListByBrandId',
    method: 'post'
  },
  materialGroudList: {
    // 素材分组列表
    url: '/guide/material/findSubdivisionList',
    method: 'post'
  },
  materialGroudDeit: {
    // 素材分组编辑
    url: '/guide/material/saveOrUpdateSubdivision',
    method: 'post'
  },
  materialGroudDel: {
    // 素材分组删除
    url: '/guide/material/deleteSubdivision',
    method: 'post'
  },
  materialGroudListAll: {
    // 素材分组列表不分页
    url: '/guide/material/findSubdivisionAll',
    method: 'post'
  },
  // 任务模块开始
  taskList: {
    // 查询品牌任务列表
    url: '/guide/task/findList',
    method: 'post'
  },
  taskEdit: {
    // 品牌任务编辑
    url: '/guide/task/saveOrUpdateTask',
    method: 'post'
  },
  taskQueryTaskShopInfo: {
    // 品牌任务--指派门店详情
    url: '/guide/task/queryTaskShopInfo',
    method: 'post'
  },
  taskBrandDel: {
    // 品牌任务--删除
    url: '/guide/task/deleteTask',
    method: 'get'
  },
  taskUpdateState: {
    // 修改任务状态
    url: '/guide/task/updateTaskState',
    method: 'post'
  },
  taskShopList: {
    // 门店任务列表
    url: '/guide/task/findShopList',
    method: 'post'
  },
  taskQueryShopGuideList: {
    // 门店任务详情
    url: '/guide/task/queryShopGuideList',
    method: 'post'
  },
  queryShopTaskExecution: {
    // 门店任务详情新
    url: '/guide/task/queryShopTaskExecution',
    method: 'post'
  },
  // 快捷话术分组列表
  findQuicklyWordGroupList: {
    url: '/guide/quicklyword/findQuicklyWordGroupList',
    method: 'post'
  },
  // 快捷话术列表查询
  findQuicklyWordList: {
    url: '/guide/quicklyword/findQuicklyWordList',
    method: 'post'
  },
  // 快捷话术新增编辑
  saveOrUpdateQuicklyWord: {
    url: '/guide/quicklyword/saveOrUpdateQuicklyWord',
    method: 'post'
  },
  // 查找快捷话术当前用户名
  findAddName: {
    url: '/guide/quicklyword/findAddName',
    method: 'post'
  },
  // 快捷话术删除
  deleteQuicklyWord: {
    url: '/guide/quicklyword/deleteQuicklyWord',
    method: 'post'
  },
  // 快捷话术删除
  patchDeleteQuicklyWord: {
    url: '/guide/quicklyword/patchDeleteQuicklyWord',
    method: 'post'
  },
  // 快捷话术排序
  updateQuicklyWordSort: {
    url: '/guide/quicklyword/updateQuicklyWordSort',
    method: 'post'
  },
  // 快捷话术分组新增编辑
  saveOrUpdateQuicklyWordGroup: {
    url: '/guide/quicklyword/saveOrUpdateQuicklyWordGroup',
    method: 'post'
  },
  // 快捷话术分组删除
  deleteQuicklyWordGroup: {
    url: '/guide/quicklyword/deleteQuicklyWordGroup',
    method: 'post'
  },
  // 快捷话术分组排序
  updateQuicklyWordGroupSort: {
    url: '/guide/quicklyword/updateQuicklyWordGroupSort',
    method: 'post'
  },
  // 快捷话术批量编辑
  patchChange: {
    url: '/guide/quicklyword/patchChang',
    method: 'post'
  },
  // 拖拽修改快捷话术分组顺序
  changeQuicklyWordGroupSort: {
    url: '/guide/quicklyword/changeQuicklyWordGroupSort',
    method: 'post'
  }

}
