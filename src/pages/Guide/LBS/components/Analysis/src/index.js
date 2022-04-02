import moment from 'moment'
export default {
  data () {
    return {
      model: {
        shopIdList: [],
        setState: null,
        addFriendsStartTime: this.type !== 'Group' ? this.initTime()[0] : null, // 搜索的起始时间
        addFriendsEndTime: this.type !== 'Group' ? this.initTime()[1] : null, // 搜索的结束时间
        guid: this.$route.query.guid,
        sortType: 0,
        activityStartTime: this.type !== 'Group' ? this.$route.query.start : null,
        activityEndTime: this.type !== 'Group' ? this.$route.query.end : null,
        timeType: this.type !== 'Group' ? Number(this.$route.query.type) : null,
        startTime: this.type === 'Group' ? this.changeDate(1)[0] : null,
        endTime: this.type === 'Group' ? this.changeDate(1)[1] : null,
        tradeStartTime: null, // 好友拉新 下单开始
        tradeEndTime: null, // 好友拉新 下单结束
        chargebackStartTime: null, // 好友拉新 退款开始
        chargebackEndTime: null // 好友拉新 退款结束
      },
      pickerOptions1: {
        disabledDate: (time) => {
          // 先判断活动类型timeType 如果是2那么时间限制一年前到现在
          // 否则timeType===1，判断活动起始时间是否超过一年，超过一年，活动结束时间小于当前时间，那么就是范围就是活动结束时间一年前~活动结束时间，
          // 活动结束时间大于当前时间，当前时间~一年前， 不超过一年，时间选择就是活动起始时间~活动结束时间
          const { start, end, type } = this.$route.query // 活动起始时间， 活动结束时间， 活动类型
          const now = new Date().getTime() // 此刻时间
          const inTime = new Date(time).getTime() // 用户输入时间
          const aYearAgo = moment(now).subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss') // 相对于此刻 一年前
          const activityIsEnd = moment(now).isAfter(end, 'day')
          if (Number(type) === 2) {
            // 用户选择时间 > 今天；或者小于一年前
            return moment(inTime).isBefore(aYearAgo, 'day') || moment(inTime).isAfter(now, 'day')
          }
          if (Number(type) === 1) {
            const endSub = moment(end).subtract(1, 'year')
            // 活动时间小于一年
            if (moment(endSub).isBefore(start, 'day')) {
              // 活动已经结束
              if (activityIsEnd) {
                return moment(inTime).isBefore(start, 'day') || moment(inTime).isAfter(end, 'day')
              } else {
                return moment(inTime).isBefore(start, 'day') || moment(inTime).isAfter(now, 'day')
              }
            } else {
              const initTime = moment(end).subtract(1, 'year')
              if (activityIsEnd) {
                return moment(inTime).isBefore(initTime, 'day') || moment(inTime).isAfter(end, 'day')
              } else {
                return moment(inTime).isBefore(initTime, 'day') || moment(inTime).isAfter(now, 'day')
              }
            }
          }
          return false
          // if (new Date(time).getTime() > new Date().getTime() - 1 * 8.64e7) {
          //   return false
          // } else {
          //   return time.getTime() < Date.now() - 181 * 8.64e7
          // }
        }
      },
      time: this.type !== 'Group' ? this.initTime() : this.changeDate(1), // 时间筛选
      timeOrder: [],
      timeRefund: [],
      activeType: 'shop', // 选中的数据 shop: 门店  employee：成员
      // 时间筛选
      dateList: [
        {
          label: '今天',
          value: '1day'
        }, {
          label: '近7天',
          value: '7day'
        }, {
          label: '近30天',
          value: '30day'
        }
      ],
      // 状态
      statusOptionList: [
        {
          label: '全部',
          value: null
        },
        {
          label: '已设置',
          value: 1
        },
        {
          label: '未设置',
          value: 0
        }
      ],
      // 总数数据
      countData: {
        shop: 0,
        employee: 0
      },
      // 时间选择的值
      dateValue: '1day'
    }
  },
  props: {
    type: {
      default: 'Group' // Group:群拉新 Friends:好友拉新
    }
  },
  computed: {
    // 导出报表类型
    excelType () {
      return this.activeType === 'shop' ? 29 : 30
    },
    // 总数接口
    countApi () {
      return this.type === 'Group' ? this.$api.guide.lbs.getGroupStatisticsCount : this.$api.guide.lbs.getFirendsStatisticsCount
    },
    exportApi () {
      if (this.type === 'Group') {
        return this.activeType === 'shop' ? this.$api.guide.lbs.exportActivityShopData : this.$api.guide.lbs.exportActivityAddUserData
      }
      return this.activeType === 'shop' ? this.$api.guide.lbs.shopListDataExport : this.$api.guide.lbs.addUserDataExport
    },
    activityName () {
      return this.$route.query ? this.$route.query.name : ''
    },
    employeeName () {
      return this.type === 'Group' ? '新增群成员' : '新加好友'
    }
  },
  methods: {
    // 获取列表统计
    getDataTotal () {
      const model = this.model
      const parmas = {
        guid: model.guid,
        shopIdList: model.shopIdList,
        startTime: this.type === 'Group' ? model.startTime : this.model.addFriendsStartTime,
        endTime: this.type === 'Group' ? model.endTime : this.model.addFriendsEndTime,
        setState: model.setState,
        ...model
      }
      this.$http.fetch(this.countApi, parmas).then(res => {
        const { shopNum = 0,
          adduserNum = 0 } = res.result
        this.countData = {
          shop: shopNum,
          employee: adduserNum
        }
      }).catch(res => {
        this.$notify.error(res.msg)
      })
    },
    // 好友拉新： 根据时间进行新增好友数的筛选
    screenAddByTime (date) {
      if (date) {
        const addFriendsStartTime = date[0] || null
        const addFriendsEndTime = date[1] || null
        this.model = {
          ...this.model,
          addFriendsStartTime,
          addFriendsEndTime
        }
      } else {
        this.model = {
          ...this.model,
          addFriendsStartTime: null,
          addFriendsEndTime: null
        }
      }
      this.getDataTotal()
    },
    // 好友拉新： 根据时间进行订单下单时间的筛选
    screenOrderByTime (date) {
      if (date) {
        const tradeStartTime = date[0] || null
        const tradeEndTime = date[1] || null
        this.model = {
          ...this.model,
          tradeStartTime,
          tradeEndTime
        }
      } else {
        this.model = {
          ...this.model,
          tradeStartTime: null,
          tradeEndTime: null
        }
      }

      this.getDataTotal()
    },
    // 好友拉新： 根据时间进行退款时间的筛选
    screenRefundByTime (date) {
      if (date) {
        const chargebackStartTime = date[0] || null
        const chargebackEndTime = date[1] || null
        this.model = {
          ...this.model,
          chargebackStartTime,
          chargebackEndTime
        }
      } else {
        this.model = {
          ...this.model,
          chargebackStartTime: null,
          chargebackEndTime: null
        }
      }

      this.getDataTotal()
    },
    // 返回上一页
    handleBack () {
      this.$router.go(-1)
    },
    // 好友拉新 添加时间的初始化时间
    initTime () {
      const timestamp = 1 * 86400000
      const nowMoment = new Date(new Date().toLocaleDateString()).getTime() + 86399000
      const midTime = nowMoment - timestamp
      const startT = moment(midTime + 1000).subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')
      const endT = moment(nowMoment).format('YYYY-MM-DD HH:mm:ss')
      const { type, start, end } = this.$route.query
      if (Number(type) === 2) {
        return [startT, endT]
      }
      if (Number(type) === 1) {
        // 如果活动 起始时间 比 计算的的开始时间（基于现在的一个月前） 晚 => 起始时间 === 活动起始时间 早 起始时间 === 基于现在的一个月前
        // 如果活动 结束时间 比 现在(用户选择的时刻) 晚 => 结束时间 === 现在； 早 => 结束时间 === 活动结束时间
        if (!moment(start).isBefore(startT)) {
          if (moment(end).isBefore(endT)) {
            return [start, end]
          } else {
            return [start, endT]
          }
        } else {
          if (moment(end).isBefore(endT)) {
            return [startT, end]
          }
        }
        return [startT, endT]
      }
      return [startT, endT]
    },
    // 修改时间
    changeDate (day) {
      const timestamp = day * 86400000
      const nowTime = new Date(new Date().toLocaleDateString()).getTime() + 86399000
      const oldTime = nowTime - timestamp
      const startTime = moment(oldTime + 1000).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(nowTime).format('YYYY-MM-DD HH:mm:ss')
      return [startTime, endTime]
    },
    // 根据类型修改请求时间
    handleChangeDateType (tab) {
      if (tab.name === 'all') {
        this.startTime = null
        this.endTime = null
      } else {
        const data = this.changeDate(parseInt(tab.name))
        this.changeModelDate(data[0], data[1])
      }
    },
    // 根据值修改请求时间
    handleChangeDateValue (date) {
      if (date) {
        const startTime = date[0] || null
        const endTime = date[1] || null
        this.changeModelDate(startTime, endTime)
      } else {
        this.changeModelDate(null, null)
      }
      // this.dateValue = null
    },
    handleChangeShopList (shopIdList) {
      this.model = {
        ...this.model,
        shopIdList
      }
      this.getDataTotal()
    },
    changeModelDate (startTime, endTime) {
      this.time = [startTime, endTime]
      this.model = {
        ...this.model,
        startTime,
        endTime
      }
      this.getDataTotal()
    },
    onSort (data) {
      this.model = { ...this.model, ...data }
    },
    // 切换类型
    handleChangeType (activeType) {
      this.model.sortType = 0
      this.activeType = activeType
    },
    // 导出需要
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    },
    // 导出
    handleExport () {
      const url = this.exportApi
      const form = document.createElement('form')
      Object.keys(this.model).map(item => {
        form.appendChild(this.generateHideElement(item, this.model[item]))
      })
      form.setAttribute('action', url)
      form.setAttribute('method', 'post')
      document.body.appendChild(form)
      form.submit()
    },
    // 好友拉新导出
    friendExport () {
      const sendParams = {
        ...this.model,
        name: this.activityName,
        exportType: this.excelType
      }
      const elem = document.getElementById('exportButton')
      const rect = elem.getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, sendParams).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: rect.top,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    }
  },
  mounted () {
    this.getDataTotal()
  }
}
