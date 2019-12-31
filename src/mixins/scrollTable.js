export default {
  methods: {
    /**
     * 计算主要显示窗口的高度，动态设置页面内主要内容的高度
     */
    setHeight: function () {
      this.$nextTick(() => {
        /* 左侧工具栏高度&因滚动条样式margin-bottom负值17px，需要添加上17px；10px为底部间距；底部分页栏高41px； */
        // 判断分页是否可用
        let paginationHeight = 41
        if (!this._data._pagination.enable) {
          paginationHeight = 2
        }

        let limitHeight = window.innerHeight - this.$refs.fullScreen.$el.getBoundingClientRect().top - 10 + 17 - paginationHeight
        this.$refs.fullScreen.$el.children[0].style.maxHeight = limitHeight + 'px'
      })
    },
    /* 页面内滚动，滚动至页面顶部 */
    scrollIntoView () {
      // fullScreen 为内滚动组件（el-scrollbar）的 ref 值
      this.$refs.fullScreen.$el.children[0].children[0].scrollIntoView()
    }
  },
  watch: {
    /* 模拟表格的数据监听 */
    '_data._table.data' (newValue) {
      this.tableData = newValue
      this.scrollIntoView()
    },
    /**
     * 搜索栏展开时重新计算页面高度，保持分页栏固定底部
     */
    '_data._queryConfig.expand' () {
      this.setHeight()
    },
    /**
     * 底部分页栏可用状态修改时重新计算页面高度
     */
    '_data._pagination.enable' () {
      this.setHeight()
    }
  },
  created () {
    this.setHeight()
    window.addEventListener('resize', this.setHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  }
}
