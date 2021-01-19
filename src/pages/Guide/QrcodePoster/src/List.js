import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      url: this.$api.guide.qrcodePoster.findList,
      // 筛选数据
      model: {
        loginAccount: '',
        orderKey: 'createTime',
        order: 'descending',
        title: ''
      },
      dialogVisible: false,
      dialogData: {}
    }
  },
  mixins: [tableMixin],
  methods: {
    // 预览
    handlePreview (data) {
      this.dialogData = data
      this.dialogVisible = true
    },
    handleDetail (query = {}) {
      this.$router.push({
        path: '/Social/SocialOperation/QrcodePoster/Edit',
        query
      })
    },
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    handleChangeGuide (value) {
      this.changeSearchfrom({ guideIds: value })
    },
    handleSearch () {
      this.changeSearchfrom({ name: this.seachVal })
    },
    // 编辑
    handleEdit (obj) {
      this.handleDetail(obj)
    },
    handleEnd (configId) {
      this.$confirm('确定要删除海报吗', {
        confirmButtonText: '确定',
        type: 'warning',
        cancelButtonText: '取消'
      }).then(() => {
        this.endActivity(configId)
      })
    },
    sortChange (data) {
      const { order, prop } = data
      this.model.orderKey = prop
      this.model.order = order
      this.handleSearch()
    },
    // 结束活动
    endActivity (configId) {
      this.$http.fetch(this.$api.guide.qrcodePoster.deleteByConfigId, { configId })
        .then(() => {
          this.$searchAction$()
        }).catch(() => {
          vm.$notify.error('操作失败')
        })
    },
    // 去报表
    handleAnalysis (guestCodeId) {
      this.$router.push({
        path: '/Social/SocialOperation/QrcodePoster/Analysis',
        query: { guestCodeId }
      })
    }
  },
  watch: {
    seachDate (newVal) {
      const date = newVal || [null, null]
      this.changeSearchfrom({ startTime: date[0], endTime: date[1] })
    }
  },
  mounted () {
    this.$searchAction$()
  }
}
