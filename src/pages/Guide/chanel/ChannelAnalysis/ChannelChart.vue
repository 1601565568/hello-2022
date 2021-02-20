<template>
  <div class="channel-chart-content">
    <NsEcharts class="echart-size" :options="chartOptions" :theme="'customed'" />
    <div class="channel-total-position">
      <div class="circle-chart-statistics">
        <div class="data-item">
          <span class="data-item-count" @click="getChannelAnalysisChartData">129,831</span>
          <span class="data-item-label">线下添加好友</span>
        </div>
        <div class="data-item">
          <span class="data-item-count">12,831</span>
          <span class="data-item-label">公众号添加好友</span>
        </div>
        <div class="data-item">
          <span class="data-item-count">9,831</span>
          <span class="data-item-label">小程序添加好友</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import customed from './customed'
import NsEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'

export default {
  components: {
    NsEcharts
  },
  props: [ 'channelCodes', 'startTime', 'endTime' ],
  data () {
    return {
      chartOptions: {
        legend: {
          left: '30px',
          right: '20px',
          type: 'scroll'
        },
        tooltip: {
          trigger: 'item'
          // formatter: '{b} {c} ({d}%)'
          // formatter: '{b}: {d}%'
        },
        dataset: [
          {
            dimensions: ['date', '测试', '渠道2', '渠道3'],
            source: [
              { date: '2021-2-17', '测试': 56.5, '渠道2': 32.1, '渠道3': 88.7 },
              { date: '2021-2-18', '测试': 22.5, '渠道2': 62.1, '渠道3': 78.7 },
              { date: '2021-2-19', '测试': 54.5, '渠道2': 82.1, '渠道3': 38.7 }
            ]
          },
          {
            source: [
              ['线下', '小程序', '公众号', '订阅号'],
              [50, 100, 80, 190]
            ]
          }
        ],
        xAxis: { gridIndex: 0, type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { left: 50, right: '35%' },
        series: [
          // { type: 'line' },
          // { type: 'line' },
          // { type: 'line' },
          {
            type: 'pie',
            id: 'pie',
            top: '-20%',
            left: '65%',
            label: false,
            // label: {
            //   formatter: '{b}: {d}%'
            // },
            radius: ['30%', '50%'],
            seriesLayoutBy: 'row',
            datasetIndex: 1
          }
        ]
      }
    }
  },
  watch: {
    async channelCodes (newVal, oldVal) {
      if (newVal.join(',') !== oldVal.join(',')) {
        await this.getChannelAnalysisChartData()
      }
    }
  },
  mounted () {
    this.getChannelAnalysisChartData()
  },
  methods: {
    async getChannelAnalysisChartData () {
      const res = await this.$http.fetch(this.$api.guide.channel.findChannelAnalysisChartData, {
        startTime: this.startTime || '',
        endTime: this.endTime || '',
        // channelCodes: 'SG8105835895695622620707336257,SG4319746901676736202624995038,SG2847297821636330798439885708,SG8368770410217426770957758695'
        channelCodes: this.channelCodes.join(',')
      })
      window.console.log('图数据', res)
      this.chartOptions.dataset[0].dimensions = res.result.channelLineChartData.dimensions
      this.chartOptions.dataset[0].source = res.result.channelLineChartData.source
      const pieChart = this.chartOptions.series.pop()
      this.chartOptions.series = []
      for (let i = 0; i < res.result.channelLineChartData.dimensions.length - 1; i++) {
        this.chartOptions.series.push({ type: 'line' })
      }

      this.chartOptions.series.push(pieChart)
      this.chartOptions = { ...this.chartOptions }
    }
  }
}
</script>

<style lang="scss" scoped>
.channel-chart-content {
  position: relative;
  height: 100%;

  .echart-size {
    width: 100%;
    height: 100%;
  }

  .channel-total-position {
    position: absolute;
    height: 80px;
    width: 65%;
    bottom: 0;
    left: 50px;
    .circle-chart-statistics {
      position: absolute;
      right: -47%;
      bottom: 24px;
      width: 50%;
      height: 64px;
      display: flex;
      justify-content: space-around;
      .data-item {
        width: 100%;
        margin: 0 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
          display: inline-block;
          text-align: center;
        }
        .data-item-count {
          font-size: 20px;
          font-weight: bold;
          line-height: 28px;
        }

        .data-item-label {
          font-size: 12px;
          color: #8c8c8c;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
