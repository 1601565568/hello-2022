import NsDatetime from 'web-crm/src/components/NsDatetime'
import businessEcharts from 'web-crm/src/components/NsEcharts'
import NsArea from 'web-crm/src/components/NsArea'

export default {
  components: {
    NsDatetime,
    businessEcharts,
    NsArea
  },
  data: function () {
    return {
      time: [],
      loadingtable: false,
      selectOptions: [{
        value: '1',
        label: '新老客户'
      }, {
        value: '2',
        label: '会员等级'
      }],
      selectValue: '1',

      selectOptions1: [{
        value: '1',
        label: '不限'
      }, {
        value: '2',
        label: '新客户'
      }, {
        value: '3',
        label: '老客户'
      }],
      selectValue1: '',
      selectOptions2: [{
        value: '1',
        label: '不限'
      }, {
        value: '2',
        label: '店铺客户'
      }, {
        value: '3',
        label: '普通会员'
      }, {
        value: '4',
        label: '高级会员'
      }, {
        value: '5',
        label: 'VIP会员'
      }, {
        value: '6',
        label: '至尊VIP'
      }, {
        value: '7',
        label: '等级5'
      }, {
        value: '8',
        label: '等级6'
      }],
      selectValue2: '',
      banners: [],
      checked: false,
      key: {
        children: 'children',
        label: 'label',
        value: 'id',
        disabled: 'disabled'
      },
      selectedOptions3: [110000, 110100],
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          data: ['主动评价', '自动评价'],
          y: 'bottom',
          x: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '主动评价' },
              { value: 310, name: '自动评价' }
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
