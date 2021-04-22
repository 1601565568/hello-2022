<template>
  <div class="channel-chart-content">
    <NsEcharts class="echart-size" :options="chartOptions" :theme="'customed'" />
    <div class="channel-total-position">
      <div class="circle-chart-statistics">
        <div class="data-item" v-for="(item, index) in channlePopover.slice(0, 3)" :key="index">
          <span class="data-item-count">{{item.addCount}}</span>
          <span class="data-item-label" :title="item.channelName">{{item.channelName}}</span>
        </div>
        <el-popover
          v-if="channelCodes.length > 3"
          placement="bottom"
          class="down-icon"
          trigger="click"
          popper-class="channel-list-popover"
        >
          <Icon slot="reference" type="ns-arrow-drowdown" style="color: #8C8C8C;"/>
          <div class="channel-list">
            <div class="data-item" v-for="(item, index) in channlePopover" :key="index">
              <span class="data-item-count">{{item.addCount}}</span>
              <span class="data-item-label" :title="item.channelName">{{item.channelName}}</span>
            </div>
          </div>
        </el-popover>
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
  props: [ 'fullScreen', 'channelCodes', 'searchDate' ],
  data () {
    return {
      chartOptions: {
        legend: {
          bottom: this.fullScreen ? undefined : '22px',
          left: '30px',
          right: '20px',
          type: 'scroll',
          icon: 'roundRect',
          pageIcons: {
            horizontal: [
              'path://M687.4,990l115.3-115.3L427.9,500l374.7-374.7L687.4,10l-490,490L687.4,990z',
              'path://M197.8,124.3L312.2,10l490,490l-490,490L197.8,875.7L573.5,500L197.8,124.3z'
            ]
          },
          pageIconInactiveColor: '#ededed',
          pageIconColor: '#262626',
          pageFormatter: '{current}/{total}',
          pageButtonItemGap: 15,
          pageButtonGap: 24,
          pageIconSize: 12
        },
        tooltip: {
          trigger: 'axis',
          borderColor: '#E4E7ED',
          borderWidth: 1.4,
          backgroundColor: '#fff',
          textStyle: {
            color: '#606266'
          },
          position: function (pos, params, el, elRect, size) {
            return [ pos[0] + 20, pos[1] - 30 ]
          }
        },
        dataset: [
          {
            // dimensions: ['date', '测试', '渠道2', '渠道3'],
            source: [
              // { date: '2021-2-17', '测试': 56.5, '渠道2': 32.1, '渠道3': 88.7 },
              // { date: '2021-2-18', '测试': 22.5, '渠道2': 62.1, '渠道3': 78.7 },
              // { date: '2021-2-19', '测试': 54.5, '渠道2': 82.1, '渠道3': 38.7 }
            ]
          },
          {
            // dimensions: ['channelName', 'addCount'],
            source: [
              // { addCount: 100, channelName: '哈哈' },
              // { addCount: 10, channelName: '哈哈2' },
              // { addCount: 80, channelName: '哈哈3' }
            ]
          }
        ],
        xAxis: { gridIndex: 0, type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { left: 50, right: '35%', bottom: this.fullScreen ? 80 : 130 },
        dataZoom: this.fullScreen ? [
          {
            type: 'slider',
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ] : [],
        series: [
          // { type: 'line' },
          {
            datasetIndex: 1,
            type: 'pie',
            id: 'pie',
            top: '-20%',
            left: '65%',
            bottom: '80',
            label: this.fullScreen ? { formatter: function (tip) {
              return `${tip.name}： ${tip.value.addCount} (${tip.percent}%)`
            } } : false,
            radius: ['30%', '50%'],
            tooltip: {
              trigger: 'item',
              position: 'left',
              formatter: function (tip) {
                return `${tip.name}: ${tip.value.addCount} (${tip.percent}%)`
              }
            }
          }
        ]
      },
      channlePopover: []
    }
  },
  watch: {
    async channelCodes (newVal, oldVal) {
      if (newVal.join(',') !== oldVal.join(',')) {
        await this.getChannelAnalysisChartData()
      }
    },
    async searchDate (times) {
      this.getChannelAnalysisChartData()
    }
  },
  mounted () {
    this.getChannelAnalysisChartData()
  },
  methods: {
    async getChannelAnalysisChartData () {
      try {
        this.$emit('loading')

        const res = await this.$http.fetch(this.$api.guide.channel.findChannelAnalysisChartData, {
          startTime: (this.searchDate && this.searchDate.length) ? this.searchDate[0] : '',
          endTime: (this.searchDate && this.searchDate.length) ? this.searchDate[1] : '',
          channelCodes: this.channelCodes.join(',')
        })

        if (res.success) {
          // this.chartOptions.dataset[0].dimensions = res.result.channelLineChartData.dimensions
          let dimensions = [ 'date' ]
          res.result.channelPieChartData.forEach(item => {
            dimensions.push(item.channelName)
          })
          this.chartOptions.dataset[0].dimensions = dimensions
          this.chartOptions.dataset[0].source = res.result.channelLineChartData.source

          this.chartOptions.dataset[1].source = res.result.channelPieChartData.filter(item => item.addCount > 0)
          this.chartOptions.dataset[1].dimensions = this.chartOptions.dataset[1].source.length ? ['channelName', 'addCount'] : []

          this.channlePopover = res.result.channelPieChartData

          const pieChart = this.chartOptions.series.pop()
          this.chartOptions.series = []
          for (let i = 0; i < res.result.channelLineChartData.dimensions.length - 1; i++) {
            this.chartOptions.series.push({ type: 'line' })
          }
          this.chartOptions.series.push(pieChart)

          this.chartOptions = { ...this.chartOptions }
        } else {
          this.$notify.error('渠道好友占比数据获取失败')
        }
      } catch (error) {
        this.$notify.error('渠道好友占比数据获取失败')
      } finally {
        this.$emit('loading')
      }
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
    height: 0;
    width: 65%;
    bottom: 0;
    left: 50px;
    .circle-chart-statistics {
      position: absolute;
      right: -47%;
      bottom: 84px;
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
        align-items: center;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 152px;
        }
      }

      .down-icon {
        font-size: 16px;
        position: absolute;
        bottom: -16px;
        cursor: pointer;
        &:hover {
          color: #0091fa;
        }
      }
    }
  }
}

.channel-list-popover {
  .channel-list {
    max-width: 782px;
    max-height: 306px;
    padding: 15px 10px 11px;
    overflow: overlay;
    display: flex;
    flex-wrap: wrap;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #9093994d;
    }

    .data-item {
      width: 152px;
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
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
</style>
