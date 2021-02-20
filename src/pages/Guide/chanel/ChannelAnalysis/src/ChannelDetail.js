import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  mixins: [tableMixin],
  data () {
    return {
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
    this.searchform()
  },
  methods: {
    searchform () {
      this.$searchAction$()
      window.console.log('渠道明细列表', this._data)
    },
    setSearchDate (searchDate) {
      if (searchDate.length) {
        this.model = { ...this.model, startTime: searchDate[0], endTime: searchDate[1] }
      } else {
        this.model = { ...this.model, startTime: '', endTime: '' }
      }
    },
    changeSearchDate (searchDate) {
      this.setSearchDate(searchDate)
      this.searchform()
    }
  }
}
