import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'

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
      },
      exportTime: '',
      cloudPlatformType: ''
    }
  },
  computed: {
    exportPrefixName () {
      if (this.$route.params.channelName) {
        return this.$route.params.channelName
      }
      return ''
    }
  },
  mounted () {
    this.cloudPlatformType = this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    this.searchform()
  },
  methods: {
    searchform () {
      this.$searchAction$()
    },
    setSearchDate (searchDate) {
      if (searchDate.length) {
        this.model = { ...this.model, startTime: searchDate[0], endTime: searchDate[1] }
        this.exportTime = `（${searchDate.map(item => moment(item).format('YYYY-MM-DD')).join('至')}）`
      } else {
        this.model = { ...this.model, startTime: '', endTime: '' }
        this.exportTime = ''
      }
    },
    changeSearchDate (searchDate) {
      this.setSearchDate(searchDate)
      this.searchform()
    },
    checkTableDataExists () {
      if (!this._data || !this._data._table || !this._data._table.data || this._data._table.data.length < 1) {
        this.$notify.error('当前没有匹配的数据项')
        return true
      }
      return false
    },
    exportFile () {
      if (this.checkTableDataExists()) {
        return false
      }

      let param = this.$generateParams$()
      const sendParams = {
        ...param.searchMap,
        orderDir: param.orderDir,
        orderKey: param.orderKey,
        exportType: 34,
        channelName: this.$route.params.channelName || ''
      }
      const elem = document.getElementById('exportButton')
      const rect = elem.getBoundingClientRect()
      this.$http.fetch(this.$api.guide.task.exportExcel, sendParams).then((resp) => {
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
