<template>
  <div class="channel-chart-content">
    <NsEcharts class="echart-size" :options="chartOptions" :theme="'customed'" />
    <div class="channel-total-position">
      <div class="circle-chart-statistics">
        <div class="data-item">
          <span class="data-item-count">129,831</span>
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
  data () {
    return {
      chartOptions: {
        legend: {
          left: '30px',
          right: '20px',
          type: 'scroll'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} {c} ({d}%)'
          formatter: '{b}: {d}%'
        },
        dataset: [
          {
            source: [
              ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
              ['线下', 56.5, 82.1, 88.7, 70.1, 93.4, 85],
              ['小程序', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['公众号', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号1', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号2', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号3', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号4', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号5', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号6', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号7', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号8', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号9', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号10', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号11', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)],
              ['订阅号12', ...[1, 2, 3, 4, 5, 6].map(num => Math.random(0, 1) * 100)]
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
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
          { type: 'line', seriesLayoutBy: 'row' },
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
  methods: {}
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
