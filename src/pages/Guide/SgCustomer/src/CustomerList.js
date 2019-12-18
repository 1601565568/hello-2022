import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'

export default {
  mixins: [formMixin],
  data: function () {
    let paginations = {
      enable: true,
      size: 10,
      sizeOpts: [10, 20, 30, 50],
      page: 1,
      total: 0
    }
    return {
      title: null, // 新增弹窗标题
      showCustomerDialogVisible: false,
      paginations: paginations
    }
  },
  methods: {
    showListDialogFun (id) {
      var _this = this
      _this.aaaaa = true
      _this.$nextTick(() => {
        _this.$refs.listDialogDom.showToggle(id)
      })
    },
    // 分页-页数改变
    shopPageChange (page) {
      var _this = this
      _this.paginations.page = page
      _this.findShopList()
    },
    // 分页-大小改变
    shopSizeChange (pageSize) {
      var _this = this
      _this.paginations.size = pageSize
      _this.paginations.page = 1
      _this.findShopList()
    }
  },
  mounted: function () {
  }
}
