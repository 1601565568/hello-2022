/*
 * @Date: 2022-04-22 19:32:43
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-27 16:38:42
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
    }
  }
}
