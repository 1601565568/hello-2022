import echarts from 'echarts'
import businessEcharts from 'components/NsEcharts'
export default {
  name: 'Home',
  components: {
    businessEcharts
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
      shopArr: [{
        shopName: '所有门店',
        id: null
      }], // 所有门店
      shopMap: {},
      getRewardInfoObj: {}, // 当月业绩情况对象
      isSaleData: true, // 是否有数据展示
      isRecruitData: true,
      isRewardDate: true,
      isShopSellData: true,
      isGuideSellData: true,
      isShopRecruitData: true,
      isGuideRecruitData: true,
      loadingSell: false,
      loadingRecruit: false,
      loadingReward: false,
      loadingShopSell: false,
      loadingGuideSell: false,
      loadingShopRecruit: false,
      loadingGuideRecruit: false,
      saleOption: {
        tooltip: {
          formatter: '{c}',
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
      shopSellOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                {offset: 0, color: '#3963FF'},
                {offset: 1, color: '#2B67FF'}
              ])
          },
          type: 'bar',
          data: []
        }
      },
      guideSellOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                {offset: 0, color: '#A964FF'},
                {offset: 1, color: '#BF63FF'}
              ])
          },
          type: 'bar',
          data: []
        }
      },
      shopRecruitOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                {offset: 0, color: '#FF5215'},
                {offset: 1, color: '#FF6C00'}
              ])
          },
          type: 'bar',
          data: []
        }
      },
      guideRecruitOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                {offset: 0, color: '#1FC47C'},
                {offset: 1, color: '#2EC59C'}
              ])
          },
          type: 'bar',
          data: []
        }
      },
      rewardOption: {
        color: ['#FD9B00', '#F7C71F'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
          data: ['销售提成', '招募奖励'],
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
              show: false
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
              borderWidth: 1,
              barBorderRadius: [0, 0, 50, 50]
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
              borderWidth: 1,
              barBorderRadius: [30, 30, 0, 0]
            },
            barWidth: 16,
            name: '招募奖励',
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
        this.findDailyReward(this.searchObj.id)
        this.findShopRanking(0, this.searchObj.id)
        this.findShopRanking(1, this.searchObj.id)
        this.findGuideRanking(0, this.searchObj.id)
        this.findGuideRanking(1, this.searchObj.id)
      } else {
        this.getRewardInfo()
        this.findDailySell()
        this.findDailyRecruit()
        this.findDailyReward()
        this.findShopRanking()
        this.findShopRanking(1)
        this.findGuideRanking(0, null)
        this.findGuideRanking(1, null)
      }
    },
    shopSelect (id) {
      if (id === null) {
        this.getRewardInfo()
        this.findDailySell()
        this.findDailyRecruit()
        this.findDailyReward()
        this.findGuideRanking(0, null)
        this.findGuideRanking(1, null)
      } else {
        this.getRewardInfo(id)
        this.findDailySell(id)
        this.findDailyRecruit(id)
        this.findDailyReward(id)
        this.findGuideRanking(0, id)
        this.findGuideRanking(1, id)
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
    async findShopList () { // 查询店铺
      await this.$http
        .fetch(this.$api.guide.shop.findBrandShopList)
        .then(resp => {
          this.shopArr = [...this.shopArr, ...resp.result]
          for (let i = 0; i < resp.result.length; i++) {
            this.shopMap[resp.result[i].id] = resp.result[i].shopName
          }
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
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
            resp.result.payment = (resp.result.payment || 0).toFixed(2)
            resp.result.reward = (resp.result.reward || 0).toFixed(2)
            resp.result.sellReward = (resp.result.sellReward || 0).toFixed(2)
            resp.result.recruitReward = (resp.result.recruitReward || 0).toFixed(2)
            resp.result.memberTotal = resp.result.memberTotal || 0
            this.getRewardInfoObj = resp.result
          }
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
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
          this.$notify.error('查询失败：')
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
          that.$notify.error('查询失败：')
        })
    },
    async findDailyReward (id) { // 当月收益按日查询
      this.loadingReward = true
      let sellRewardArr = []
      let recruitRewardArr = []
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
            })
            that.isRewardDate = true
            that.rewardOption.series[0].data = recruitRewardArr
            that.rewardOption.series[1].data = sellRewardArr
          }
        })
        .catch(resp => {
          that.$notify.error('查询失败：')
        })
    },
    async findGuideRanking (type, id) { // 当月导购排行查询
      let parms = {
        type: (type || 0)
      } // 0代表销售 1代表招募
      if (id) {
        parms.shopId = id
      }
      if (!parms.type) {
        this.loadingGuideSell = true // 门店销售
      } else {
        this.loadingGuideRecruit = true // 门店招募
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      await this.$http
        .fetch(this.$api.overView.findGuideRanking, parms)
        .then(resp => {
          if (!parms.type) { // 导购销售排行
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
              that.guideSellOption.yAxis[0].data = guideNameArr
              that.guideSellOption.series[0].data = perfAllArr
            }
          } else { // 导购招募
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
          }
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    },
    async findShopRanking (type) { // 当月门店排行查询
      let parms = {
        type: (type || 0)
      } // 0代表销售 1代表招募
      if (!parms.type) {
        this.loadingShopSell = true // 门店销售
      } else {
        this.loadingShopRecruit = true // 门店招募
      }
      let that = this
      parms.monthDate = this.searchObj.monthDate
      await this.$http
        .fetch(this.$api.overView.findShopRanking, parms)
        .then(resp => {
          if (!parms.type) {
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
          } else {
            let shopNameArr = []
            let memberCountArr = []
            that.loadingShopRecruit = false
            if (resp.result === null || resp.result.length === 0) {
              that.isShopRecruitData = false
            } else {
              resp.result.map(item => {
                shopNameArr.push(item.shop_name)
                memberCountArr.push(item.member_count)
              })
              that.isShopRecruitData = true
              that.shopRecruitOption.yAxis.data = shopNameArr
              that.shopRecruitOption.series.data = memberCountArr
            }
          }
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    }
  },
  mounted () {
    this.findShopList()
    this.getRewardInfo()
    this.findDailySell()
    this.findDailyRecruit()
    this.findDailyReward()
    this.findShopRanking(1)
    this.findShopRanking()
    this.findGuideRanking(0, null)
    this.findGuideRanking(1, null)
  }
}
