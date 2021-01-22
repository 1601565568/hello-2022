
import NsDroptree from '@nascent/ecrp-ecrm/src/components/NsDroptree'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  components: { NsDroptree },
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
      configId: '' // 记录勾选的状态
    }
  },
  methods: {
    init () {
      this.model.configId = this.qrcodeModel.configId
      this.$reload()
    },
    handleSearch () {
      this._pagination.page = 1
      this.$searchAction$()
    },
    onSave () {
      if (!this.shopId) {
        this.$notify.error('请先选择门店')
        return false
      }
      this.$emit('onSave')
    }
  },
  mounted () {
    this.init()
  }

}
