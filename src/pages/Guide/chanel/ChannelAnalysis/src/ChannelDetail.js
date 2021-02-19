import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  watch: {
    analysisDateField (newVal) {
      const todayStartTime = new Date(new Date().toLocaleDateString())
      const todayEndTeime = new Date(todayStartTime.getTime() + 24 * 3600 * 1000 - 1)
      const endTimeStr = moment(todayEndTeime).format('YYYY-MM-DD HH:mm:ss')

      if (newVal === 1) { // 全部
        this.searchDate = []
        this.model = { ...this.model, startTime: '', endTime: '' }
      }

      if (newVal === 2) { // 近7天
        const during7Days = new Date(new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 3600 * 1000)
        this.searchDate = [ this.formatTime(during7Days), endTimeStr ]
        this.model = { ...this.model, startTime: this.formatTime(during7Days), endTime: endTimeStr }
      }

      if (newVal === 3) { // 近30天
        const during30Days = new Date(new Date(new Date().toLocaleDateString()).getTime() - 29 * 24 * 3600 * 1000)
        this.searchDate = [ this.formatTime(during30Days), endTimeStr ]
        this.model = { ...this.model, startTime: this.formatTime(during30Days), endTime: endTimeStr }
      }
      this.searchform()
    }
  },
  data () {
    return {
      analysisDateField: 2,
      searchDate: [
        moment(new Date(new Date(new Date().toLocaleDateString()).getTime() - 6 * 24 * 3600 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date((new Date(new Date().toLocaleDateString())).getTime() + 24 * 3600 * 1000 - 1)).format('YYYY-MM-DD HH:mm:ss')
      ],
      url: this.$api.guide.channel.findChannelAnalysisDailyList,
      model: {
        channelCode: this.$route.params.channelCode,
        startTime: '',
        endTime: ''
      },
      _order: {
        orderDir: 'desc',
        orderKey: 'date'
      }
    }
  },
  mounted () {
    this.model.startTime = this.searchDate[0]
    this.model.endTime = this.searchDate[1]
    this.searchform()
  },
  methods: {
    searchform () {
      this.$searchAction$()
      window.console.log('渠道明细列表', this._data)
    },
    formatTime (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
