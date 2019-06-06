// 列表页面通用变量与方法
export default {
  data: function () {
    return {
      dataList: [], // 列表数组
      loading: false,
      activeTabName: 0, // tab页面切换
      searchType: {
        // 切换搜索类型
        advanced: false,
        tipText: '展开搜索'
      },
      // 列表请求的参数对像
      searchObj: {
        length: 15,
        start: 0,
        searchMap: {}
      },
      pagination: {
        // 分页对象
        enable: true,
        size: 15,
        sizeOpts: [15, 50, 100, 200],
        page: 1,
        total: 0
      }
    }
  },
  // 常用属性过滤器
  filters: {
    // 店铺状态
    shopStatus: function (val) {
      if (val === 0) {
        return '删除'
      }
      if (val === 1) {
        return '正常营业'
      }
      if (val === -1) {
        return '暂停营业'
      }
      if (val === -2) {
        return '已关店'
      }
      return ''
    },
    // 店铺状态--线下
    shopType: function (val) {
      if (val === 'B') {
        return '天猫'
      }
      if (val === 'C') {
        return '淘宝店'
      }
      if (val === 'ZYD') {
        return '直营店'
      }
      if (val === 'JMD') {
        return '加盟'
      }
      return ''
    }
  },

  methods: {
    clearSearch () {
      this.pagination.page = 1
      this.searchObj.start = 0
    },
    // 切换搜索模式
    tabSearchType () {
      this.searchType.advanced = !this.searchType.advanced
      if (this.searchType.advanced) {
        this.searchType.tipText = '收起搜索'
      } else {
        this.searchType.tipText = '展开搜索'
      }
    },
    // 分页操作--改变每页显示条目个数
    handleSizeChange (val) {
      this.searchObj.length = val
      this.loadListFun(this.searchObj)
    },
    // 分页操作--跳转到对应页数
    handleCurrentChange (val) {
      this.searchObj.start = (val - 1) * this.searchObj.length
      this.loadListFun(this.searchObj)
    },
    // tab页面切换
    tabHandleClick (e) {
      this.$router.push({
        path: e.name
      })
    },
    // 重置搜索
    resetForm (formName) {
      this.$refs[formName].resetFields()
      if (this.$resetForm) {
        this.$resetForm()
      }
      this.submitForm()
    }
  }
}
