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
      drawer: false,
      // 侧边栏信息
      itemDate: {},
      activeIndex: -1,
      getList: [],
      momentId: '',
      drawerDate: {
        likeList: [],
        commentList: []
      },
      loading: false, // 防重复提交
      selectDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime()
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.selectDate !== '') {
            const one = 7 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      }
    }
  },
  // mixins: [tableMixin],
  methods: {
    exportFile () {
      if (!this.getList.length) {
        this.$notify.error('当前没有匹配的数据项')
        return
      }
      const start = 0
      const length = 999999999
      const params = {
        ...this.model,
        start,
        length
      }
      this.$notify.info('导出中，请稍后片刻')
      this.$http.fetch(this.$api.weWork.sop.exportMomentStatistics, params)
        .then((resp) => {
          let url = window.URL.createObjectURL(new Blob([resp.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url

          const fileName = decodeURIComponent(resp.headers['content-disposition'].split('=')[1])
          link.setAttribute('download', fileName)

          document.body.appendChild(link)
          link.click()
          this.$notify.success('下载完成')
        }).catch((resp) => {
          this.$notify.error('导出报错，请联系管理员')
        })
    },
    setTime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      const startTime = moment(start).format('YYYY-MM-DD HH:mm:ss')
      const endTime = moment(end).format('YYYY-MM-DD HH:mm:ss')
      this.searchDate = [startTime, endTime]
    },
    searchDateChange (obj = {}) {
      this.model = Object.assign(this.model, obj)
    },
    handleSearch () {
      this.showUserInfo()
    },
    NsGuideDialog () {
      this.showUserInfo()
    },
    $sizeChange$ (data) {
      this.pagination.size = data
      this.showUserInfo()
    },
    $pageChange$ (data) {
      this.pagination.page = data
      this.showUserInfo()
    },
    // 员工选择
    fnEdit () {
      this.showUserInfo()
    },
    // 时间选择
    selectTime () {
      this.showUserInfo()
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
    },
    showUserInfo () {
      this.loading = true
      const start = (this.pagination.page - 1) * this.pagination.size
      const length = this.pagination.size
      const params = {
        ...this.model,
        start,
        length
      }
      this.$http.fetch(this.$api.guide.momentList.getList, params).then(res => {
        this.getList = this.formarGetList(res.result.data)
        this.pagination.total = Number(res.result.recordsTotal)
        this.loading = false
      }).catch((err) => {
        this.loading = false
        this.$notify.error(err.msg)
      })
    },
    formarGetList (arr) {
      return arr.map((item) => {
        return {
          ...item,
          imageMediaId: item.imageMediaId ? item.imageMediaId.split(',') : []
        }
      })
    },
    // 查看点开弹窗
    async handleEdit (row, index) {
      this.momentId = row.momentId
      this.activeIndex = index
      await this.getInteractive()
      // this.drawerDate = row
      this.drawer = true
    },
    getInteractive () {
      this.$http
        .fetch(this.$api.guide.momentList.getInteractive, {
          momentId: this.momentId
        })
        .then(res => {
          this.drawerDate = {
            ...this.getList[this.activeIndex],
            commentList: res.result.commentList ? res.result.commentList : [],
            likeList: res.result.likeList ? res.result.likeList : []
          }
        })
    },
    onPrevUp () {
      if (this.activeIndex === 0) {
        this.$notify.error('已经是第一个')
      } else {
        this.activeIndex = this.activeIndex - 1
        this.momentId = this.getList[this.activeIndex].momentId
        this.getInteractive()
      }
    },
    onPrevDown () {
      if (this.activeIndex === this.getList.length - 1) {
        this.$notify.error('已经是最后一个')
      } else {
        this.activeIndex = this.activeIndex + 1
        this.momentId = this.getList[this.activeIndex].momentId
        this.getInteractive()
      }
    }
  },
  watch: {
    searchDate (newVal) {
      const date = newVal || [null, null]
      this.searchDateChange({ startTime: date[0], endTime: date[1] })
    }
  },
  created () {
    this.setTime()
  },
  mounted () {
    // this.$searchAction$()
    this.$nextTick(() => {
      this.showUserInfo()
    })
  }
}
