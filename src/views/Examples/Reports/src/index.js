export default {
  data: function () {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        keyWord: 'icon-wenjianjia',
        children: [{
          label: '二级 1-1',
          keyWord: 'icon-wenjian'
        }]
      }, {
        id: 2,
        label: '一级 2',
        keyWord: 'icon-wenjianjia',
        children: [{
          label: '二级 2-1',
          keyWord: 'icon-wenjian'
        }, {
          label: '二级 2-2',
          keyWord: 'icon-wenjian'
        }]
      }, {
        id: 3,
        label: '一级 3',
        keyWord: 'icon-wenjianjia',
        children: [{
          label: '二级 3-1',
          keyWord: 'icon-wenjian'
        }, {
          label: '二级 3-2',
          keyWord: 'icon-wenjian'
        }]
      }],
      tableData: [{
        date: '2016-05-02',
        num: '￥41.11',
        num1: '￥87.11',
        num2: '￥36.11',
        proportion: '95.21%',
        proportion1: '0.00%'
      }, {
        date: '2016-05-02',
        num: '￥45.11',
        num1: '￥12.11',
        num2: '￥123.11',
        proportion: '0.00%',
        proportion1: '0.00%'
      }, {
        date: '2016-05-02',
        num: '￥10.11',
        num1: '￥10.11',
        num2: '￥99.11',
        proportion: '50.00%',
        proportion1: '45.00%'
      }],
      sqlState: false, // 是否有Sql语句错误或者条件配置错误
      showErrorMessage: false, // 是否显示错误信息
      searchBegin: false,
      showTable: false,
      currentPage: 5
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      this.$refs.reportsHeight.$el.children[0].style.maxHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 63 + 'px'
    })
  },
  methods: {
    /* 树节点点击事件 */
    treeNodeClick (data) {
      this.searchBegin = true
    },
    /* 树节点-收起时，滚动条无法正确隐藏处理 */
    onCloseNode () {
      var that = this
      setTimeout(function () {
        that.$nextTick(() => {
          if (that.$refs.reportsHeight.$el.children[0].children[0].style.width === '99%') {
            that.$refs.reportsHeight.$el.children[0].children[0].style.width = '100%'
          } else {
            that.$refs.reportsHeight.$el.children[0].children[0].style.width = '99%'
          }
        })
      }, 450)
    }
  }
}
