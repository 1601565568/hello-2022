import tableMixin from 'mixins/table'
export default {
  name: 'index',
  mixins: [tableMixin],
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let searchModel = {
      endTime: null,
      startTime: null,
      status: null,
      type: null,
      brandId: null
    }
    let model = Object.assign({}, searchModel)
    return {
      model: model,
      pagination: pagination,
      searchModel: {
        type: 0
      },
      shopFindList: [],
      titleText: '修改状态弹框',
      domainNameVisible: false,
      options: [{
        value: '销售业绩',
        label: 0
      }, {
        value: '招募业绩',
        label: 1
      }, {
        value: '订单同步',
        label: 2
      }, {
        value: '导购会员同步',
        label: 3
      }, {
        value: '门店同步',
        label: 4
      }, {
        value: '优惠券记录同步',
        label: 5
      }, {
        value: '优惠券',
        label: 6
      }]
    }
  },

  mounted: function () {
    var vm = this
    vm.initShopList()
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    sizeChange (model) { // 改变页数大小
      this.initShopList(model)
    },
    pageChange (model) { // 页数改变
      console.log('model:', model)
      this.initShopList(model)
    },
    searchAction (model) { // 搜索
      this.initShopList(model)
    },
    resetInputAction (model) { // 重置
      model.type = null
      this.initShopList()
    },
    onSave (model) { // 保存
      let _this = this
      let obj = {}
      obj = model
      if (model.status === '未执行') {
        obj.status = 0
      } else if (model.status === '执行中') {
        obj.status = 1
      }
      _this.$http.fetch(_this.$api.isv.updateServiceExecution, obj).then(resp => {
        if (resp.success) {
          _this.$notify.success('修改成功！')
          _this.domainNameVisible = false
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    onRedactFun (model) { // 编辑
      this.model = model
      this.domainNameVisible = true
    },
    onDelsTipFun (val) { // 删除
      console.log('val:', val)
    },
    async initShopList (succeedObj) { // 模板详情
      let that = this
      let obj = {
        length: 15,
        searchMap: {
          brandId: null,
          type: 0
        },
        start: 0
      }
      if (succeedObj !== undefined && succeedObj.type !== null && succeedObj.type !== undefined) {
        obj.searchMap.type = succeedObj.type
      } else {
        obj.length = succeedObj
      }
      await this.$http
        .fetch(that.$api.isv.findServiceExecutionList, obj)
        .then(resp => {
          if (resp.success && resp.result != null) {
            that.shopFindList = resp.result.data
            that.pagination.total = parseInt(resp.result.recordsTotal)
          }
        })
        .catch(resp => {
          that.$notify.error('查询失败：' + resp.msg)
        })
    }
  }
}
