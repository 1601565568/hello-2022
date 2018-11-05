import tableMixin from 'mixins/table'
export default {
  name: 'GoodsTable',
  mixins: [tableMixin],
  data: function () {
    let that = this
    let tableButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'name': '新增'
      }
    ]
    let operateButtons = [
      {
        'func': function (args) {
          this.$emit('detail', args.row)
        },
        'name': '详情'
      },
      {
        'func': function (args) {
          this.$emit('edit', args.row)
        },
        'name': '编辑'
      },
      {
        'func': function (args) {
          that.batchDelete(args.row)
        },
        'name': '删除'
      }
    ]
    let quickInput = [{'name': 'title'}]
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
      category: {},
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      url: this.$api.guide.goods.findGoodsList,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchMap: {},
        quickSearchNames: quickSearchNames
      },
      treeData2: []
    }
  },
  mounted: function () {
    // 查询树数据
    this.getTreeData()
  },
  methods: {

    /**
     * 删除商品
     */
    batchDelete: function (row) {
      let that = this
      that.$confirm('是否删除该商品', '删除提示', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        that.$http.fetch(that.$api.guide.goods.deleteGoods, {sys_item_id: row.sys_item_id}).then(() => {
          that.$message.success('删除成功')
          that.$reload()
        }).catch((resp) => {
          that.$message.error(resp.msg || '删除失败，请重试')
        })
      }).catch(() => {
      })
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
