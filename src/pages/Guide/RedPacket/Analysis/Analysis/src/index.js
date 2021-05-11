import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import redpacketTable from '../../../mixins/redpacketTable'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      model: {
        endTime: '',
        payConfigId: null,
        startTime: ''
      },
      url: this.$api.guide.redpacket.getDataAnalysisList,
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
      saleOption: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: 0,
          left: 0,
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
          left: 16,
          right: 16,
          top: 50,
          bottom: 50,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
          name: '数量',
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
        series: [
          {
            name: '累计转出金额',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '今日转出金额',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '员工转出金额',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '裂变大师转出金额',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      },
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
          key: 'sendTotalNum',
          nick: '员工转出金额（元）',
          value: 0
        },
        {
          key: 'todaySendNum',
          nick: '裂变大师转出金额（元）',
          value: 0
        }
      ]
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
    }
  },
  mounted () {
    this.$store.dispatch('pay/getWxpayList')
    this.changeDate(this.$refs.datePickerBar.getDuringDateArray(7))
    this.$reload()
    this.getSendStatistics()
  },
  methods: {
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
    changeDate (value) {
      if (value && value.length) {
        this.model.startTime = value[0]
        this.model.endTime = value[1]
      }
    },
    handleChangeDate (value) {
      this.changeDate(value)
      this.changeSearchfrom(this.model)
    }
  }
}
