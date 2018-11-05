export default {
  // 品牌商品列表分页查询
  findGoodsList: {
    url: '/guide/goods/findList',
    method: 'post'
  },
  // 品牌商品新增
  saveGoods: {
    url: '/guide/goods/save',
    method: 'post'
  },
  getInfo: {
    url: '/guide/goods/getInfo',
    method: 'post'
  },
  saveDetail: {
    url: '/guide/goods/saveDetail',
    method: 'post'
  },
  getDetail: {
    url: '/guide/goods/getDetail',
    method: 'post'
  },
  // 删除品牌商品
  deleteGoods: {
    url: '/guide/goods/delete',
    method: 'post'
  },
  // 门店商品列表分页查询
  findGoodsShopList: {
    url: '/guide/shopgoods/findList',
    method: 'post'
  },
  // 删除门店商品
  deleteShopGoods: {
    url: '/guide/shopgoods/delete',
    method: 'post'
  },
  // 商品上下架
  updateGoodsShopStatus: {
    url: '/guide/shopgoods/updateStatus',
    method: 'post'
  },
  // 门店商品新增
  saveShopGoods: {
    url: '/guide/shopgoods/save',
    method: 'post'
  },
  // 商品sku列表查询
  findSkuList: {
    url: '/guide/shopgoods/findSkuList',
    method: 'post'
  },
  // 商品sku信息修改
  updateGoodsSku: {
    url: '/guide/shopgoods/update',
    method: 'post'
  },
  // 分类树查询
  findCategoryTreeList: {
    url: '/guide/goods/findCategoryTreeList',
    method: 'post'
  },
  // 分类新增
  saveCategory: {
    url: '/guide/goods/saveCategory',
    method: 'post'
  },
  // 分类修改
  updateCategory: {
    url: '/guide/goods/updateCategory',
    method: 'post'
  },
  // 分类删除
  deleteCategory: {
    url: '/guide/goods/deleteCategory',
    method: 'post'
  },
  // 分类移动
  moveCategory: {
    url: '/guide/goods/moveCategory',
    method: 'post'
  }
}
