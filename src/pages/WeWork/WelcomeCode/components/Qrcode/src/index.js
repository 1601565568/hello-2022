
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import PreviewPoster from '@/pages/Guide/components/PreviewPoster'

export default {
  components: { NsDroptree, PreviewPoster },
  mixins: [tableMixin],
  props: {
    qrcodeModel: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      url: this.$api.guide.qrcodePoster.findList,
      _pagination: pagination,
      model: {
        loginAccount: '',
        title: '',
        configId: null
      },
      departData: {},
      configObj: {}, // 记录勾选item
      configId: {}, // 勾选id
      dialogVisible: false,
      dialogData: {}
    }
  },
  methods: {
    init () {
      this.model.configId = this.qrcodeModel.configId + ''
      this.configId = this.qrcodeModel.configId + ''
      this.$queryList$(this.$generateParams$()).then(() => {
        this.configObj = this._data._table.data.find(item => item.id === this.model.configId) || {}
      })
    },
    handleSearch () {
      this._pagination.page = 1
      this.$searchAction$()
    },
    handleChange (id) {
      this.configObj = this._data._table.data.find(item => item.id === this.configId) || {}
    },
    onSave () {
      if (!this.configObj.id) {
        this.$notify.error('请先选择海报')
        return false
      }
      return this.configObj
    },
    handleClose () {
      this.dialogVisible = false
    },
    // 预览
    handlePreview (data) {
      this.dialogData = data
      this.dialogVisible = true
    }
  },
  mounted () {
    this.init()
  }

}
