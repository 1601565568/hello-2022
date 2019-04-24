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
      loadingtable: false,
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['描述相符', '服务态度', '发货速度'],
          y: 220,
          x: 'center'
        },
        grid: {
          left: '30px',
          right: '30px',
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
            data: ['2018-02', '2018-03', '2018-04', '2018-05', '2018-06', '2018-07', '2018-08']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '描述相符',
            type: 'line',
            symbol: 'diamond',
            data: [0.03, -0.03, 0.04, 0.05, 0, -0.05, 0]
          },
          {
            name: '服务态度',
            type: 'line',
            symbol: 'triangle',
            data: [0.01, 0.03, 0.05, 0.01, 0.02, 0.03, 0.01]
          },
          {
            name: '发货速度',
            type: 'line',
            symbol: 'emptyCircle',
            data: [0.01, -0.02, 0.02, 0.05, 0.03, 0.02, 0]
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      tableData: [{
        date: '2016-05-02',
        description: 0,
        attitude: 1,
        speed: 0
      }, {
        date: '2016-05-04',
        description: 0,
        attitude: 1,
        speed: 0
      }, {
        date: '2016-05-01',
        description: 0,
        attitude: 1,
        speed: 0
      }, {
        date: '2016-05-03',
        description: 0,
        attitude: 1,
        speed: 0
      }],
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
