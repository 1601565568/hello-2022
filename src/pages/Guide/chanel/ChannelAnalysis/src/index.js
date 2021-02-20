import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'

export default {
  mixins: [ tableMixin ],
  props: [ 'searchDate' ],
  watch: {
    async searchDate (times) {
      if (times !== null) {
        this.model.startTime = times[0]
        this.model.endTime = times[1]
      } else {
        this.model.startTime = ''
        this.model.endTime = ''
      }

      this.searchform()
    }
  },
  computed: {
    exportTime () {
      if (this.searchDate && this.searchDate.length === 2) {
        return `（${this.searchDate.map(item => moment(item).format('YYYY-MM-DD')).join('至')}）`
      }
      return ''
    }
  },
  data () {
    return {
      chartHeight: 200,
      customIndicatorDialogVisible: false, // 自定义指标dialog
      customIndicators: [], // 已选自定义指标
      channelFriendRateDialogVisible: false, // 渠道好友占比
      url: this.$api.guide.channel.findChannelAnalysisList,
      model: {
        channelName: '',
        startTime: '',
        endTime: ''
      },
      _order: {
        orderDir: 'desc',
        orderKey: 'addTotalCount'
      }
    }
  },
  async mounted () {
    if (this.searchDate && this.searchDate.length === 2) {
      this.model.startTime = this.searchDate[0]
      this.model.endTime = this.searchDate[1]
    } else {
      this.model.startTime = ''
      this.model.endTime = ''
    }
    this.searchform()
    window.console.log('渠道统计列表', this._data)
  },
  methods: {
    searchform () {
      this.$searchAction$()
    },
    checkDetail (rowData) {
      this.$router.push(`/Guide/chanel/ChannelDetail/${rowData.channelCode}/${rowData.channelName}`)
    },
    customIndicator () {
      this.customIndicatorDialogVisible = true
    },
    async chooseCustomIndicator (indicators) { // 选择自定义指标
      window.console.log('已选择的自定义指标', indicators)
      this.customIndicators = indicators
    },
    showChannelFriendRateDialog () {
      this.chartHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.channelFriendRateDialogVisible = true
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
      this.$http.fetch(this.$api.guide.channel.exportChannelAnalysisList, param)
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

            const fileName = `渠道分析统计${this.exportTime}.CSV`
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
    }
  }
}
