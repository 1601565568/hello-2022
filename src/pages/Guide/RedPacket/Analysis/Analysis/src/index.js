import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../../mixins/redpacketTable'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        endTime: '',
        payConfigId: null,
        startTime: '',
        guideIds: []
      },
      url: this.$api.guide.redpacket.getDataAnalysisList,
      urlByGuide: this.$api.guide.redpacket.getDataAnalysisListByGuideId,
      exportApi: this.$api.guide.redpacket.exportDataAnalysisList, // 导出地址
      dateList: [
        {
          label: 2,
          value: '近7天'
        }, {
          label: 3,
          value: '近30天'
        }
      ],
      defaultPickDay: 7,
      // 表单数据
      saleOption: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: 0,
          left: 0,
          itemWidth: 10,
          itemHeight: 10,
          data: [{
            icon: 'rect',
            name: '累计转出金额'
          }, {
            icon: 'rect',
            name: '今日转出金额'
          }, {
            icon: 'rect',
            name: '员工转出金额'
          }, {
            icon: 'rect',
            name: '裂变大师转出金额'
          }]
        },
        grid: {
          left: 46,
          right: 46,
          top: 50,
          bottom: 50,
          containLabel: true
        },
        color: ['#F7B586', '#95DA73 ', '#7962EC'],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: 'rgba(0,0,0,0.25)',
            lineHeight: 24
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.25)'
            }
          }
        },
        yAxis: {
          name: '发放金额',
          nameTextStyle: {
            color: 'rgba(0,0,0,0.25)',
            padding: [4, 4, 4, 24],
            verticalAlign: 'bottom',
            lineHeight: 24
          },
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: 'rgba(0,0,0,0.25)',
            inside: true,
            margin: 0,
            verticalAlign: 'bottom',
            lineHeight: 24
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.25)'
            }
          }
        },
        series: this.setDefaultChartData()
      },
      // 统计数字
      dataList: [
        {
          key: 'sendTotalMoney',
          nick: '累计转出金额（元）',
          value: 0
        },
        {
          key: 'todaySendMoney',
          nick: '今日转出金额（元）',
          value: 0
        },
        {
          key: 'guideSendMoney',
          nick: '员工转出金额（元）',
          value: 0
        },
        {
          key: 'fissionSendMoney',
          nick: '裂变大师转出金额（元）',
          value: 0
        }
      ],
      selectDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime()
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.selectDate !== '') {
            const one = 30 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      activeName: 'date'
    }
  },
  mixins: [tableMixin, redpacketTable],
  computed: {
    ...mapState({
      wxpayList: state => state.pay.wxpayList,
      payMap: state => state.pay.wxpayMap
    }),
    payList () {
      return [{ label: '全部', value: null }, ...this.wxpayList]
    },
    xAxisDate () { // 根据时间区间计算出每一日期
      let dateList = []
      const startTime = this.getDate(this.model.startTime)
      const endTime = this.getDate(this.model.endTime)
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        const year = startTime.getFullYear()
        const month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1
        const day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate()
        dateList.push(year + '-' + month + '-' + day)
        startTime.setDate(startTime.getDate() + 1)
      }
      return dateList
    }
  },
  mounted () {
    this.$store.dispatch('pay/getWxpayList')
    // 日期默认近7天，设置第一次请求数据
    this.changeDate(this.$refs.datePickerBar.getDuringDateArray(7))
    // 头部概览数据
    this.getSendStatistics()
    // 图表数据
    this.getEChateData()
    // 表格数据
    this.$reload()
  },
  methods: {
    handleExcelExport (model) {
      const params = {
        ...model,
        exportType: 13
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$store.dispatch({
          type: 'down/downAction',
          status: true,
          top: 380,
          right: 60
        })
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
    },
    /**
     * 设置图表默认数据
     * @return {*}
     */
    setDefaultChartData () {
      return [
        {
          name: '今日转出金额',
          type: 'line',
          data: []
        },
        {
          name: '员工转出金额',
          type: 'line',
          data: []
        },
        {
          name: '裂变大师转出金额',
          type: 'line',
          data: []
        }
      ]
    },
    /**
     * 获取图表数据
     */
    getEChateData () {
      const searchMap = this.model
      this.$http.fetch(this.url, { start: 0, length: 30, searchMap }).then(res => {
        if (res.success) {
          this.saleOption.xAxis.data = this.xAxisDate
          this.saleOption.series = this.formatChart(res.result.data, this.xAxisDate)
        }
      })
    },
    /**
     * 格式化图表数据 没有值的天数默认0
     * @param {*} list
     * @param {*} dateList
     * @return {*}
     */
    formatChart (resList, dateList) {
      const data = this.setDefaultChartData()
      const list = [...resList].reverse()
      dateList.map(item => {
        if (list.length) {
          if (item === list[0].dayTime) {
            const { fissionSendMoney, guideSendMoney, todaySendMoney } = list[0]
            this.setChartData(todaySendMoney / 100, guideSendMoney / 100, fissionSendMoney / 100, data)
            list.shift()
          } else {
            this.setChartData(0, 0, 0, data)
          }
        } else {
          this.setChartData(0, 0, 0, data)
        }
      })
      return data
    },
    /**
     * 设置每天图表数据
     * @param {*} item1
     * @param {*} item2
     * @param {*} item3
     * @param {*} list
     */
    setChartData (item1, item2, item3, list) {
      list[0].data.push(item1)
      list[1].data.push(item2)
      list[2].data.push(item3)
    },
    /**
     * 获取概览数据
     */
    getSendStatistics () {
      this.$http.fetch(this.$api.guide.redpacket.getRecordStatistics, this.model).then(res => {
        if (res.success) {
          this.dataList = this.dataList.map(item => ({
            ...item,
            value: res.result[item.key],
            isMoney: true
          }))
        }
      }).catch((resp) => {
        this.$notify.error(resp.msg)
      })
    },
    /**
     * 格式化日期格式
     * @param {*} datestr
     * @return {*}
     */
    getDate (datestr) {
      const noTime = datestr.split(' ')[0]
      const temp = noTime.split('-')
      const date = new Date(temp[0], temp[1] - 1, temp[2])
      return date
    },
    /**
     * 格式化修改时间
     */
    changeDate (value) {
      if (value && value.length) {
        this.model.startTime = value[0]
        this.model.endTime = value[1]
      }
    },
    $searchAction$ () {
      if (this.$refs.TableByDate && this.$refs.TableByGuide) {
        this.$refs.TableByDate.$searchAction$()
        this.$refs.TableByGuide.$searchAction$()
      }
    },
    $reload () {
      if (this.$refs.TableByDate && this.$refs.TableByGuide) {
        this.$refs.TableByDate.$reload()
        this.$refs.TableByGuide.$reload()
      }
    },
    /**
     * 修改日期后的回调
     * @param {*} value
     */
    handleChangeDate (value) {
      this.changeDate(value)
      this.getEChateData()
      this.changeSearchfrom(this.model)
    },
    /**
     * 修改支付配置
     * @param {*} value
     */
    handleChangePay (value) {
      // 头部概览数据
      this.getSendStatistics()
      // 图表数据
      this.getEChateData()
      this.changeSearchfrom({ payConfigId: value })
    },
    /**
     * 修改员工
     * @param {*} value
     */
    handleChangeGuide (value) {
      // 头部概览数据
      this.getSendStatistics()
      // 图表数据
      this.getEChateData()
      this.changeSearchfrom({ guideIds: value })
    }
  }
}
