import NsDatetime from 'components/NsDatetime'
import businessEcharts from 'components/NsEcharts'
import NsArea from 'components/NsArea'

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
          left: '15px',
          right: '40px',
          bottom: '40px',
          top: '10px',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['1-5分钟', '26-30分钟', '31-35分钟', '36-40分钟', '41-45分钟', '46-50分钟']
        },
        series: [
          {
            name: '订单数',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: '客户数',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ],
        color: ['#41a2e8', '#ff6e71', '#4fcc8d', '#ffdb5c', '#ff9f7f', '#7fa4e1']
      },
      radio2: 3,
      tableData: [{
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '10%',
        num: 2,
        customerRatio: '20%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '30%',
        num: 2,
        customerRatio: '40%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '50%',
        num: 2,
        customerRatio: '60%'
      }, {
        interval: '1-5分钟',
        orderNumber: 2,
        orderProportion: '90%',
        num: 2,
        customerRatio: '80%'
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
