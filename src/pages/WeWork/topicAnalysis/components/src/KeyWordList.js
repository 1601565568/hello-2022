/*
 * @Date: 2022-04-01 11:15:26
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-02 19:05:41
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\topicAnalysis\components\src\KeyWordList.js
 */
import moment from 'moment'
import MemberList from '../MemberList.vue'

export default {
  name: 'KeyWordList',
  props: {
    topicId: {
      type: Number
    }
  },
  components: { MemberList },
  data () {
    return {
      isDetails: false,
      filterStr: '',
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
      keyWordVoListReq: {
        start: 0,
        length: 15,
        topicId: null,
        keyWord: '',
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
    this.initFetch()
  },
  methods: {
    initFetch () {

    },
    fetch (params) {
      this.table.loading = true
      let _params = { ...this.keyWordVoListReq, time: this.getDate(), topicId: this.topicId, ...params }
      this.$http
        .fetch(
          this.$api.weWork.topicAnalysis.getKeyWordTopicList,
          _params
        ).then(res => {
          let response = res.result
          this.table.tableData = response.length > 0 ? response[0].keyWordsVoList : []
          this.table.loading = false
        }).catch(error => {
          this.table.loading = false
          this.$notify.error(error.msg)
        })
    },
    handleKeyWordSearch () {
      this.fetch()
    },
    handleKeyWordReset () {
      this.keyWordVoListReq = Object.assign({}, this.$options.data().keyWordVoListReq)
      this.pagination = Object.assign({}, this.$options.data().pagination)
      this.fetch()
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      if (this.topicId) {
        this.pagination.page = 1
        this.keyWordVoListReq.length = size
        this.keyWordVoListReq.start = 0
        this.fetch()
      }
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      if (this.topicId) {
        this.keyWordVoListReq.start = (page - 1) * this.keyWordVoListReq.length
        this.fetch()
      }
    },
    handleAddKeyWord () {
      this.$emit('addKeyWordDialog')
    },
    handleRowJump (params) {
      this.isDetails = !this.isDetails
      if (params) {
        this.filterStr = params
      }
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
