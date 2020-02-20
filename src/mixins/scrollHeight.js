export default {
  /* 从数据仓库获取页面内容高度 */
  computed: {
    getContentHeight () {
      return this.$store.getters['common/getContentOffset'].height
    }
  },
  watch: {
    /* 监听页面内容高度变化 */
    getContentHeight () {
      this.handleScrollHeight()
    },
    /* 页面滚动条内容高度配置变化
    * 场景：简单搜索和高级搜索高度变化
    *  */
    'scrollBarDeploy': {
      deep: true,
      handler: function () {
        this.handleScrollHeight()
      }
    }
  },
  mounted () {
    this.handleScrollHeight()
  },
  methods: {
    /* 执行滚动区域的高度的方法 */
    executeScrollHeight (el, scrollHeight) {
      el.style.maxHeight = scrollHeight + 'px'
    },
    /* 判断页面是否存在滚动内容高度ref名称，存在就处理计算滚动区域的高度
    * + 17 滚动条有-17的底部外边距
    * excludeHeight 排除无需滚动的内容总高度
    * */
    handleScrollHeight () {
      this.$nextTick(() => {
        if (this.scrollBarDeploy.constructor === Array) {
          this.scrollBarDeploy.forEach((item) => {
            let ref = this.$refs[item.ref]
            if (ref && ref.$el && ref.$el.children) {
              const scrollHeight = this.getContentHeight - item.excludeHeight + 17
              this.executeScrollHeight(ref.$el.children[0], scrollHeight)
            }
          })
        } else {
          let ref = this.$refs[this.scrollBarDeploy.ref]
          if (ref && ref.$el && ref.$el.children) {
            const scrollHeight = this.getContentHeight - this.scrollBarDeploy.excludeHeight + 17
            this.executeScrollHeight(ref.$el.children[0], scrollHeight)
          }
        }
      })
    }
  }
}
