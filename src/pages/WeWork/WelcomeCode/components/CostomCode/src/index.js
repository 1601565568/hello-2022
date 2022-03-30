
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
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
      url: this.$api.guide.customerCode.findPopupList,
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
      dialogData: {},
      // 状态列表
      statusList: {
        0: {
          value: '已结束',
          color: 'info'
        },
        1: {
          value: '未开始',
          color: 'warning'
        },
        2: {
          value: '进行中',
          color: 'success'
        },
        3: {
          value: '提前结束',
          color: 'info'
        }
      },
      scopeName: process.env.VUE_APP_THEME,
      nameText: 'scope-name_text',
      nameTextQA: 'scope-name_textQA'
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
      this.$searchAction$()
    },
    handleChange () {
      this.configObj = this._data._table.data.find(item => item.guestCodeId === this.configId) || {}
      console.log(this.configObj)
    },
    onSave () {
      if (!this.configObj.guestCodeId) {
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
