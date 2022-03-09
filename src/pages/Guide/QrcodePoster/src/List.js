import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import api from '@/config/http'
export default {
  data () {
    return {
      downUrl: api.API_ROOT + '/chatRoomGroup/downLoad',
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
      dialogData: {},
      downloadSrc: '', // 要下载的图片
      path: '', // 路由判断区分个号和企微
      fuscous: process.env.VUE_APP_THEME,
      fuscousQA: 'fuscousQA',
      fuscousIcon: 'fuscousIcon'
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
        path: `${this.path}/Edit`,
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
          this.$notify.success('删除成功')
          this.$searchAction$()
        }).catch(() => {
          this.$notify.error('操作失败')
        })
    },
    // 下载
    handleDownload (url) {
      let requestUrl = this.downUrl
      var form = document.createElement('form')
      form.setAttribute('action', requestUrl)
      form.setAttribute('method', 'get')
      var input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', 'url')
      input.setAttribute('value', url)
      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
    },
    // 复制
    handleCopy (msg) {
      copy(msg)
    },
    handleClose () {
      this.dialogVisible = false
    },
    downloadImg () {
      window.frames['IframeReportImg'].document.execCommand('SaveAs')
    }
  },
  mounted () {
    // 根据旅游判断个号还是导购
    const path = this.$route.path
    const arr = path.split('/')
    arr.splice(arr.length - 1, 1)
    this.path = arr.join('/')
    this.$searchAction$()
  }
}
