import NsDatetime from 'components/NsDatetime'

export default {
  components: {
    NsDatetime
  },
  data: function () {
    return {
      time: [],
      loadingtable: false,
      tableData: [{
        title: '上周数据',
        progress: 0,
        progress1: 5,
        progress2: 7,
        dsrNum: 8,
        dsrNum1: 75,
        dsrNum2: 4,
        statisticians: 'admin',
        statisticalTime: '2018-09-03'
      }, {
        title: '本周数据',
        progress: 0,
        progress1: 5,
        progress2: 7,
        dsrNum: 8,
        dsrNum1: 75,
        dsrNum2: 4,
        statisticians: 'admin',
        statisticalTime: '2018-09-03'
      }],
      tableData1: [{
        title: '上周数据',
        order: 0,
        returnOrder: 5,
        redeem: 7,
        price: 8,
        objects: 75,
        inquiries: 4,
        payment: 152,
        rate: '20%'
      }, {
        title: '本周数据',
        order: 0,
        returnOrder: 5,
        redeem: 7,
        price: 8,
        objects: 75,
        inquiries: 4,
        payment: 84,
        rate: '20%'
      }],
      tableData2: [{
        title: '上周数据',
        order: 0,
        returnOrder: 5,
        redeem: 7,
        price: 8,
        objects: 75,
        inquiries: 4,
        payment: 84,
        rate: '20%'
      }, {
        title: '本周数据',
        order: 0,
        returnOrder: 5,
        redeem: 7,
        price: 8,
        objects: 75,
        inquiries: 4,
        payment: 84,
        rate: '20%'
      }],
      tableData3: [{
        title: '一周内会员营销统计',
        progress: 0,
        progress1: 5,
        progress2: 7,
        dsrNum: 8,
        dsrNum1: 75,
        dsrNum2: 4,
        statisticians: 15154
      }, {
        title: '本周数据',
        progress: 0,
        progress1: 5,
        progress2: 7,
        dsrNum: 8,
        dsrNum1: 75,
        dsrNum2: 4,
        statisticians: 15203
      }]
    }
  },
  mounted: function () {
  },
  methods: {
    /* 合并单元格函数 */
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 7 || columnIndex === 8) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    /* 合并单元格函数 */
    objectSpanMethodSec ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    /* 表格表头内容处理函数 */
    renderContent (h, { column }) {
      return h('span', '店铺：孔方时代')
    }
  }
}
