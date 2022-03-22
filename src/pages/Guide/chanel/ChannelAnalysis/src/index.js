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
      channelCodesDialogVisible: false, // 自定义指标dialog
      channelList: [], // 自定义指标列表
      selectedChannelCodes: [], // 已选自定义指标
      channelFriendRateDialogVisible: false, // 渠道好友占比
      loadingChannelFriendRate: false,
      url: this.$api.guide.channel.findChannelAnalysisList,
      model: {
        channelName: '',
        startTime: '',
        endTime: ''
      },
      _order: {
        orderDir: 'desc',
        orderKey: 'addTotalCount'
      },
      cloudPlatformType: ''
    }
  },
  async mounted () {
    this.cloudPlatformType = this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType
    if (this.searchDate && this.searchDate.length === 2) {
      this.model.startTime = this.searchDate[0]
      this.model.endTime = this.searchDate[1]
    } else {
      this.model.startTime = ''
      this.model.endTime = ''
    }
    this.searchform()
    await this.getChannelList()
  },
  methods: {
    searchform () {
      this.$searchAction$()
    },
    checkDetail (rowData) {
      this.$router.push(`/Guide/chanel/ChannelDetail/${rowData.channelCode}/${rowData.channelName}`)
    },
    async customChannelCodes () {
      this.channelCodesDialogVisible = true
    },
    async chooseChannelCodes (channelCodes) { // 选择自定义指标
      this.selectedChannelCodes = channelCodes
    },
    showChannelFriendRateDialog () {
      this.chartHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.channelFriendRateDialogVisible = true
    },
    async getChannelList () {
      try {
        const res = await this.$http.fetch(this.$api.guide.channel.getChannelList)

        if (res.success) {
          this.channelList = res.result
          this.selectedChannelCodes = res.result.map(item => item.channel_code)
        } else {
          this.$notify.error('自定义指标获取失败')
        }
      } catch (resErr) {
        this.$notify.error('自定义指标获取失败')
      }
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
