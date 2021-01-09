// import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
export default {
  data () {
    return {
      pagination: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      // 筛选数据
      model: {
        start: 0,
        length: 15,
        content: '', // 内容
        startTime: '',
        endTime: '',
        type: '', // 发布类型
        guideIdList: [] // 筛选员工
      },
      // 筛选日期
      searchDate: [],
      // 类型列表
      statusOptionList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '企业发表',
          value: 0
        },
        {
          label: '个人发表',
          value: 1
        }
      ],
      drawer: true,
      // 侧边栏信息
      itemDate: {},
      activeIndex: -1,
      table: {
        data: [{
          name: '123123',
          guideNames: '1',
          address: '12312312',
          status: '12312'
        }]
      }
    }
  },
  // mixins: [tableMixin],
  methods: {
    setTime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      const startTime = moment(start).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(start).format('YYYY-MM-DD HH:mm:ss')
      this.searchDate = [startTime, endTime]
    },
    searchDateChange (obj = {}) {
      this.model = Object.assign(this.model, obj)
    },
    handleSearch () {
      console.log('搜索')
      // this.changeSearchfrom({ name: this.seachVal })
    },
    NsGuideDialog () {
      console.log('NsGuideDialog')
    },
    $sizeChange$ (data) {
      console.log(data, '$sizeChange$')
    },
    $pageChange$ (data) {
      console.log(data, '$pageChange$')
    },
    // 关闭弹框
    handleClose () {
      this.activeIndex = -1
      this.drawer = false
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    }
    // getOhterGuide (type, cb) {
    //   const { page, size, total } = this._data._pagination
    //   if (type === 'prev') {
    //     if (this.activeIndex === 0) {
    //       if (page === 1) {
    //         this.$notify.error('暂无上一个')
    //       } else {
    //         this._data._pagination.page = page - 1
    //         this.$queryList$(this.$generateParams$()).then(() => {
    //           const index = this._data._table.data.length - 1
    //           cb(this._data._table.data[index], index)
    //         })
    //       }
    //     } else {
    //       const index = this.activeIndex - 1
    //       cb(this._data._table.data[index], index)
    //     }
    //   } else if (type === 'next') {
    //     if (((page - 1) * size + this.activeIndex + 1) >= total) {
    //       this.$notify.error('暂无下一个')
    //     } else {
    //       if (this.activeIndex === size - 1) {
    //         this._data._pagination.page = page + 1
    //         this.$queryList$(this.$generateParams$()).then(() => {
    //           const index = 0
    //           cb(this._data._table.data[index], index)
    //         })
    //       } else {
    //         const index = this.activeIndex + 1
    //         cb(this._data._table.data[index], index)
    //       }
    //     }
    //   }
    // }
  },
  watch: {
    searchDate (newVal) {
      const date = newVal || [null, null]
      this.searchDateChange({ startTime: date[0], endTime: date[1] })
    }
  },
  mounted () {
    this.setTime()
    // this.$searchAction$()
  }
}
