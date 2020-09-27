// 列表页面通用变量与方法
export default {
  props: {
    searchform: {
      default: function () {
        return {}
      }
    },
    analysisType: {
      type: Number,
      default: 1
    },
    checkSearchObj: {
      type: Function,
      default: null
    }
  },
  created: function () {
    this.loadListFun()
  },
  data () {
    return {
      sortType: 0, // 排序类型 1:升序 0:降序
      dataList: []
    }
  },
  methods: {
    // 加载列表
    async loadListFun () {
      this.loading = true
      this.searchObj = { ...this.searchObj, ...this.searchform, sortName: this.sortName, sortType: this.sortType, analysisType: this.analysisType }
      if (this.checkSearchObj()) {
        this.$http.fetch(this.$api.guide.sgGuideActivityAnalysis.findList, this.searchObj).then(resp => {
          this.dataList = resp.result.data
          this.pagination.total = parseInt(resp.result.recordsTotal)
        }).catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        }).finally(() => {
          this.loading = false
        })
      }
    },
    // 排序
    changeTableSort (column) {
      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order
      this.sortName = fieldName
      // 按照降序排序
      if (sortingType === 'descending') {
        this.sortType = 0
      } else {
        // 按照升序排序
        this.sortType = 1
      }
      this.loadListFun()
    }
  }
}
