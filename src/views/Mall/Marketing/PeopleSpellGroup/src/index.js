import tableMixin from 'mixins/table'
export default {
  name: 'PeopleSpellGroup',
  mixins: [tableMixin],
  data: function () {
    return {
      showCreate: true,
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
    handleSelect:function (index, indexPath) {
      // wmspellgroupFindList拼团列表
      // deleteSpellGroup列表删除
      let that = this
      that.$http.fetch(this.$api.guide.marketing.wmspellgroupFindList,
      {name: row.id}).then(() => {

      }).catch((resp) => {
        
      })


      // apiRequestConfirm('删除此活动').then(() => {
      //   that.$http.fetch(this.$api.guide.marketing.deletePreferentialActivity,
      //     {activityId: row.id}).then(() => {
      //       that.$reload()
      //       that.$notify.success('删除成功')
      //     }).catch((resp) => {
      //       that.$message.error(resp.msg || '删除失败，请稍后再试')
      //     })
      // }).catch(() => {})

      console.log(this.activeIndex)
      console.log(index)
      console.log(indexPath)
    },
    createNew () {
      console.log('000000')
      this.showCreate = false
    }
  },
  mounted () {
  }
}
