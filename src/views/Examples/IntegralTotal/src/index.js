import NsDatetime from 'components/NsDatetime'
import businessEcharts from 'components/NsEcharts'

export default {
  components: {
    NsDatetime,
    businessEcharts
  },
  data: function () {
    return {
      time: [],
      selectOptions: [{
        value: '1',
        label: '商品ID'
      }, {
        value: '2',
        label: '商品编码'
      }, {
        value: '3',
        label: '商品关键词'
      }],
      selectValue: '1',
      loadingtable: false,
      option: {
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
          right: '40px',
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
        distribution: 0,
        consume: 1
      }, {
        date: '2018-08-24',
        distribution: 0,
        consume: 1
      }, {
        date: '2018-08-24',
        distribution: 0,
        consume: 1
      }, {
        date: '2018-08-24',
        distribution: 0,
        consume: 1
      }],
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
        } else {
          sums[index] = '-'
        }
      })
      return sums
    }
  }
}
