import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import { formatInteger } from './../../../../utils/numeralUtils'
import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import { getErrorMsg } from '@/utils/toast'

export default {
  name: 'ColumnTable',
  mixins: [tableMixin, scrollHeight],
  props: {
    url: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var findVo = {
      shopId: null,
      guideId: null
    }
    var tableVo = {
      date: 1,
      dateRange: [Date.now(), Date.now()]
    }
    var model = Object.assign(findVo,
      tableVo,
      {})

    return {
      model: model,
      echartsType: 1,
      filterTreeText: '', // 门店-导购树搜索条件
      shopFindList: [], // 店铺集合
      shopTreePage: {
        total: 0,
        page: 1,
        size: 50,
        shopName: ''
      },
      // 滚动区域配置
      scrollBarDeploy: [
        {
          ref: 'pageLeft', // 页面左边滚动条ref的名称
          excludeHeight: 40 // 简单搜索的高度39 + 间距5 + 标题41
        },
        {
          ref: 'pageRight', // 页面右边滚动条ref的名称
          excludeHeight: 0 // 简单搜索的高度39 + 间距5 + 标题41
        }
      ],
      // 列表数据
      tableData: [],
      url: '',
      _pagination: pagination,
      _table: {
        quickSearchMap: {}
      },
      // 图表数据
      totalFriendData: {
        tooltip: {
          backgroundColor: '#fff',
          position: 'top',
          formatter: '{c}',
          textStyle: {
            color: '#000'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1
        },
        grid: {
          left: 10,
          right: 10,
          top: 30,
          bottom: 20,
          containLabel: true
        },
        color: ['#0078D7'],
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: 'category',
          data: []
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: 'value'
        },
        series: [
          {
            name: '数量',
            type: 'line',
            smooth: 0.35,
            symbolSize: 8,
            data: []
          }
        ]
      },
      // 图表数据加载
      loadingTotalFriendData: true,
      echatTimeType: 1,
      // 图表时间类型 1昨天，2前七天 ，3一个月
      analysisDays: 1,
      echatData: {
        chatCnt: 0,
        messageCnt: 0,
        replyPercentage: 0.0,
        avgReplyTime: 0,
        times: [],
        chatCnts: [],
        messageCnts: [],
        replyPercentages: [],
        avgReplyTimes: []
      }
    }
  },

  mounted: function () {
    var vm = this
    // 调整左边树的高度
    vm.height = window.innerHeight - 120
    let limitHeight = window.innerHeight - 32 - 10 - this.$refs.shopTreeDiv.$el.getBoundingClientRect().top
    this.$refs.shopTreeDiv.$el.children[0].style.height = limitHeight + 'px'
  },
  created: function () {
    this.initShopList()
  },
  updated () {
    if (this.$refs.elTree) {
      this.$refs.elTree.offsetHeight > window.screen.availHeight ? this.offsetHeight = true : this.offsetHeight = false
    }
  },
  watch: {
    // 导购树过滤
    filterTreeText (val) {
      this.$refs.guideTree.filter(val)
    }
  },
  components: {
    businessEcharts
  },
  methods: {
    formatInteger (val) {
      return formatInteger(val)
    },
    onSearch () {
      // console.log('搜索响应')
    },
    // 初始化店铺列表
    initShopList (page) {
      this.shopTreePage.page = page || 1
      this.$http.fetch(this.$api.guide.guide.customerGetGuideTree, {
        start: (this.shopTreePage.page - 1) * this.shopTreePage.size,
        length: this.shopTreePage.size,
        searchMap: {
          shopName: this.shopTreePage.shopName
        }
      }).then(resp => {
        if (resp.success && resp.result !== null) {
          this.shopTreePage.total = Number(resp.result.recordsTotal)
          this.shopFindList = resp.result.data
          if (this.shopFindList.length > 0) {
            this.$nextTick(function () {
              this.$refs.guideTree.setCurrentKey(this.shopFindList[0].id)
            })
            this.onClickNode(this.shopFindList[0])
          }
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 树节点过滤
    onFilterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) {
        return true
      }
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },
    // 左边树点击事件，然后触发渲染右边数据
    onClickNode (data) {
      var _this = this
      if (this._data._table.data.length > 0) {
        this._data._table.data = []
      }
      // 代表门店
      if (data.parentId === '0') {
        _this.model.shopId = data.id
      } else {
        // 专属导购
        _this.model.guideId = data.id
      }
      _this.echartsType = 1
      _this.analysisDays = 1
      _this.initEchats()
      _this.initTable()
    },
    // 初始化图表数据
    initEchats () {
      this.loadingTotalFriendData = true
      let that = this
      let param = {
        shopId: that.model.shopId,
        guideId: that.model.guideId,
        type: that.analysisDays
      }
      that.$http
        .fetch(that.$api.weWork.behaviorData.getBehaviorCount, param).then(resp => {
          if (!resp.success) {
            that.$notify.error(resp.msg)
          }
          if (resp.result) {
            that.echatData.chatCnt = resp.result.chatCnt
            that.echatData.messageCnt = resp.result.messageCnt
            that.echatData.replyPercentage = resp.result.replyPercentage
            that.echatData.avgReplyTime = resp.result.avgReplyTime
            that.echatData.times = resp.result.times
            that.echatData.chatCnts = resp.result.chatCnts
            that.echatData.messageCnts = resp.result.messageCnts
            that.echatData.replyPercentages = resp.result.replyPercentages
            that.echatData.avgReplyTimes = resp.result.avgReplyTimes
            that.initTotalFriendData(this.echartsType)
          }
        }).catch(resp => {
          that.$notify.error(resp.msg)
        })
    },
    // 渲染图表数据
    initTotalFriendData (type) {
      this.echartsType = type
      let dates = this.echatData.times
      let data = []
      if (type === 1) {
        data = this.echatData.chatCnts
      } else if (type === 2) {
        data = this.echatData.messageCnts
      } else if (type === 3) {
        data = this.echatData.replyPercentages
      } else if (type === 4) {
        data = this.echatData.avgReplyTimes
      }
      this.totalFriendData.xAxis.data = []
      dates.forEach((rule) => {
        this.totalFriendData.xAxis.data.push(rule)
      })
      this.totalFriendData.series[0].data = []
      data.forEach((rule) => {
        this.totalFriendData.series[0].data.push(rule)
      })
      this.loadingTotalFriendData = false
    },
    // 图表时间点击事件
    onClickEchatsTime () {
      this.echartsType = 1
      this.initEchats()
    },
    // 初始化列表数据
    initTable () {
      this.model.date = 1
      this.$searchAction$()
    },
    // 搜索列表数据
    onClickTable () {
      if (this.model.date === '4' && this.model.dateRange.length < 2) {
        this.$notify.error('请正确选择范围时间')
        return
      }
      this.$searchAction$()
    }
  }
}
