import moment from 'moment'
export default {
  data () {
    return {
      model: {
        shopIdList: [],
        state: null,
        startTime: this.changeDate(1)[0],
        endTime: this.changeDate(1)[1],
        guid: this.$route.query.guid
      },
      time: this.changeDate(1), // 时间筛选
      activeType: 'shop', // 选中的数据 shop: 门店  employee：成员
      // 时间筛选
      dateList: [
        {
          label: '昨天',
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
          label: '已结束',
          value: 0
        },
        {
          label: '未开始',
          value: 1
        },
        {
          label: '进行中',
          value: 2
        },
        {
          label: '提前结束',
          value: 3
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
    // 总数接口
    countApi () {
      return this.type === 'Group' ? this.$api.guide.lbs.getGroupStatisticsCount : this.$api.guide.lbs.getFirendsStatisticsCount
    },
    exportApi () {
      if (this.type === 'Group') {
        return this.activeType === 'shop' ? this.$api.guide.lbs.exportGroupShop : this.$api.guide.lbs.exportGroupMember
      }
      return this.activeType === 'shop' ? this.$api.guide.lbs.exportFirendsShop : this.$api.guide.lbs.exportFirendsMember
    },
    activityName () {
      return this.$route.query ? this.$route.query.name : ''
    }
  },
  methods: {
    // 获取列表统计
    getDataTotal () {
      const model = this.model
      const parmas = {
        guid: model.guid,
        shopIdList: model.shopIdList,
        startTime: model.startTime,
        endTime: model.endTime
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
    // 返回上一页
    handleBack () {
      this.$router.go(-1)
    },
    // 修改时间
    changeDate (day) {
      const timestamp = day * 86400000
      const nowTime = new Date(new Date().toLocaleDateString()).getTime()
      const oldTime = nowTime - timestamp
      const startTime = moment(oldTime).format('YYYY-MM-DD HH:mm:ss')
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
      this.dateValue = null
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
    handleChangeType (activeType) {
      this.activeType = activeType
    },
    // 导出
    handleExport () {
      var url = this.exportApi
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('taskId', this.searchMap.taskId))
      if (this.taskMsg.runType === 1) {
        form.appendChild(this.generateHideElement('queryTime', this.searchMap.queryTime))
      }
      form.appendChild(this.generateHideElement('shopId', this.searchMap.shopId))
      form.appendChild(this.generateHideElement('shopName', this.createShopName))
      form.setAttribute('action', url)
      form.setAttribute('method', 'post')
      document.body.appendChild(form)
      form.submit()
    }
  },
  mounted () {
    this.getDataTotal()
  }
}
