import Vue from 'vue'
import businessEcharts from 'components/NsEcharts'
import ErrorCode from 'configs/errorCode'
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
      loadingSale: false,
      loadingShop: false,
      loadingMember: false,
      loadingSource: false,
      isSaleData: true, // 是否有数据展示
      isShopData: true, // 是否有店铺展示
      isMemberData: true, // 是否有会员数据展示
      isSourceData: true, // 是否有来源数据展示
      activityData: {
        date: '2017-06-13',
        total: 10,
        activity: [
          {
            name: '已完成',
            num: 29,
            list: [
              {
                title: '已完成活动标题1',
                link: 'http://www.baidu.com',
                id: 1
              },
              {
                title: '已完成活动标题1',
                link: 'http://www.baidu.com',
                id: 2
              },
              {
                title: '已完成活动标题1',
                link: 'http://www.baidu.com',
                id: 3
              }
            ]
          },
          {
            name: '进行中',
            num: 24,
            list: [
              {
                title: '进行中活动标题',
                link: 'http://www.baidu.com',
                id: 6
              },
              {
                title: '进行中活动标题',
                link: 'http://www.baidu.com',
                id: 7
              },
              {
                title: '进行中活动标题',
                link: 'http://www.baidu.com',
                id: 8
              },
              {
                title: '进行中活动标题',
                link: 'http://www.baidu.com',
                id: 9
              }
            ]
          }
        ]
      }, // 活动数据
      constantlyData1: [
        {
          type: 'price',
          value: 0,
          totalTitle: '今日付款总额',
          decimal: 2,
          titleNum: [
            {title: '昨日付款总额', num: 0},
            {title: '近30日付款总额', num: 0},
            {title: '今日退款总额', num: 0}
          ]
        },
        {
          type: 'number',
          value: 0,
          totalTitle: '今日付款订单',
          decimal: 0,
          titleNum: [
            {title: '昨日付款订单', num: 0},
            {title: '近30日付款订单', num: 0},
            {title: '今日付款订单', num: 0}
          ]
        },
        {
          type: 'number',
          value: 0,
          totalTitle: '今日付款客户',
          decimal: 0,
          titleNum: [
            {title: '昨日付款客户', num: 0},
            {title: '近30日付款客户', num: 0},
            {title: '今日回购客户', num: 0}
          ]
        },
        {
          type: 'number',
          value: 0,
          totalTitle: '今日新增会员',
          decimal: 0,
          titleNum: [
            {title: '昨日新增会员', num: 0},
            {title: '近30日新增会员', num: 0},
            {title: '今日新增会员', num: 0}
          ]
        }
      ],
      popoverVisible: true,
      chartColumn: null,
      chartBar: null,
      chartLine: null,

      // 销售趋势
      option: {
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
          bottom: '0',
          top: '10px',
          containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {show: true}
          }
        },
        legend: {
          show: false
        },
        calculable: false,
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              rotate: 0
            },
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '付款金额',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: []
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      // 销售趋势-end

      // 店铺排行
      shopOption: {
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
          left: '0',
          right: '10px',
          bottom: '0',
          top: '10px',
          containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {show: true}
          }
        },
        calculable: false,
        xAxis: [
          {
            type: 'value',
            axisLabel: {
              rotate: 0
            },
            boundaryGap: [0, 0.01]
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        series: [
          {
            name: '付款金额',
            type: 'bar',
            stack: '总量',
            areaStyle: {normal: {}},
            data: []
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      // 店铺排行-end

      // 会员发展趋势
      memberOption: {
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
          left: '10px',
          right: '15px',
          bottom: '45px',
          top: '10px',
          containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {show: true}
          }
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: []
        },
        calculable: false,
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              rotate: 0
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1', '#7FF400', '#699669', '#778F00']
      },
      // 会员发展趋势-end

      // 入会来源分布
      sourceOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: []
        },
        calculable: false,
        series: [
          {
            name: '入会人数',
            type: 'pie',
            radius: '70%',
            center: ['50%', '45%'],
            areaStyle: {normal: {}},
            data: []
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      // 入会来源分布-end

      salesTrendDays: '7',
      rankingsDays: '7',
      developmentTrendDays: '7',
      sourceDays: '7',

      salesTrendRadioData: ['付款金额', '付款订单数', '付款客户数', '销量商品数', '客单价'],
      salesTrendRadio: '付款金额',

      rankingsRadioData: ['付款金额', '付款订单数', '付款客户数', '销量商品数', '客单价'],
      rankingsRadio: '付款金额',

      chartPie: null,
      sales: {},
      shops: {},
      activity: [],
      markType: {
        OrderingConcern: 0,
        PayConcern: 0,
        ConsignNotify: 0,
        ArrivedNotify: 0,
        ReceiveConcern: 0,
        ConfirmConcern: 0,
        RefundConcern: 0,
        FirstUrgePayment: 0,
        BeforeCloseUrgePayment: 0
      }
    }
  },
  mounted: function () {
  },
  created () {
    // var vm = this
    // vm.$http.fetch(vm.$api.database.overView.queryDataScreen).then((resp) => {
    //   vm.constantlyData1 = []
    //   var constantData = []
    //   var data = resp.result
    //   constantData.push({
    //     type: 'price',
    //     value: Number(data.todayPayment),
    //     totalTitle: '今日付款总额',
    //     decimal: 2,
    //     titleNum: [
    //       {title: '昨日付款总额', num: Number(data.yesterDayPayment).toFixed(2)},
    //       {title: '近30日付款总额', num: Number(data.thirtyDayPayment).toFixed(2)},
    //       {title: '今日退款总额', num: Number(data.refundPayment).toFixed(2)}
    //     ]
    //   })
    //   constantData.push({
    //     type: 'number',
    //     value: Number(data.todayTrade),
    //     totalTitle: '今日付款订单',
    //     decimal: 0,
    //     titleNum: [
    //       {title: '昨日付款订单', num: data.yesterdayTrade},
    //       {title: '近30日付款订单', num: data.thirtyTrade},
    //       {title: '今日退款订单', num: data.refundTrade},
    //       {title: '今日销售商品', num: data.orders}
    //     ]
    //   })
    //   constantData.push({
    //     type: 'number',
    //     value: Number(data.todayCustomer),
    //     totalTitle: '今日付款客户',
    //     decimal: 0,
    //     titleNum: [
    //       {title: '昨日付款客户', num: data.yesterdayCustomer},
    //       {title: '近30日付款客户', num: data.thirtydayCustomer},
    //       {title: '今日新增客户', num: data.addTodayCustomer},
    //       {title: '今日回购客户', num: data.backBuyCustomer}
    //     ]
    //   })
    //   constantData.push({
    //     type: 'number',
    //     value: Number(data.addTodayMember),
    //     totalTitle: '今日新增会员',
    //     decimal: 0,
    //     titleNum: [
    //       {title: '昨日新增会员', num: data.addYesterdayCustomer},
    //       {title: '近30日新增会员', num: data.addThirdayCustomer},
    //       {title: '今日升级客户', num: data.gradeCustomer}
    //     ]
    //   })
    //   vm.setListData(data.market)
    //   vm.markType = data.care
    //   vm.$nextTick(function () {
    //     vm.constantlyData1 = constantData
    //   })
    // }).catch(() => {
    //   this.$notify.error('品牌下面无数据')
    // })
    // vm.switchSale(7)
    // vm.switchShop(7)
    // vm.switchSource(7)
    // vm.switchGrade(7)
  },
  methods: {
    setSource (obj) {
      this.sourceOption.legend.data = []
      this.sourceOption.series[0].data = []
      var isShow = false
      for (let data of obj) {
        if (data.num !== 0) {
          isShow = true
        }
        this.sourceOption.legend.data.push(data.plateName)
        this.sourceOption.series[0].data.push(
          {value: data.num, name: data.plateName})
      }
      this.isSourceData = isShow
      this.loadingSource = false
    },
    setGrade (obj) {
      this.memberOption.legend.data = obj.gradeName
      this.memberOption.xAxis[0].data = obj.days
      var series = []
      var isShow = false
      for (let data of obj.grade) {
        for (let val of data.value) {
          if (val !== '0') {
            isShow = true
          }
        }
        series.push({
          name: data.label,
          type: 'bar',
          stack: '广告',
          data: data.value
        })
      }
      this.isMemberData = !isShow
      this.loadingMember = false
      this.memberOption.series = series
    },
    switchShop (obj) {
      var vm = this
      vm.loadingShop = true
      vm.$http.fetch(vm.$api.database.overView.queryShops, {days: obj}).then((resp) => {
        if (resp.code === ErrorCode.DATA_NO_EXIST) {
          vm.$notify.error('获取品牌店铺数据错误！')
        } else {
          var shop = resp.result
          // 设置店铺排名
          vm.shops = {
            payments: shop.payment,
            orders: shop.orders,
            trades: shop.trades,
            priceUnit: shop.priceUnit,
            customer: shop.customers
          }
          vm.rankingsRadio = '付款金额'
          vm.getShopData(vm.shops.payments)
        }
      })
    },
    switchSale (obj) {
      var vm = this
      vm.loadingSale = true
      vm.$http.fetch(vm.$api.database.overView.querySales, {days: obj}).then((resp) => {
        if (resp.code === ErrorCode.DATA_NO_EXIST) {
          vm.$notify.error('获取品牌店铺数据错误！')
        } else {
          var sale = resp.result
          // 设置销售趋势
          vm.sales = {
            payments: sale.payments,
            orders: sale.orders,
            trades: sale.trades,
            priceUnit: sale.priceUnit,
            customer: sale.customer
          }
          vm.loadingSale = false
          vm.salesTrendRadio = '付款金额'
          vm.getSaleData(vm.sales.payments)
        }
      })
    },
    switchGrade (obj) {
      var vm = this
      vm.loadingMember = true
      vm.$http.fetch(vm.$api.database.overView.queryGrades, {days: obj}).then((resp) => {
        if (resp.code === ErrorCode.DATA_NO_EXIST) {
          vm.$notify.error('获取品牌店铺数据错误！')
        } else {
          var grade = resp.result
          vm.setGrade(grade)
        }
      })
    },
    switchSource (obj) {
      var vm = this
      vm.loadingSource = true
      vm.$http.fetch(vm.$api.database.overView.querySource, {days: obj}).then((resp) => {
        if (resp.code === ErrorCode.DATA_NO_EXIST) {
          vm.$notify.error('获取品牌店铺数据错误！')
        } else {
          var source = resp.result
          vm.setSource(source)
        }
      })
    },
    // 根据消费趋势选择呈现值
    saleChange (obj) {
      this.option.series[0].name = obj
      switch (obj) {
        case '付款金额': { this.getSaleData(this.sales.payments); break }
        case '销量商品数': { this.getSaleData(this.sales.orders); break }
        case '付款订单数': { this.getSaleData(this.sales.trades); break }
        case '客单价': { this.getSaleData(this.sales.priceUnit); break }
        default: { this.getSaleData(this.sales.customer); break }
      }
    },
    // 根据消费趋势选择展示的数据
    getSaleData (obj) {
      this.option.xAxis[0].data = []
      this.option.series[0].data = []
      var isShow = true
      for (let data of obj) {
        if (data.value.toString().split('.').length === 2) {
          if (data.value !== '00.00') {
            isShow = false
          }
        } else {
          if (data.value !== 0) {
            isShow = false
          }
        }
        this.option.xAxis[0].data.push(data.key)
        this.option.series[0].data.push(data.value)
      }
      this.isSaleData = !isShow
    },
    shopChange (obj) {
      this.shopOption.series[0].name = obj
      switch (obj) {
        case '付款金额': { this.getShopData(this.shops.payments); break }
        case '销量商品数': { this.getShopData(this.shops.orders); break }
        case '付款订单数': { this.getShopData(this.shops.trades); break }
        case '客单价': { this.getShopData(this.shops.priceUnit); break }
        default: { this.getShopData(this.shops.customer); break }
      }
    },
    // 根据店铺选择展示的数据
    getShopData (obj) {
      this.shopOption.yAxis[0].data = []
      this.shopOption.series[0].data = []
      var isShow = true
      for (let data of obj) {
        if (data.value !== 0) {
          isShow = false
        }
        this.shopOption.yAxis[0].data.push(data.key)
        this.shopOption.series[0].data.push(data.value)
      }
      this.isShopData = !isShow
      this.loadingShop = false
    },
    setListData: function (obj) {
      this.activity = []
      for (let dataIndex in obj) {
        var data = obj[dataIndex]
        if (data != null) {
          var running = data.RUNNING
          var run = []
          for (let data of running) {
            run.push({title: data})
          }
          var com = []
          var complete = data.COMPLETED
          for (let data of complete) {
            com.push({title: data})
          }
          this.activity.push({
            date: dataIndex,
            total: run.length + com.length,
            activity: [
              {
                name: '已完成',
                num: run.length,
                list: run
              },
              {
                name: '进行中',
                num: com.length,
                list: com
              }
            ]
          })
        }
      }
    },
    getListData: function (day, date) {
      let listData
      return listData
    },
    dateCellRenderMarket: function (h, day, month, year, date) {
      let listData = this.activity.find(i => i.date === date)
      if (typeof (listData) !== 'undefined') {
        return h('business-activity-list', {
          props: {
            day: day,
            date: date,
            data: listData
          }
        })
      }
    }
  }
}
