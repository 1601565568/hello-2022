export default {
  queryTableList: {
    url: '/guide/material/queryTableList',
    method: 'post'
  },
  saveMaterial: {
    url: '/guide/material/saveMaterial',
    method: 'post'
  },
  deleteMaterialById: {
    url: '/guide/material/deleteMaterialById',
    method: 'get'
  },
  uploadImage: {
    url: '/core/file/upload/module=material',
    method: 'post'
  },
  batchEditSub: {
    url: '/guide/material/batchEditSub',
    method: 'post'
  },
  queryMaterials: {
    url: '/guide/material/queryMaterials',
    method: 'get'
  },
  batchDeleteMaterial: { // 素材批量删除
    url: '/guide/material/batchDeleteMaterial',
    method: 'post'
  },
  findMallMarketingList: { // 查询商城营销活动列表
    url: '/guide/marketing/findMallMarketingList',
    method: 'post'
  },
  getGoodsCategory: { // 查询商品分类
    url: '/guide/goods/getGoodsCategory',
    method: 'get'
  },
  findMallGoodsList: { // 查询商城营销活动列表
    url: '/guide/goods/findMallGoodsList',
    method: 'post'
  },
  findShopGoodsList: { // 查询商城营销活动列表
    url: '/guide/goods/findShopGoodsList',
    method: 'post'
  },
  /**
   * @msg: 查询商品库列表
   */
  findGoodBankList: {
    url: '/guide/goods/findGoodBankList',
    method: 'get'
  },
  // 获取客道下素材库创建人筛选信息
  getCreator: {
    url: '/guide/material/getCreator',
    method: 'post'
  }
}
