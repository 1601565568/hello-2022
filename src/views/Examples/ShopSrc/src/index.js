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
          data: ['PV', 'UV', 'IPV', 'IUV'],
          y: 'bottom',
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
            name: 'PV',
            type: 'line',
            symbol: 'diamond',
            data: [1, 5, 50, 12, 40, 58, 12]
          },
          {
            name: 'UV',
            type: 'line',
            symbol: 'triangle',
            data: [45, 58, 12, 43, 62, 24, 35]
          },
          {
            name: 'IPV',
            type: 'line',
            symbol: 'emptyDiamond',
            data: [31, 4, 5, 52, 42, 72, 42]
          },
          {
            name: 'IUV',
            type: 'line',
            symbol: 'emptyCircle',
            data: [45, 85, 78, 65, 45, 12, 12]
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      radioValue: 1,
      tableData: [{
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '100%',
        num: 2,
        customerRatio: '100%'
      }],
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
