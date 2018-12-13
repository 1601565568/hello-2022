import Vue from 'vue'
import echarts from 'echarts'
import businessEcharts from 'components/NsEcharts'
Vue.component('business-activity-list', {
  data () {
    return {
      popover: false,
      activeStatus: ''
    }
  },
  props: {
    day: Number,
    month: Number,
    year: Number,
    date: String,
    data: Object
  },
  methods: {},
  template: '<div class="overview-list">' +
    '<el-popover popper-class="overview-list__popover" placement="right" width="200" trigger="hover" ref="activity"  v-model="popover">' +
    '<div class="overview-list__popover-header"><i @click="popover = false" class="el-icon-error"></i>{{date}} 活动</div> ' +
    '<el-collapse class="overview-list__collapse" v-model="activeStatus" accordion>' +
    '<el-collapse-item v-for="(status,index) in data.activity" :key="index" :name="status.name">' +
    '<span slot="title">{{status.name}} <b>{{status.num}}</b></span>' +
    '<router-link class="overview-list__article" v-for="(list, index) in status.list" :key="index" :to="{ name: \'MarketingManageList\'}">{{list.title}}</router-link>' +
    '</el-collapse-item>' +
    '</el-collapse>' +
    '</el-popover>' +
    '<div class="overview-list__status" v-popover:activity> ' +
    '<div class="overview-list__status-list"><span class="item"><span class="name-day">{{day}}</span><span  class="name">活动</span></span></div>' +
    '</div>' +
    '</div>' +
    '</div>'
})

