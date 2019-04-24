import NsDatetime from 'web-crm/src/components/NsDatetime'
import businessEcharts from 'web-crm/src/components/NsEcharts'
import chinaMap from './china.json'

businessEcharts.registerMap('china', chinaMap)
export default {
  components: {
    NsDatetime,
    businessEcharts
  },
  data: function () {
    return {
      time: [],
      loadingtable: false, // #aad5ff
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false
        },
        visualMap: {
          show: false,
          textStyle: {
            color: '#252525'
          },
          pieces: [
            { min: 10000000, label: '>1000万', color: 'rgba(16, 109, 221, 1)' },
            { min: 5000000, max: 10000000, label: '500万-1000万', color: 'rgba(16, 109, 221, .85)' },
            { min: 1000000, max: 5000000, label: '100万-500万', color: 'rgba(16, 109, 221, .70)' },
            { min: 100000, max: 1000000, label: '10万-100万', color: 'rgba(16, 109, 221, .55)' },
            { min: 10000, max: 100000, label: '1-10万', color: 'rgba(16, 109, 221, .40)' },
            { min: 0, max: 10000, label: '0-1万', color: '#5d9cec' }
          ]
        },
        series: [
          {
            name: '客户地区分布',
            type: 'map',
            showLegendSymbol: false,
            mapType: 'china',
            itemStyle: {
              normal: {
                borderWidth: 1,
                borderColor: '#eee',
                label: {
                  show: false
                }
              },
              emphasis: { // 也是选中样式
                borderColor: '#fff',
                color: '#d64748',
                label: {
                  show: false
                }
              }
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            data: [
              { 'name': '北京', 'value': 1 },
              { 'name': '天津', 'value': 12312 },
              { 'name': '上海', 'value': 123123 },
              { 'name': '重庆', 'value': 1412411 },
              { 'name': '河北', 'value': 14124124 },
              { 'name': '河南', 'value': 515747 },
              { 'name': '云南', 'value': 1231231 },
              { 'name': '辽宁', 'value': 89012312 },
              { 'name': '黑龙江', 'value': 15152 },
              { 'name': '湖南', 'value': 4514215 },
              { 'name': '安徽', 'value': 21341 },
              { 'name': '山东', 'value': 12125 },
              { 'name': '新疆', 'value': 9523182 },
              { 'name': '江苏', 'value': 12154823 },
              { 'name': '浙江', 'value': 4141123 },
              { 'name': '江西', 'value': 41541123 },
              { 'name': '湖北', 'value': 1652451 },
              { 'name': '广西', 'value': 12514235 },
              { 'name': '甘肃', 'value': 51801 },
              { 'name': '山西', 'value': 1515201 },
              { 'name': '内蒙古', 'value': 9513559 },
              { 'name': '陕西', 'value': 2612358 },
              { 'name': '吉林', 'value': 9210326 },
              { 'name': '福建', 'value': 812580 },
              { 'name': '贵州', 'value': 8452000 },
              { 'name': '广东', 'value': 84512311 },
              { 'name': '青海', 'value': 8487812 },
              { 'name': '西藏', 'value': 5189231 },
              { 'name': '四川', 'value': 12312 },
              { 'name': '宁夏', 'value': 141677 },
              { 'name': '海南', 'value': 7893452 },
              { 'name': '台湾', 'value': 5276823 },
              { 'name': '香港', 'value': 237 },
              { 'name': '澳门', 'value': 8432 },
              { 'name': '南海诸岛', 'value': 325641 }
            ]
          }
        ]
      },
      option1: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['交易成功', '自动评价', '自动评价占比（%）', '主动评价', '主动评价占比（%）'],
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
            name: '交易成功',
            type: 'line',
            symbol: 'diamond',
            data: [1, 5, 50, 12, 40, 58, 12]
          },
          {
            name: '自动评价',
            type: 'line',
            symbol: 'triangle',
            data: [45, 58, 12, 43, 62, 24, 35]
          },
          {
            name: '自动评价占比（%）',
            type: 'line',
            symbol: 'emptyDiamond',
            data: [31, 4, 5, 52, 42, 72, 42]
          },
          {
            name: '主动评价',
            type: 'line',
            symbol: 'emptyCircle',
            data: [45, 85, 78, 65, 45, 12, 12]
          },
          {
            name: '主动评价占比（%）',
            type: 'line',
            symbol: 'emptyTriangle',
            data: [52, 45, 42, 45, 65, 0, 20]
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      radio2: 3,
      tableData: [{
        month: '2018-07',
        transactions: 0,
        evaluation: 0,
        evaluationRatio: '30%',
        active: 0,
        ratio: '10%'
      }, {
        month: '2018-06',
        transactions: 0,
        evaluation: 0,
        evaluationRatio: '30%',
        active: 0,
        ratio: '60%'
      }, {
        month: '2018-05',
        transactions: 0,
        evaluation: 0,
        evaluationRatio: '30%',
        active: 0,
        ratio: '80%'
      }, {
        month: '2018-04',
        transactions: 0,
        evaluation: 0,
        evaluationRatio: '10%',
        active: 0,
        ratio: '20%'
      }],
      columnsAverage: [], // 表格列均值
      currentPage: 5
    }
  },
  mounted: function () {
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const Average = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          Average[index] = '均值'
          return
        }

        const valueOther = data.map(item => item[column.property])
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              Average[index] = (prev + curr) / data.length
              return prev + curr
            } else {
              Average[index] = prev / data.length
              return prev
            }
          }, 0)
        } else {
          sums[index] = '-'
          /* 计算比例均值 */
          var total = 0
          valueOther.forEach((columnValue, indexValue) => {
            total += parseInt(valueOther[indexValue])
          })
          Average[index] = total / data.length + '%'
        }
      })
      this.$set(this, 'columnsAverage', Average)
      return sums
    }
  }
}
