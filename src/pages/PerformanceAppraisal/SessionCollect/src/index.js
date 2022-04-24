/*
 * @Date: 2022-04-22 19:32:43
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-24 11:26:51
 * @FilePath: \ECRP-SG-WEB\src\pages\PerformanceAppraisal\SessionCollect\src\index.js
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from './mixins/redpacketTable'
import { formatTime } from '@/utils/date'
export default {
  data () {
    return {
      _order: {
        time: '',
        userId: ''
      },
      guideIds: [],
      url: this.$api.weWork.sessionCollect.getSessionStatistics,
      exportApi: this.$api.guide.redpacket.exportReceiverList,
      seachDate: []
    }
  },
  mixins: [tableMixin, redpacketTable],
  mounted () {
    this.initPage()
    this.$reload()
  },
  watch: {
    guideIds (newVal) {
      // this.$data._order.userId = newVal.join(',')
    }
  },
  methods: {
    initPage () {
      this.$data._order.time = formatTime(new Date())
    },
    changeSearchfrom (obj = {}) {
      this.$data._order = { ...this.$data._order, ...obj }
      this.$searchAction$()
    },
    handleGuideIds (arr) {
      this.guideIds = arr.map((item) => { return item.userId })
      this.changeSearchfrom({ userId: this.guideIds.join(',') })
    },
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
