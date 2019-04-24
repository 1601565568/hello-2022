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
      tableData: [{
        picture: 'https://img.alicdn.com/bao/uploaded/i1/2250600715/O1CN011H9VdSHO2g6qR1X_!!2250600715.jpg',
        info: {
          name: '年货定制赠品单拍不发女装',
          price: '0.10'
        },
        access: 1
      }, {
        picture: 'https://img.alicdn.com/bao/uploaded/i1/2250600715/O1CN011H9VdSHO2g6qR1X_!!2250600715.jpg',
        info: {
          name: '年货定制赠品单拍不发女装',
          price: '0.10'
        },
        access: 1
      }, {
        picture: 'https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2LxCpvQ9WBuNjSspeXXaz5VXa_!!1640288245.jpg',
        info: {
          name: '年货定制赠品单拍不发女装',
          price: '0.10'
        },
        access: 1
      }, {
        picture: 'https://img.alicdn.com/bao/uploaded/i2/2250600715/O1CN011H9Vd6ARtFHSs0K_!!2250600715.jpg',
        info: {
          name: '年货美翻天的女T恤 V领烫钻设计 独家原创123',
          price: '160.00'
        },
        access: 1
      }],
      tableData1: [{
        picture: 'https://img.alicdn.com/bao/uploaded/i1/2250600715/O1CN011H9VdSHO2g6qR1X_!!2250600715.jpg',
        info: {
          name: '年货定制赠品单拍不发女装',
          price: '0.10'
        },
        jump: 100,
        access: 1,
        rate: '100%'
      }, {
        picture: 'https://img.alicdn.com/bao/uploaded/i1/2250600715/O1CN011H9VdSHO2g6qR1X_!!2250600715.jpg',
        info: {
          name: '年货定制赠品单拍不发女装',
          price: '0.10'
        },
        jump: 564,
        access: 1,
        rate: '60%'
      }, {
        picture: 'https://img.alicdn.com/bao/uploaded/i1/1640288245/TB2LxCpvQ9WBuNjSspeXXaz5VXa_!!1640288245.jpg',
        info: {
          name: '年货定制赠品单拍不发女装',
          price: '0.10'
        },
        jump: 382,
        access: 1,
        rate: '30%'
      }, {
        picture: 'https://img.alicdn.com/bao/uploaded/i2/2250600715/O1CN011H9Vd6ARtFHSs0K_!!2250600715.jpg',
        info: {
          name: '年货美翻天的女T恤 V领烫钻设计 独家原创123',
          price: '160.00'
        },
        jump: 475,
        access: 1,
        rate: '45%'
      }],
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
    getSummariesTop (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '均值'
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
          }, 0)
          sums[index] = (sums[index] / data.length).toFixed(2)
        } else {
          sums[index] = '-'
        }
      })
      return sums
    },
    getSummariesOther (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '均值'
          return
        }
        const valueOther = data.map(item => item[column.property])
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = (sums[index] / data.length).toFixed(2)
        } else {
          var total = 0
          valueOther.forEach((columnValue, indexValue) => {
            total += parseInt(valueOther[indexValue])
          })
          if (!isNaN(total)) {
            sums[index] = (total / data.length).toFixed(2) + '%'
          } else {
            sums[index] = '-'
          }
        }
      })
      return sums
    }
  }
}
