/*
 * @Date: 2022-04-02 18:38:29
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-06 15:28:39
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\topicAnalysis\components\src\MemberList.js
 */
import moment from 'moment'

export default {
  name: 'MemberList',
  props: {
    memberData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      table: {
        loading: false,
        tableData: []
      },
      // 分页配置
      pagination: {
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      memberListParams: {
        start: 0,
        length: 15,
        topicId: null,
        wxName: '',
        name: '',
        timeRange: null
      },
      bottomMinDate: '',
      topMaxDate: '',
      pickerOptions: {
        onPick: ({
          maxDate,
          minDate
        }) => {
          // 向上1天
          this.bottomMinDate = minDate.getTime() + 1 * 86400000
          // 向下1天
          this.topMaxDate = minDate.getTime() - 1 * 86400000
          if (maxDate) {
            this.bottomMinDate = ''
            this.topMaxDate = ''
          }
        },
        disabledDate: time => {
          if (this.bottomMinDate !== '') {
            return time.getTime() > this.bottomMinDate || time.getTime() < this.topMaxDate
          }
        }
      }
    }
  },
  mounted () {
    // this.initFetch()
  },
  methods: {
    initFetch () {
      this.fetchList()
    },
    fetchList (params) {
      this.table.loading = true
      let _params = { ...this.memberListParams, time: this.getDate(), keyWordId: this.memberData.keyWordId, ...params }
      this.$http
        .fetch(
          this.$api.weWork.topicAnalysis.getKeyWordTopicList,
          _params
        ).then(res => {
          this.table.tableData = res.result
          this.table.loading = false
        }).catch(error => {
          this.table.loading = false
          this.$notify.error(error.msg)
        })
    },
    handleSearch () {
      this.fetchList()
    },
    handleParamsReset () {
      this.memberListParams = Object.assign({}, this.$options.data().memberListParams)
      this.pagination = Object.assign({}, this.$options.data().pagination)
      this.fetchList()
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      if (!this.memberData.keyWordId) return
      this.pagination.page = 1
      this.memberListParams.length = size
      this.memberListParams.start = 0
      this.fetchList()
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      if (!this.memberData.keyWordId) return
      this.memberListParams.start = (page - 1) * this.memberListParams.length
      this.fetchList()
    },
    handleRowJump () {
      this.$emit('handleRowJump')
    },
    fliterText (text) {
      let str = text.split(this.memberData.word).join('<span style="color: red">' + this.memberData.word + '</span>')
      return str
    },
    /**
     * 获取当天日期
     */
    getDate () {
      const nowDate = new Date()
      return moment(nowDate).format('YYYY-MM-DD')
    }
  }
}
