import echarts from 'echarts'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
import ElProgress from '@nascent/nui/lib/progress'
import ElCard from '@nascent/nui/lib/card'
import { getErrorMsg } from '@/utils/toast'
import isMenuAuth from '@nascent/ecrp-ecrm/src/utils/isMenuAuth'
import store from '@/store'

export default {
  name: 'Home',
  components: {
    businessEcharts,
    ElProgress,
    ElCard
  },
  data () {
    let monthDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    let xAxisArr = []
    for (let i = 1; i <= this.getMonthLength(new Date()); i++) {
      xAxisArr.push(i + '日')
    }
    return {
      searchObj: {
        id: null,
        monthDate: monthDate
      },
      inserList: [{
        shopName: '所有门店',
        id: null
      }], // 所有门店
      shopMap: {},
      getRewardInfoObj: {}, // 当月业绩情况对象
      isSaleData: true, // 是否有数据展示
      isRecruitData: true,
      isRewardDate: true,
      isAddFriendData: true,
      isShopSellData: true,
      isGuideSellData: true,
      isShopRecruitData: true,
      isGuideRecruitData: true,
      isGuideAddFriendData: true,
      isNewAddFriendData: true,
      loadingSell: false,
      loadingRecruit: false,
      loadingReward: false,
      loadingShopSell: false,
      loadingGuideSell: false,
      loadingShopRecruit: false,
      loadingAddFriend: false,
      loadingGuideRecruit: false,
      loadingGuideAddFriend: false,
      saleOption: {
        tooltip: {
          // formatter: '{c}',
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [10, 0, 0, 0]
          },
          data: xAxisArr
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [0, 12, 0, 0]
          }
        },
        grid: {
          top: 30,
          left: 100,
          right: 55
        },
        series: [{
          color: '#1299FA',
          data: [],
          smooth: 0.35,
          symbolSize: 8,
          type: 'line',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(18, 153, 250, 0.6)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(18, 153, 250, 0.1)' // 100% 处的颜色
              }]
            }
          }
        }]
      },
      recruitOption: {
        tooltip: {
          // formatter: '{c}',
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [10, 0, 0, 0]
          },
          data: xAxisArr
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [0, 12, 0, 0]
          }
        },
        grid: {
          top: 30,
          left: 100,
          right: 55
        },
        series: [{
          color: '#FF3A3A',
          data: [],
          smooth: 0.35,
          symbolSize: 8,
          type: 'line',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(255, 58, 58, 0.6)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(255, 58, 58, 0.1)' // 100% 处的颜色
              }]
            }
          }
        }]
      },
      // 新增好友趋势表
      addFriendOption: {
        tooltip: {
          // formatter: '{c}',
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [10, 0, 0, 0]
          },
          data: xAxisArr
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            padding: [0, 12, 0, 0]
          }
        },
        grid: {
          top: 30,
          left: 100,
          right: 55
        },
        series: [{
          color: '#B760DE',
          data: [],
          smooth: 0.35,
          symbolSize: 8,
          type: 'line',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(183,96,222,0.5)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(183,96,222,0.05)' // 100% 处的颜色
              }]
            }
          }
        }]
      },
      shopSellOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          inverse: true,
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#2C67FF' },
                { offset: 1, color: 'rgba(44, 103, 255, 0.7)' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      guideSellOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          inverse: true,
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#0091FA ' },
                { offset: 1, color: 'rgba(0, 145, 250, 0.7)' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      shopRecruitOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          inverse: true,
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#FF532A' },
                { offset: 1, color: 'rgba(255, 83, 42, 0.7)' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      // 门店新增好友表
      newAddFriendOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          inverse: true,
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#8F5BFF' },
                { offset: 1, color: 'rgba(143, 91, 255, 0.7)' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      guideRecruitOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          inverse: true,
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#FF6067' },
                { offset: 1, color: 'rgba(255, 96, 103, 0.7)' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      // 导购新加好友排行榜
      guideAddFriendOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '56',
          height: 500,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999999',
            padding: [0, 10, 0, 0]
          },
          inverse: true,
          type: 'category',
          data: []
        },
        series: {
          barWidth: 24,
          itemStyle: {
            barBorderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1,
              [
                { offset: 0, color: '#B760DE' },
                { offset: 1, color: 'rgba(183, 96, 222, 0.7)' }
              ])
          },
          type: 'bar',
          data: []
        }
      },
      rewardOption: {
        color: ['#FD9B00', '#F7C71F', '#B760DE'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          }
        },
        legend: {
          bottom: 20,
          data: ['销售提成', '招募奖励', '新加好友奖励'],
          itemWidth: 20,
          itemGap: 36
        },
        grid: {
          top: '30',
          left: '3%',
          right: '4%',
          bottom: '70',
          containLabel: true
        },
        xAxis: [
          {
            axisLine: {
              onZero: true
            },
            axisTick: {
              show: false
            },
            type: 'category',
            data: xAxisArr
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            itemStyle: {
              borderWidth: 1
            },
            name: '销售提成',
            barWidth: 16,
            barCategoryGap: '30px',
            type: 'bar',
            stack: 'stack',
            data: []
          },
          {
            itemStyle: {
              borderWidth: 1
            },
            barWidth: 16,
            name: '招募奖励',
            type: 'bar',
            stack: 'stack',
            data: []
          },
          {
            itemStyle: {
              borderWidth: 1
            },
            barWidth: 16,
            name: '新加好友奖励',
            type: 'bar',
            stack: 'stack',
            data: []
          }
        ]
      }
    }
  },
  methods: {
    change () {
      this.saleOption.xAxis.data = []
      this.recruitOption.xAxis.data = []
      this.rewardOption.xAxis.data = []
      let monthLength = this.getMonthLength(this.searchObj.monthDate)
      for (let i = 1; i <= monthLength; i++) {
        this.saleOption.xAxis.data.push(i + '日')
        this.recruitOption.xAxis.data.push(i + '日')
        this.rewardOption.xAxis.data.push(i + '日')
      }
      this.searchObj.monthDate = ('' + this.searchObj.monthDate.getFullYear() + '-' + (this.searchObj.monthDate.getMonth() + 1))
      if (this.searchObj.id) {
        this.getRewardInfo(this.searchObj.id)
        this.findDailySell(this.searchObj.id)
        this.findDailyRecruit(this.searchObj.id)
        this.findDailyAddFriend(this.searchObj.id)
        this.findDailyReward(this.searchObj.id)
        this.findShopRanking(0, this.searchObj.id)
        this.findShopRanking(1, this.searchObj.id)
        this.findShopRanking(3, this.searchObj.id)
        this.findGuideRanking(0, this.searchObj.id)
        this.findGuideRanking(1, this.searchObj.id)
        this.findGuideRanking(3, this.searchObj.id)
      } else {
        this.getRewardInfo()
        this.findDailySell()
        this.findDailyAddFriend()
        this.findDailyRecruit()
        this.findDailyReward()
        this.findShopRanking()
        this.findShopRanking(1)
        this.findShopRanking(3)
        this.findGuideRanking(0, null)
        this.findGuideRanking(1, null)
        this.findGuideRanking(3, null)
      }
    },
    shopSelect (id) {
      if (this.searchObj.monthDate) {
        if (id === null) {
          this.getRewardInfo()
          this.findDailySell()
          this.findDailyAddFriend()
          this.findDailyRecruit()
          this.findDailyReward()
          this.findGuideRanking(0, null)
          this.findGuideRanking(1, null)
          this.findGuideRanking(3, null)
        } else {
          this.getRewardInfo(id)
          this.findDailySell(id)
          this.findDailyAddFriend(id)
          this.findDailyRecruit(id)
          this.findDailyReward(id)
          this.findGuideRanking(0, id)
          this.findGuideRanking(1, id)
          this.findGuideRanking(3, id)
        }
      } else {
        this.$notify.error('月份不能为空')
      }
    },
    getMonthLength (d) { // 给定一个日期  计算出当月天数
      // 将日期设置为下月一号
      d.setMonth(d.getMonth() + 1)
      d.setDate('1')
      // 获取本月最后一天
      d.setDate(d.getDate() - 1)
      return d.getDate()
    },
    async getRewardInfo (id) { // 当月业绩情况查询
      let parms = {}
      parms.monthDate = this.searchObj.monthDate
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.getRewardInfo, parms)
        .then(resp => {
          if (resp !== null) {
            if (!resp.result.sellQuota || resp.result.payment > resp.result.sellQuota) {
              resp.result.paymentPersent = 100
            } else {
              resp.result.paymentPersent = Number((resp.result.payment ? Number((resp.result.payment * 100 / resp.result.sellQuota).toFixed(2)) : 0))
            }
            if (!resp.result.recruitQuota || resp.result.memberCount > resp.result.recruitQuota) {
              resp.result.memberCountPersent = 100
            } else {
              if (!resp.result.memberCount) {
                resp.result.memberCountPersent = 0
              } else {
                resp.result.memberCountPersent = Number((resp.result.memberCount * 100 / resp.result.recruitQuota).toFixed(2))
              }
            }
            if (!resp.result.addfriendQuota || resp.result.addfriendCount > resp.result.addfriendQuota) {
              resp.result.addfriendCountPersent = 100
            } else {
              if (!resp.result.addfriendCount) {
                resp.result.addfriendCountPersent = 0
              } else {
                resp.result.addfriendCountPersent = Number((resp.result.addfriendCount * 100 / resp.result.addfriendQuota).toFixed(2))
              }
            }
            resp.result.payment = resp.result.payment || 0
            resp.result.reward = resp.result.reward || 0
            resp.result.sellReward = resp.result.sellReward || 0
            resp.result.addfriendReward = resp.result.addfriendReward || 0
            resp.result.recruitReward = resp.result.recruitReward || 0
            resp.result.memberTotal = resp.result.memberTotal || 0
            this.getRewardInfoObj = resp.result
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findDailySell (id) { // 当月销售业绩按日查询
      this.loadingSell = true
      let parms = {
        type: 0
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findDailyTrend, parms)
        .then(resp => {
          that.loadingSell = false
          if (resp.result === null || resp.result.length === 0) {
            that.isSaleData = false
          } else {
            that.isSaleData = true
            that.saleOption.series[0].data = resp.result
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findDailyRecruit (id) { // 当月招募人数按日查询
      this.loadingRecruit = true
      let parms = {
        type: 1
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findDailyTrend, parms)
        .then(resp => {
          that.loadingRecruit = false
          if (resp.result === null || resp.result.length === 0) {
            that.isRecruitData = false
          } else {
            that.isRecruitData = true
            that.recruitOption.series[0].data = resp.result.map(Number)
          }
        })
        .catch(resp => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findDailyAddFriend (id) { // 当月招募人数按日查询
      this.loadingRecruit = true
      let parms = {
        type: 3
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findDailyTrend, parms)
        .then(resp => {
          that.loadingRecruit = false
          if (resp.result === null || resp.result.length === 0) {
            that.isAddFriendData = false
          } else {
            that.isAddFriendData = true
            that.addFriendOption.series[0].data = resp.result.map(Number)
          }
        })
        .catch(resp => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findDailyReward (id) { // 当月收益按日查询
      this.loadingReward = true
      let sellRewardArr = []
      let recruitRewardArr = []
      let addFriendArr = []
      let parms = {}
      let that = this
      parms.monthDate = this.searchObj.monthDate
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findDailyReward, parms)
        .then(resp => {
          that.loadingReward = false
          if (resp.result === null || resp.result.length === 0) {
            that.isRewardDate = false
          } else {
            resp.result.map(item => {
              sellRewardArr.push(item.sale)
              recruitRewardArr.push(item.recruit)
              addFriendArr.push(item.addfriend)
            })
            that.isRewardDate = true
            that.rewardOption.series[0].data = sellRewardArr.map((value, index) => {
              let barBorderRadius = +recruitRewardArr[index] || +addFriendArr[index] ? [0, 0, 0, 0] : [0, 0, 0, 0]
              return { value, itemStyle: { barBorderRadius } }
            })
            that.rewardOption.series[1].data = recruitRewardArr.map((value, index) => {
              let barBorderRadius = +addFriendArr[index] ? [0, 0, 0, 0] : [0, 0, 0, 0]
              return { value, itemStyle: { barBorderRadius } }
            })
            that.rewardOption.series[2].data = addFriendArr.map(value => {
              return { value, itemStyle: { barBorderRadius: [0, 0, 0, 0] } }
            })
          }
        })
        .catch(resp => {
          that.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findGuideRanking (type, id) { // 当月导购排行查询
      let parms = {
        type: (type || 0)
      } // 0代表销售 1代表招募 3//新加好友
      if (id) {
        parms.shopId = id
      }
      if (+parms.type === 0) {
        this.loadingGuideSell = true // 门店销售
      } else if (+parms.type === 1) {
        this.loadingGuideRecruit = true // 门店招募
      } else {
        this.loadingGuideAddFriend = true // 门店新加好友
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      await this.$http
        .fetch(this.$api.overView.findGuideRanking, parms)
        .then(resp => {
          if (+parms.type === 0) { // 导购销售排行
            let guideNameArr = []
            let perfAllArr = []
            that.loadingGuideSell = false
            if (resp.result === null || resp.result.length === 0) {
              that.isGuideSellData = false
            } else {
              resp.result.map(item => {
                guideNameArr.push(item.name)
                perfAllArr.push(item.perf_all)
              })
              that.isGuideSellData = true
              that.guideSellOption.yAxis.data = guideNameArr
              that.guideSellOption.series.data = perfAllArr
            }
          } else if (+parms.type === 1) { // 导购招募
            let guideNameArr = []
            let perfAllArr = []
            that.loadingGuideRecruit = false
            if (resp.result === null || resp.result.length === 0) {
              that.isGuideRecruitData = false
            } else {
              resp.result.map(item => {
                guideNameArr.push(item.name)
                perfAllArr.push(item.perf_all)
              })
              that.isGuideRecruitData = true
              that.guideRecruitOption.yAxis.data = guideNameArr
              that.guideRecruitOption.series.data = perfAllArr
            }
          } else { // 门店新加好友
            let guideNameArr = []
            let perfAllArr = []
            that.loadingGuideAddFriend = false
            if (resp.result === null || resp.result.length === 0) {
              that.isGuideAddFriendData = false
            } else {
              resp.result.map(item => {
                guideNameArr.push(item.name)
                perfAllArr.push(item.perf_all)
              })
              that.isGuideAddFriendData = true
              that.guideAddFriendOption.yAxis.data = guideNameArr
              that.guideAddFriendOption.series.data = perfAllArr
            }
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async findShopRanking (type) { // 当月门店排行查询
      let parms = {
        type: (type || 0)
      } // 0代表销售 1代表招募 3店铺新加好友
      if (+parms.type === 0) {
        this.loadingShopSell = true // 门店销售
      } else if (+parms.type === 1) {
        this.loadingShopRecruit = true // 门店招募
      } else {
        this.loadingAddFriend = true // 门店新加好友
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      await this.$http
        .fetch(this.$api.overView.findShopRanking, parms)
        .then(resp => {
          if (+parms.type === 0) {
            let shopNameArr = []
            let paymentArr = []
            that.loadingShopSell = false
            if (resp.result === null || resp.result.length === 0) {
              that.isShopSellData = false
            } else {
              resp.result.map(item => {
                shopNameArr.push(item.shop_name)
                paymentArr.push(item.payment)
              })
              that.isShopSellData = true
              that.shopSellOption.yAxis.data = shopNameArr
              that.shopSellOption.series.data = paymentArr
            }
          } else if (+parms.type === 1) {
            let shopNameArr = []
            let memberCountArr = []
            that.loadingShopRecruit = false
            if (resp.result === null || resp.result.length === 0) {
              that.isShopRecruitData = false
            } else {
              resp.result.map(item => {
                if (item.member_count) {
                  memberCountArr.push(item.member_count)
                  shopNameArr.push(item.shop_name)
                }
              })
              that.isShopRecruitData = Boolean(memberCountArr.length)
              that.shopRecruitOption.yAxis.data = shopNameArr
              that.shopRecruitOption.series.data = memberCountArr
            }
          } else {
            let shopNameArr = []
            let memberCountArr = []
            that.loadingAddFriend = false
            if (resp.result === null || resp.result.length === 0) {
              that.isNewAddFriendData = false
            } else {
              resp.result.map(item => {
                if (item.addfriend_count) {
                  memberCountArr.push(item.addfriend_count)
                  shopNameArr.push(item.shop_name)
                }
              })
              that.isNewAddFriendData = Boolean(memberCountArr.length)
              that.newAddFriendOption.yAxis.data = shopNameArr
              that.newAddFriendOption.series.data = memberCountArr
            }
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    }
  },
  mounted () {
    this.getRewardInfo()
    this.findDailySell()
    this.findDailyRecruit()
    this.findDailyAddFriend()
    this.findDailyReward()
    this.findShopRanking(1)
    this.findShopRanking()
    // 门店新增好友
    this.findShopRanking(3)
    this.findGuideRanking(0, null)
    this.findGuideRanking(1, null)
    this.findGuideRanking(3, null)
  },
  beforeRouteEnter (to, from, next) {
    if (isMenuAuth(to.path, store.state.user.remumber.remumber_login_info.routerAuth)) {
      next()
    } else {
      next(store.state.user.menus[0].path)
    }
  }
}
