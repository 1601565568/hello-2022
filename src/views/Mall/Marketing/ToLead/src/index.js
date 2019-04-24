import tableMixin from 'web-crm/src/mixins/table'

export default {
  name: 'PeopleSpellGroup',
  mixins: [tableMixin],
  data: function () {
    return {
      searchform: {
        time: []
      },
      productName: 'nnnnnn',
      activeIndex: '1',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    tableRowClassName (rowIndex) {
      if ((rowIndex % 2) === 0) {
        return 'success-row'
      }
    },
    new () {
      console.log('00000')
    },
    handleSelect (index, indexPath) {
      console.log(this.activeIndex)
      console.log(index)
      console.log(indexPath)
    }
  },
  mounted () {
  }
}
