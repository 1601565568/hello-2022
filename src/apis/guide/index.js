import guide from './guide'
import shop from './shop'
import material from './materials'
import materialSubdivision from './materialsubdivision'
import activityCoupon from './activityCoupon'
import assets from './assets'
import goods from './goods'
import sgwxaccount from './sgwxaccount'
import marketing from './marketing'
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
  // 所有导购模块全部整合在此
  comGetBrandForShopList: {// 获取品牌下的店铺
    url: '/core/sgshop/getBrandList',
    method: 'get'
  },
  materialList: {
    // 素材列表
    url: '/guide/material/findList',
    method: 'post'
  },
  materialEdit: {
    // 素材编辑
    url: '/guide/material/saveOrUpdate',
    method: 'post'
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
  }
}
