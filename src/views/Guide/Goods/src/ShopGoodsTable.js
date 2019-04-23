import tableMixin from 'mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
export default {
  name: 'ShopGoodsTable',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let tableButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'name': '新增'
      },
      {
        'func': function () {
          that.batchDelete()
        },
        'name': '删除'
      }
    ]
    let operateButtons = [
      {
        'func': function (args) {
        },
        'name': '查看'
      },
      {
        'func': function (args) {
          this.$emit('edit', args.row)
        },
        'name': '编辑'
      }
    ]
    let quickInput = [{ 'name': 'title' }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let model = Object.assign({},
      {
        title: null,
        goods_code: null,
        goods_cids: null,
        max_price: null,
        min_price: null,
        max_stock: null,
        min_stock: null,
        status: null
      },
      {})
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
        },
        enumerable: true
      })
    })
    return {
      goods_cids: null,
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      url: this.$api.guide.goods.findGoodsShopList,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {},
        quickSearchNames: quickSearchNames
      },
      category: {},
      treeData2: [],
      shopId: null,
      shopName: null,
      shopList: []
    }
  },
  mounted: function () {
    // 查询树数据
    this.getTreeData()
    // 查询线下门店
    this.findShopList()
  },
  methods: {
    /**
     * 处理请求参数
     * @param params
     * @returns {*}
     */
    $handleParams: function (params) {
      let that = this
      if (that.shopId) {
        params.searchMap.shop_id = that.shopId
      } else {
        params.searchMap.shop_id = 0
      }
      return params
    },
    /**
     * 更改启用状态
     * @param call
     * @param currVal
     * @param row
     */
    onStatusChange: function (call, currVal, row) {
      let that = this
      let info
      let status
      if (currVal === 1) {
        status = 0
        info = '下架商品'
      } else if (currVal === 0) {
        status = 1
        info = '上架商品'
      }
      if (status === 1 && !row.detail) {
        // 判定商品是否已有详情
        that.$message.warning('请先添加商品详情')
        return
      }
      apiRequestConfirm(info).then(() => {
        that.$http.fetch(this.$api.guide.goods.updateGoodsShopStatus,
          { shop_id: that.shopId, sys_item_id: row.sys_item_id, status: status })
          .then(() => {
            that.$reload()
            call()
          }).catch((resp) => {
            that.$message.error(resp.msg || '状态更新失败，请重试')
          })
      }).catch(() => {})
    },
    /**
     * 门店查询
     */
    findShopList: function () {
      const that = this
      that.$http.fetch(that.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then((resp) => {
        that.shopList = resp.result
        if (that.shopList && that.shopList.length > 0) {
          that.shopId = that.shopList[0].id
          that.shopName = that.shopList[0].shopName
          that.onShopChange()
        }
      }).catch(() => {
        that.$notify.error('门店查询失败')
      })
    },
    /**
     * 门店选中值发送改变
     */
    onShopChange: function () {
      let that = this
      this.$refs.table.$data.shopId = that.shopId
      this.$refs.table.$searchAction$()
      // 获取门店名称
      let obj
      obj = that.shopList.find((item) => {
        return item.id === that.shopId
      })
      that.shopName = obj.shopName
    },
    /**
     * 删除商品
     */
    batchDelete: function () {
      let that = this
      let data = that.$refs.table.selection
      if (data.length <= 0) {
        that.$message.warning('请至少选择一件商品')
        return
      }
      apiRequestConfirm('删除门店商品').then(() => {
        let sysItemIds = data.map(item => item.sys_item_id).join()
        that.$http.fetch(this.$api.guide.goods.deleteShopGoods,
          { shop_id: that.shopId, sys_item_ids: sysItemIds })
          .then(() => {
            that.$message.success('删除成功')
            that.$reload()
          }).catch((resp) => {
            that.$message.error(resp.msg || '删除失败，请重试')
          })
      }).catch(() => {})
    },
    /**
     * 查询菜单树数据
     */
    getTreeData: function () {
      let that = this
      this.$http.fetch(this.$api.guide.goods.findCategoryTreeList).then((resp) => {
        that.treeData2 = resp.result
      }).catch(() => {
        that.$notify.error('加载失败')
      }).finally(() => {
      })
    },
    categoryClick (data, node) {
      this.model.goods_cids = data.ext1
    },
    resetInputAction () {
      this.category = {}
      this.model.title = null
      this.model.goods_code = null
      this.model.goods_cids = null
      this.$searchAction$()
    }
  }
}
