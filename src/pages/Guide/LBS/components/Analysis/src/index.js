import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
export default {
  data () {
    return {
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      url: this.$api.guide.lbs.findGroupList,
      model: {
        shopIds: [],
        status: -1,
        startTime: '',
        endTime: ''
      },
      time: [], // 时间筛选
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
          value: -1
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
      dateValue: ''
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
    }
  },
  mixins: [tableMixin],
  methods: {
    // 获取列表统计
    getDataTotal () {
      const parmas = {
        guid: this.$route.query.guid,
        ...this.model
      }
      this.$http.fetch(this.countApi, parmas).then(res => {
        const { shop = 0,
          employee = 0 } = res.result
        this.countData = {
          shop,
          employee
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
      const nowTime = new Date().getTime()
      const oldTime = nowTime - timestamp
      const startTime = moment(oldTime).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(nowTime).format('YYYY-MM-DD HH:mm:ss')
      this.changeModelDate(startTime, endTime)
    },
    // 根据类型修改请求时间
    handleChangeDateType (tab) {
      if (tab.name === 'all') {
        this.startTime = null
        this.endTime = null
      } else {
        this.changeDate(parseInt(tab.name))
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
    }
  }
}
