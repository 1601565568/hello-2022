import NsDatetime from 'components/NsDatetime'

export default {
  components: {
    NsDatetime
  },
  data: function () {
    return {
      create_time: [],
      counts_category: '',
      dataLength: 0, // 表格行数量
      columnsSum: [], // 表格列合计
      columnsAverage: [], // 表格列均值
      tableData3: [{
        date: '2016-05-03',
        date1: 0,
        date2: 1,
        date3: 2
      }, {
        date: '2016-06-02',
        date1: 3,
        date2: 4,
        date3: 5
      }, {
        date: '2016-07-04',
        date1: 6,
        date2: 7,
        date3: 8
      }, {
        date: '2016-08-04',
        date1: 16,
        date2: 17,
        date3: 18
      }, {
        date: '2016-09-04',
        date1: 16,
        date2: 17,
        date3: 18
      }, {
        date: '2016-10-04',
        date1: 16,
        date2: 17,
        date3: 18
      }]
    }
  },
  mounted: function () {
    this.getDataLength() // 计算表格行数量
    this.getRowSum() // 表格行合计
  },
  methods: {
    /* 计算表格行数量 */
    getDataLength () {
      this.dataLength = this.tableData3.length
    },
    /* 获取表格列合计 && 渲染表格列均值 */
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
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
        } else {
          sums[index] = '-'
        }
      })
      this.$set(this, 'columnsSum', sums)
      this.$nextTick(function () {
        this.getColumnsAverage()
      })
      return sums
    },
    /* 计算表格列均值 */
    getColumnsAverage () {
      if (this.columnsSum.length > 0 && this.dataLength > 0) {
        let arr = []
        this.columnsSum.map(item => {
          if (!isNaN(item) && item !== 0) {
            arr.push((item / this.dataLength).toFixed(2))
          } else if (!isNaN(item) && item === 0) {
            arr.push(0)
          }
        })
        this.$set(this, 'columnsAverage', arr)
      }
    },
    /* 表格行合计 */
    getRowSum () {
      if (this.tableData3.length > 0) {
        this.tableData3.map(item => {
          // item.sum = item.date1 + item.date2 + item.date3 // 根据具体的表格数据结构对当前行数据求和
          let sum = 0
          if (item.content) {
            for (let ct of item.content) {
              if (ct && ct.data) {
                for (let ctt of ct.data) {
                  sum = sum + ctt
                }
              }
            }
          }
          item.sum = sum
        })
      }
    }
  }
}
