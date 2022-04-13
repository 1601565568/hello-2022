/*
 * @Date: 2022-04-02 18:38:29
 * @LastEditors: Cosima
 * @LastEditTime: 2022-04-13 18:11:03
 * @FilePath: \ECRP-SG-WEB\src\pages\WeWork\topicAnalysis\components\src\MemberList.js
 */
import moment from 'moment'
import { formatText } from '@/utils/formatText'

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
        tableData: [
          {
            'avatar': '',
            'contactName': 'aaa',
            'content': 'aaa1aaa1112222aaa1aaa1112222aaa1112222aaa111aaa1112222aaa11122222222112222aaa1112222112222',
            'guideName': 'bbb',
            'msgtime': 'xxxx',
            'roomid': '123',
            'sender': '4',
            'seq': '5',
            'tolist': '6'
          }
        ]
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
        id: null,
        idType: '',
        guideName: '',
        contactName: '',
        time: null
      }
    }
  },
  computed: {
    platformText () {
      return formatText({ kd: '企业微信成员', ecrp: '员工' })
    }
  },
  mounted () { },
  methods: {
    fetchList (params) {
      this.table.loading = true
      this.memberListParams = { ...this.memberListParams, ...params }
      this.$http
        .fetch(
          this.$api.weWork.topicAnalysis.contentList,
          this.memberListParams
        ).then(res => {
          // this.table.tableData = res.result
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
    },
    /**
     * 每页条数发生变化
     */
    handleSizeChange (size) {
      if (!this.memberData.id) return
      this.pagination.page = 1
      this.memberListParams.length = size
      this.memberListParams.start = 0
      this.fetchList()
    },
    /**
     * 页码发生变化
     */
    handlePageChange (page) {
      if (!this.memberData.id) return
      this.memberListParams.start = (page - 1) * this.memberListParams.length
      this.fetchList()
    },
    // 筛选高亮显示文本
    fliterText (text) {
      let str = text.split(this.memberData.word).join('<span style="color: #5BC228">' + this.memberData.word + '</span>')
      return str
    },
    /**
     * 获取当天日期
     */
    getDate () {
      const nowDate = new Date()
      return moment(nowDate).format('YYYY-MM-DD')
    },
    headerStyle () {
      return { background: '#f5f5f5', lineHeight: '40px', fontSize: '14px', color: '#262626', height: '40px', padding: '0px' }
    },
    getContext (data) {
      this.$emit('getContext', data)
    }
  }
}
