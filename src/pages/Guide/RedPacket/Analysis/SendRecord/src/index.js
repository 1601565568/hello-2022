import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../../mixins/redpacketTable'
import { getCurrentMonthArray } from '@/utils/date'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        endTime: '',
        payConfigId: null,
        launchType: null,
        startTime: '',
        redpackName: '',
        guideIds: []
      },
      url: this.$api.guide.redpacket.getRecordList,
      exportApi: this.$api.guide.redpacket.exportRecordList,
      seachDate: [],
      dataList: [
        {
          key: 'sendTotalMoney',
          nick: '累计发放金额（元）',
          value: 0
        },
        {
          key: 'todaySendMoney',
          nick: '今日发放金额（元）',
          value: 0
        },
        {
          key: 'sendTotalNum',
          nick: '累计发放红包个数',
          value: 0
        },
        {
          key: 'todaySendNum',
          nick: '今日发放红包个数',
          value: 0
        }
      ],
      drawer: false,
      activeId: null
    }
  },
  mixins: [tableMixin, redpacketTable],
  computed: {
    ...mapState({
      wxpayList: state => state.pay.wxpayList,
      payMap: state => state.pay.wxpayMap
    }),
    payList () {
      return [{ label: '全部', value: null }, ...this.wxpayList]
    },
    redpacketTypeListSelect () {
      return [{ label: '全部', value: null }, ...this.redpacketTypeList]
    },
    setTypeListSelect () {
      return [{ label: '全部', value: null }, ...this.setTypeList]
    }
  },
  mounted () {
    this.seachDate = getCurrentMonthArray()
    this.model.startTime = this.seachDate[0]
    this.model.endTime = this.seachDate[1]
    this.$store.dispatch('pay/getWxpayList')
    this.$reload()
    this.getSendStatistics()
  },
  methods: {
    handleExcelExport (model) {
      const params = {
        ...model,
        exportType: 15
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: 430,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    },
    /**
     * 查看领取详情
     * @param {*} id
     */
    handlePreview (id) {
      this.activeId = id
      this.changeDrawer(true)
    },
    /**
     * 领取详情弹框开关
     * @param {*} [drawer=!this.drawer]
     */
    changeDrawer (drawer = !this.drawer) {
      this.drawer = drawer
    },
    /**
     * 修改支付
     * @param {*} value
     */
    handleChange (value) {
      this.getSendStatistics()
      this.changeSearchfrom({ payConfigId: value })
    },
    /**
     * 获取头部概览
     */
    getSendStatistics () {
      this.$http.fetch(this.$api.guide.redpacket.getSendStatistics, { payConfigId: this.model.payConfigId }).then(res => {
        if (res.success) {
          // 是否是金额格式
          const moneyItem = ['sendTotalMoney', 'todaySendMoney']
          this.dataList = this.dataList.map(item => ({
            ...item,
            value: res.result[item.key],
            isMoney: moneyItem.includes(item.key)
          }))
        }
      }).catch((resp) => {
        this.$notify.error(resp.msg)
      })
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  }
}
