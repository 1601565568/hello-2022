/*
 * @Date: 2022-04-01 11:15:26
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-15 20:03:25
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
      memberData: {
        word: '',
        topicId: null
      },
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
        id: null,
        name: '',
        time: null
      },
      bottomMinDate: '',
      topMaxDate: ''
      // pickerOptions: {
      //   onPick: ({
      //     maxDate,
      //     minDate
      //   }) => {
      //     // 向上1天
      //     this.bottomMinDate = minDate.getTime() + 1 * 86400000
      //     // 向下1天
      //     this.topMaxDate = minDate.getTime() - 1 * 86400000
      //     if (maxDate) {
      //       this.bottomMinDate = ''
      //       this.topMaxDate = ''
      //     }
      //   },
      //   disabledDate: time => {
      //     if (this.bottomMinDate !== '') {
      //       return time.getTime() > this.bottomMinDate || time.getTime() < this.topMaxDate
      //     }
      //   }
      // }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.keyWordVoListReq.time = this.getDate().nowDateFormat
    },
    fetch (params) {
      this.table.loading = true
      let _params = { ...this.keyWordVoListReq, id: this.topicId, ...params }
      return new Promise((resolve, reject) => {
        this.$http
          .fetch(
            this.$api.weWork.topicAnalysis.keyWordlist,
            _params
          ).then(res => {
            let { data, recordsFiltered } = res.result
            this.table.tableData = data
            this.pagination.total = parseInt(recordsFiltered)
            this.table.loading = false
            resolve(res)
          }).catch(error => {
            this.table.loading = false
            reject(error)
          })
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
      this.$emit('handleRowJump', { ...params, time: this.keyWordVoListReq.time })
    },
    /**
     * 获取当天日期
     */
    getDate () {
      const nowDate = new Date()
      let nowDateFormat = moment(nowDate).format('YYYY-MM-DD')
      return { nowDate, nowDateFormat }
    },
    headerStyle () {
      return { background: '#f5f5f5', lineHeight: '40px', fontSize: '14px', color: '#262626', height: '40px', padding: '0px' }
    }
  }
}
