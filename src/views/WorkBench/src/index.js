import Vue from 'vue'
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
    return {
      shopArr: [{
        shopName: '所有门店',
        id: null
      }], // 所有门店
      searchObj: {
        id: null,
        monthDate: ''
      },
      getRewardInfoObj: {}, // 当月业绩情况对象
      guideSellRankingArr: [],
      findShopSellRankingArr: [], // 门店销售排行
      sellOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '20px',
          right: '15px',
          bottom: '20px',
          top: '60px',
          containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {
              show: true
            }
          }
        },
        legend: {
          show: true,
          x: 'right',
          y: '20px',
          data: ['门店销售额', '平均销售额']
        },
        // calculable: false,
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 0
          },
          // splitLine: {
          //   show: true
          // },
          boundaryGap: false,
          data: []
        },

        yAxis: {
          type: 'value'
        },

        series: [{
          name: '门店销售额', // 这个是显示的名称
          smooth: true, // 这个是把线变成曲线
          type: 'line', // 这个是展示数据的类型，是柱状图还是折线图，饼状图
          data: [] // 展示的数据
        },
        {
          name: '平均销售额', // 这个是显示的名称
          smooth: true, // 这个是把线变成曲线
          type: 'line', // 这个是展示数据的类型，是柱状图还是折线图，饼状图
          data: [], // 展示的数据
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
                type: 'dotted' // 'dotted'虚线 'solid'实线
              }
            }
          }
        }
        ],
        color: ['#0091FA', '#FFDDDD', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      mapOption: { // 进行相关配置
        backgroundColor: '#ffffff',
        tooltip: {}, // 鼠标移到图里面的浮动提示框
        // visualMap: {
        //   min: 0,
        //   max: 200,
        //   calculable: true,
        //   inRange: {
        //     color: ['#50a3ba', '#eac736', '#d94e5d']
        //   },
        //   textStyle: {
        //     color: '#fff'
        //   }
        // },
        // dataRange: {
        //   show: false,
        //   min: 0,
        //   max: 1000,
        //   text: ['High', 'Low'],
        //   realtime: true,
        //   calculable: true,
        //   color: ['orangered', 'yellow', 'lightskyblue']
        // },
        geo: { // 这个是重点配置区
          map: 'china', // 表示中国地图
          // roam: true,// 控制地图放大缩小
          label: {
            normal: {
              // show: true, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,0.4)'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              // shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          // {
          //   type: 'scatter',
          //   coordinateSystem: 'geo' // 对应上方配置
          // },
          {
            name: '', // series名称
            type: 'scatter', // 为散点类型
            coordinateSystem: 'geo', // series坐标系类型
            data: [],
            symbol: 'pin',
            symbolSize: [20, 20]
          }
          // {
          //   name: '启动次数', // 浮动框的标题
          //   type: 'map',
          //   geoIndex: 0,
          //   data:

          // }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    shopSelect (id) {
      if (id === null) {
        this.findGuideSellRanking()
        this.findSellReward()
        this.getRewardInfo()
      } else {
        this.findGuideSellRanking(id)
        this.findSellReward(id)
        this.getRewardInfo(id)
      }
    },
    getMonthLength (date) { // 给定一个日期  计算出当月天数
      let d = new Date(date)
      // 将日期设置为下月一号
      d.setMonth(d.getMonth() + 1)
      d.setDate('1')
      // 获取本月最后一天
      d.setDate(d.getDate() - 1)
      return d.getDate()
    },
    async findShopList () { // 查询店铺
      await this.$http
        .fetch(this.$api.overView.findShopList)
        .then(resp => {
          this.shopArr = [...this.shopArr, ...resp.result]
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    },
    async findGuideSellRanking (id) { // 查询导购排行
      let parms = {}
      let that = this
      parms.monthDate = '2018-06'
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findGuideSellRanking, parms)
        .then(resp => {
          if (resp.result !== null || resp.result.length !== 0) {
            resp.result.map(item => {
              item.perf_all = item.perf_all.toFixed(2)
              that.shopArr.map(shopItem => {
                if (item.shop_id === shopItem.id) {
                  item.shopName = shopItem.shopName
                }
              })
            })
          }
          this.guideSellRankingArr = resp.result
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    },
    async findSellReward (id) { // 当月销售业绩按日查询
      this.sellOption.xAxis.data = []
      for (let i = 1; i <= this.getMonthLength('2018-11'); i++) {
        this.sellOption.xAxis.data.push(i + '日')
      }
      let parms = {}
      let that = this
      parms.monthDate = '2018-11'
      if (id) {
        parms.shopId = id
      }
      await this.$http
        .fetch(this.$api.overView.findSellReward, parms)
        .then(resp => {
          that.sellOption.series[0].data = resp.result.total
          that.sellOption.series[1].data = resp.result.average
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    },
    async getRewardInfo (id) { // 当月业绩情况查询
      let parms = {}
      parms.monthDate = '2018-11'
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
              resp.result.paymentPersent = (resp.result.payment ? Number((resp.result.payment * 100 / resp.result.sellQuota).toFixed(2)) : 0)
            }
            if (!resp.result.recruitQuota || resp.result.memberCount > resp.result.recruitQuota) {
              resp.result.memberCountPersent = 100
            } else {
              if (!resp.result.memberCount) {
                resp.result.memberCountPersent = 0
              } else {
                resp.result.memberCountPersent = (resp.result.memberCount * 100 / resp.result.recruitQuota).toFixed(2)
              }
            }
            this.getRewardInfoObj = resp.result
            console.log(this.getRewardInfoObj)
          }
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    },
    async findShopSellRanking () { // 当月门店排行查询
      let parms = {}
      let that = this
      parms.monthDate = '2018-11'
      await this.$http
        .fetch(this.$api.overView.findShopSellRanking, parms)
        .then(resp => {
          resp.result.map(item => {
            item.value = [item.longitude, item.latitude]
            that.shopArr.map(shopItem => {
              if (item.shop_id === shopItem.id) {
                item.shopName = shopItem.shopName
                item.name = shopItem.shopName
              }
            })
          })
          this.findShopSellRankingArr = resp.result
          this.mapOption.series[0].data = resp.result
        })
        .catch(resp => {
          this.$notify.error('查询失败：')
        })
    }
  },
  mounted () {
    this.findShopList()
    this.findGuideSellRanking()
    this.findSellReward()
    this.getRewardInfo()
    this.findShopSellRanking()
  }
}
