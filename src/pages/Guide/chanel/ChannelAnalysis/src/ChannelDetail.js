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

      this.$notify.info('导出中，请稍后片刻')
      this.$http.fetch(this.$api.guide.channel.exportChannelAnalysisDailyListExcel, param)
        .then((resp) => {
          this.$notify.success('下载完成')
        }).catch((resp) => {
          if (!resp.size === 0) {
            this.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url

            const fileName = `${this.exportPrefixName}分析统计${this.exportTime}.CSV`
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    }
  }
}
