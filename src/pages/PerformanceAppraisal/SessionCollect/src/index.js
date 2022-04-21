import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from './mixins/redpacketTable'
import { getCurrentMonthArray } from '@/utils/date'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType, // 平台判断
      model: {
        endTime: '',
        launchType: null,
        customerNick: '',
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
      payMap: state => state.pay.wxpayMap
    })
  },
  mounted () {
    // 设置时间筛选默认当月
    this.seachDate = getCurrentMonthArray()
    this.model.startTime = this.seachDate[0]
    this.model.endTime = this.seachDate[1]
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
      const elem = document.getElementById('exportButton')
      const rect = elem.getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
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
  }
}
