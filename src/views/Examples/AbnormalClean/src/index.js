import NsDatetime from 'web-crm/src/components/NsDatetime'
import businessEcharts from 'web-crm/src/components/NsEcharts'

export default {
  components: {
    NsDatetime,
    businessEcharts
  },
  data: function () {
    return {
      time: [],
      radio: 1,
      loadingtable: false,
      /* 此处图表只是模拟数据 */
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: '73%',
            center: ['50%', '50%'],
            data: [
              { value: 9, name: '成功营销人数' },
              { value: 0, name: '清洗人数' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      option1: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: '73%',
            center: ['50%', '50%'],
            data: [
              { value: 11.94, name: '营销成本' },
              { value: 0, name: '已节约成本' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      option2: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['积分发放', '积分消耗'],
          y: 'bottom',
          x: 'center'
        },
        grid: {
          left: '10px',
          right: '50px',
          bottom: '40px',
          top: '10px',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        calculable: false,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['2018-02-01', '2018-03-01', '2018-04-01', '2018-05-01', '2018-06-01', '2018-07-01', '2018-08-01']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '积分发放',
            type: 'line',
            symbol: 'diamond',
            data: [1, 5, 50, 12, 40, 58, 12]
          },
          {
            name: '积分消耗',
            type: 'line',
            symbol: 'triangle',
            data: [45, 58, 12, 43, 62, 24, 35]
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      tableData: [{
        date: '2018-08-24',
        nickName: 'wuhuaan_1987',
        beforeTel: '13112345678',
        afterTel: '15012341234',
        state: '成功'
      }, {
        date: '2018-08-24',
        nickName: 'wuhuaan_1987',
        beforeTel: '13112345678',
        afterTel: '15012341234',
        state: '成功'
      }, {
        date: '2018-08-24',
        nickName: 'wuhuaan_1987',
        beforeTel: '13112345678',
        afterTel: '15012341234',
        state: '成功'
      }, {
        date: '2018-08-24',
        nickName: 'wuhuaan_1987',
        beforeTel: '13112345678',
        afterTel: '15012341234',
        state: '成功'
      }],
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
