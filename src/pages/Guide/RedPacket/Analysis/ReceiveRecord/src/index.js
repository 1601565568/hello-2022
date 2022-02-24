import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../../mixins/redpacketTable'
import { getCurrentMonthArray } from '@/utils/date'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        endTime: '',
        launchType: null,
        customerNick: '',
        payConfigId: null,
        redpackType: null,
        guideIds: [],
        startTime: ''
      },
      url: this.$api.guide.redpacket.getReceiverList,
      exportApi: this.$api.guide.redpacket.exportReceiverList,
      seachDate: []
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
    // 设置时间筛选默认当月
    this.seachDate = getCurrentMonthArray()
    this.model.startTime = this.seachDate[0]
    this.model.endTime = this.seachDate[1]
    this.$store.dispatch('pay/getWxpayList')
    this.$reload()
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  },
  methods: {
    handleExcelExport (model) {
      const params = {
        ...model,
        exportType: 14
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: 180,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    }
  }
}
