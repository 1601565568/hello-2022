/*
 * @Date: 2022-04-22 19:32:43
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-27 10:52:25
 * @FilePath: \ECRP-SG-WEB\src\pages\PerformanceAppraisal\SessionCollect\src\index.js
 */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { formatTime, disabledAfterDate } from '@/utils/date'
export default {
  data () {
    return {
      _order: {
        time: '',
        userIds: []
      },
      guideIds: [],
      url: this.$api.weWork.sessionCollect.getSessionStatistics,
      pickerOptions: {
        disabledDate: disabledAfterDate
      }
    }
  },
  mixins: [tableMixin],
  mounted () {
    this.initPage()
  },
  watch: {
    guideIds (newVal) {
      // this.$data._order.userId = newVal.join(',')
    }
  },
  methods: {
    initPage () {
      this.$data._order.time = formatTime(new Date(new Date() - 24 * 60 * 60 * 1000), 'YYYY-MM-DD')
      this.$reload()
    },
    changeSearchfrom (obj = {}) {
      this.$data._order = { ...this.$data._order, ...obj }
      this.$searchAction$()
    },
    handleGuideIds (arr) {
      this.guideIds = arr.map((item) => { return item.userId })
      this.changeSearchfrom({ userIds: this.guideIds })
    },
    // 导出数据
    handleExcelExport () {
      const params = {
        ...this.$data._order,
        exportType: 100
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
