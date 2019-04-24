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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['订单数', '客户数'],
          y: 370,
          x: 'center'
        },
        grid: {
          left: '30px',
          right: '30px',
          bottom: '40px',
          top: '10px',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['0天', '1天']
        },
        series: [
          {
            name: '订单数',
            type: 'bar',
            data: [18203, 23489]
          },
          {
            name: '客户数',
            type: 'bar',
            data: [19325, 23438]
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