export default {
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
      loadingSell: false,
      loadingRecruit: false,
      loadingReward: false,
      loadingShopSell: false,
      loadingGuideSell: false,
      loadingShopRecruit: false,
      loadingGuideRecruit: false,
      isSellData: true,
      isRecruitData: true,
      isRewardDate: true,
      isShopSellData: true,
      isGuideSellData: true,
      isShopRecruitData: true,
      isGuideRecruitData: true,
      shopArr: [{
        shopName: '所有门店',
        id: null
      }], // 所有门店
      shopMap: {},
      average: [],
      currentMonth: null,
      searchObj: {
        id: null,
        monthDate: monthDate
      },
      getRewardInfoObj: {}, // 当月业绩情况对象
      guideSellRankingArr: [],
      findShopSellRankingArr: [], // 门店销售排行
      sellOption: {
        title: {
          textStyle: { // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            'fontSize': 17,
            color: '#333'
          },
          left: '33',
          top: '14',
          text: '销售业绩'
        },
        grid: { // 控制
          left: '46',
          top: '80',
          right: '46',
          bottom: '30',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
          // position: function (pt) {
          //   return [pt[0], '10%']
          // }
        },
        toolbox: {
          top: '14',
          right: '10',
          feature: {
            // dataZoom: {
            //   yAxisIndex: 'none'
            // },
            restore: {}
            // saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 0
          },
          // splitLine: {
          //   show: true
          // },
          boundaryGap: false,
          data: xAxisArr
        },

        yAxis: {
          type: 'value'
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }
          // {
          //   start: 0,
          //   end: 100,
          //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          //   handleSize: '80%',
          //   handleStyle: {
          //     color: '#fff',
          //     shadowBlur: 3,
          //     shadowColor: 'rgba(0, 0, 0, 0.6)',
          //     shadowOffsetX: 2,
          //     shadowOffsetY: 2
          //   }
          // }
        ],
        series: [
          {
            name: '门店销售额', // 这个是显示的名称
            smooth: true, // 这个是把线变成曲线
            symbolSize: 6, // 折线点的大小
            type: 'line', // 这个是展示数据的类型，是柱状图还是折线图，饼状图
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 10
              }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                  color: '#fff',
                  shadowBlur: 3,
                  shadowColor: 'rgba(0, 0, 0, 0.6)',
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                }
              }],
            data: [],
           // 展示的数据
            itemStyle: {
              normal: {
                color: 'rgb(18,153,250,0.5)',
                lineStyle: {
                  width: 2,
                  type: 'solid' // 'dotted'虚线 'solid'实线
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(18,153,250,0.6)'
                }, {
                  offset: 1,
                  color: 'rgb(18,153,250,0.1)'
                }])
              }
            }
          }
        ]
        // color: ['#0091FA', '#999', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      recruitOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        title: {
          textStyle: { // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            'fontSize': 17,
            color: '#333'
          },
          left: '33',
          top: '14',
          text: '招募会员趋势'
        },
        grid: { // 控制
          left: '46',
          top: '80',
          right: '46',
          bottom: '30',
          containLabel: true
        },
        toolbox: {
          top: '14',
          right: '10',
          feature: {
            // dataZoom: {
            //   yAxisIndex: 'none'
            // },
            restore: {}
            // saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisArr
        },
        yAxis: {
          name: '', // y轴名称
          type: 'value'
          // boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        series: [{
          name: '招募人数',
          type: 'line',
          smooth: true,
          // symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(255,58,58,0.4)'
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255,58,58,0.6)'
              }, {
                offset: 1,
                color: 'rgb(255,58,58,0.1)'
              }])
            }
          },
          data: []
        }]
      },
      rewardOption: {
        // backgroundColor: '#161139',
        title: {
          //   subtext: '副标题', // 副标题文本，'\n'指定换行
          //   subtextStyle: { // 副标题文本样式{"color": "#aaa"}
          //     fontFamily: 'Arial, Verdana, sans...',
          //     fontSize: 12,
          //     fontStyle: 'normal',
          //     fontWeight: 'normal'
          //   },
          textStyle: {// 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            'fontSize': 17,
            color: '#333'
          },
          left: '33',
          top: '14',
          text: '导购提成及奖励'
        },
        grid: {// 控制
          left: '46',
          top: '80',
          right: '46',
          bottom: '84',
          containLabel: true
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              show: true,
              backgroundColor: '#333'
            }
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }],
        toolbox: {
          top: '14',
          right: '10',
          feature: {
            // dataZoom: {
            //   yAxisIndex: 'none'
            // },
            restore: {}
            // saveAsImage: {}
          }
        },
        legend: {
          data: ['销售提成', '招募奖励'],
          textStyle: {
            color: '#ccc'
          },
          bottom: 30
        },
        xAxis: {
          type: 'category',
          data: xAxisArr,
          axisTick: {
            alignWithLabel: true
          },

          splitLine: {
            show: false

          },
          axisLabel: {
            fontWeight: 10,
            interval: 2,
            fontsize: 12,
            align: 'center',
            color: '#666'
          }
        },
        yAxis: [{
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.2)'
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            fontWeight: 10,
            fontsize: 12,
            color: '#666'
          }

        }],
        series: [{
          name: '招募奖励',
          type: 'bar',
          stack: '总量',
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 0, 50, 50],
              color: '#fd9600'
            }
          },
          data: []
        },
        {
          name: '销售提成',
          type: 'bar',
          stack: '总量',
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: [50, 50, 0, 0],
              color: '#f7c71f'
            }
          },
          data: []
        }]
      },
      shopSellOption: {
        title: {
          textStyle: { // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            'fontSize': 17,
            color: '#333'
          },
          left: '33',
          top: '14',
          text: '门店销售排行榜'
        },
        grid: { // 控制
          left: '46',
          top: '80',
          right: '46',
          bottom: '20',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              // show: true,
              // backgroundColor: '#333'
            }
          }
        },
        xAxis: {
          show: true,
          axisLabel: {
            rotate: 0
          },
          splitLine: {
            show: false
          },
          boundaryGap: false
        },
        yAxis: [{
          show: true,
          data: [], // 店铺名称数据
          inverse: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000',
            // formatter: function (value, index) {
            //   return [
            //     '{lg|' + (index + 1) + '}   ' + '{title|' + value + '} '
            //   ].join('\n')
            // },
            rich: {
              lg: {
                backgroundColor: '#3963ff',
                color: '#fff',
                borderRadius: 15,
                padding: 5,
                align: 'center',
                width: 15,
                height: 15
              }
            }
          }

        }
        ],
        series: [{
          name: '元',
          type: 'bar',
          yAxisIndex: 0,
          data: [], // 销售金额
          barWidth: 30,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 30, 30, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#3963ff'
              }, {
                offset: 1,
                color: '#2b67ff'
              }])
            }
          },
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{c}'
            }
          }
        }]
      },
      guideSellOption: {
        title: {
          textStyle: { // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            'fontSize': 17,
            color: '#333'
          },
          left: '33',
          top: '14',
          text: '导购销售排行榜'
        },
        grid: { // 控制
          left: '46',
          top: '80',
          right: '46',
          bottom: '20',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              // show: true,
              // backgroundColor: '#333'
            }
          }
        },
        xAxis: {
          show: true,
          axisLabel: {
            rotate: 0
          },
          splitLine: {
            show: false
          },
          boundaryGap: false
        },
        yAxis: [{
          show: true,
          data: [],
          inverse: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000',
            // formatter: function (value, index) {
            //   return [
            //     '{lg|' + (index + 1) + '}   ' + '{title|' + value + '} '
            //   ].join('\n')
            // },
            rich: {
              lg: {
                backgroundColor: '#a963ff',
                color: '#fff',
                borderRadius: 15,
                padding: 5,
                align: 'center',
                width: 15,
                height: 15
              }
            }
          }

        }],
        series: [{
          name: '元',
          type: 'bar',
          yAxisIndex: 0,
          data: [],
          barWidth: 30,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 30, 30, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#a963ff'
              }, {
                offset: 1,
                color: '#bf63ff'
              }])
            }
          },
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{c}'
            }
          }
        }]
      },
      shopRecruitOption: {
        title: {
          textStyle: { // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            'fontSize': 17,
            color: '#333'
          },
          left: '33',
          top: '14',
          text: '门店招募排行榜'
        },
        grid: { // 控制
          left: '46',
          top: '80',
          right: '46',
          bottom: '20',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              // show: true,
              // backgroundColor: '#333'
            }
          }
        },
        xAxis: {
          show: true,
          axisLabel: {
            rotate: 0
          },
          splitLine: {
            show: false
          },
          boundaryGap: false
        },
        yAxis: [{
          show: true,
          data: [],
          inverse: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000',
            // formatter: function (value, index) {
            //   return [
            //     '{lg|' + (index + 1) + '}   ' + '{title|' + value + '} '
            //   ].join('\n')
            // },
            rich: {
              lg: {
                backgroundColor: '#3963ff',
                color: '#fff',
                borderRadius: 15,
                padding: 5,
                align: 'center',
                width: 15,
                height: 15
              }
            }
          }

        }],
        series: [{
          name: '人',
          type: 'bar',
          yAxisIndex: 0,
          data: [],
          barWidth: 30,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 30, 30, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#ff5215'
              }, {
                offset: 1,
                color: '#ff6c00'
              }])
            }
          },
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{c}'
            }
          }
        }]
      },
      guideRecruitOption: {
        title: {
          textStyle: { // 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            'fontSize': 17,
            color: '#333'
          },
          left: '33',
          top: '14',
          text: '导购招募排行榜'
        },
        grid: { // 控制
          left: '46',
          top: '80',
          right: '46',
          bottom: '20',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              show: true,
              backgroundColor: '#333'
            }
          }
        },
        xAxis: {
          show: true,
          axisLabel: {
            rotate: 0
          },
          splitLine: {
            show: false
          },
          boundaryGap: false
        },
        yAxis: [{
          show: true,
          data: [],
          inverse: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#000',
            // formatter: function (value, index) {
            //   return [
            //     '{lg|' + (index + 1) + '}   ' + '{title|' + value + '} '
            //   ].join('\n')
            // },
            rich: {
              lg: {
                backgroundColor: '#a963ff',
                color: '#fff',
                borderRadius: 15,
                padding: 5,
                align: 'center',
                width: 15,
                height: 15
              }
            }
          }

        }],
        series: [{
          name: '人',
          type: 'bar',
          yAxisIndex: 0,
          data: [],
          barWidth: 30,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 30, 30, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#1fc47c'
              }, {
                offset: 1,
                color: '#2EC59C'
              }])

            }
          },
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: '{c}'
            }
          }
        }]
      }
    }
  },
  created () {
  },
  methods: {
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
    change () {
      this.sellOption.xAxis.data = []
      this.recruitOption.xAxis.data = []
      this.rewardOption.xAxis.data = []
      let monthLength = this.getMonthLength(this.searchObj.monthDate)
      for (let i = 1; i <= monthLength; i++) {
        this.sellOption.xAxis.data.push(i + '日')
        this.recruitOption.xAxis.data.push(i + '日')
        this.rewardOption.xAxis.data.push(i + '日')
      }
      this.searchObj.monthDate = ('' + this.searchObj.monthDate.getFullYear() + '-' + (this.searchObj.monthDate.getMonth() + 1))
      console.log(this.searchObj)
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
            that.isSellData = false
          } else {
            that.isSellData = true
            that.sellOption.series[0].data = resp.result
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
            // resp.result.map(item => {
            //   item = Number(item).toFixed(0)
            // })
            that.isRecruitData = true
            that.recruitOption.series[0].data = resp.result
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
      let parms = { }
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
            that.isRecruitData = true
            that.rewardOption.series[0].data = recruitRewardArr
            that.rewardOption.series[1].data = sellRewardArr
          }
        })
        .catch(resp => {
          that.$notify.error('查询失败：')
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
            resp.result.payment = resp.result.payment.toFixed(2)
            resp.result.reward = resp.result.reward.toFixed(2)
            resp.result.sellReward = resp.result.sellReward.toFixed(2)
            resp.result.recruitReward = resp.result.recruitReward.toFixed(2)
            this.getRewardInfoObj = resp.result
          }
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    },
    async findShopRanking (type) { // 当月门店排行查询
      let parms = {type: (type || 0)}// 0代表销售 1代表招募
      if (!parms.type) {
        this.loadingShopSell = true// 门店销售
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
              that.shopSellOption.yAxis[0].data = shopNameArr
              that.shopSellOption.series[0].data = paymentArr
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
              that.shopRecruitOption.yAxis[0].data = shopNameArr
              that.shopRecruitOption.series[0].data = memberCountArr
            }
          }
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
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
              that.guideRecruitOption.yAxis[0].data = guideNameArr
              that.guideRecruitOption.series[0].data = perfAllArr
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
    this.findShopRanking()
    this.findShopRanking(1)
    this.findGuideRanking(0, null)
    this.findGuideRanking(1, null)
  }
}
