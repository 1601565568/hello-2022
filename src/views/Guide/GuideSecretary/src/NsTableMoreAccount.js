import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsArea from '@nascent/ecrp-ecrm/src/components/NsArea'
export default {
  name: 'NsTableMoreAccount',
  mixins: [tableMixin],
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        'func': function () {
          this.$emit('newSecretaryNumber')
        },
        'name': '新增秘书号'
      },
      {
        'func': function () {
          this.$emit('checkOutUnsecretarialSalesLeads')
        },
        'name': '查看未加秘书的导购'
      },
      {
        'func': function () {
          this.$emit('downloadTheAggregatedqrCode')
        },
        'name': '下载聚合二维码'
      }
    ]
    const operateButtons = [
      {
        'func': function (args) {
          this.$emit('onAddCustomer', args.row)
        },
        'icon': '',
        'name': '编辑',
        'auth': '',
        'visible': ''
      },
      {
        'func': function (args) {
          this.$emit('ondelete', args.row)
        },
        'icon': '',
        'name': '删除',
        'auth': '',
        'visible': '',
        'color': '#f00'
      }
    ]
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let searchModel = {
    }
    let findVo = {
      'keyword': null, // 门店名称
      'wechatId': null, // 微信号
      'wechatName': null, // 微信昵称
      'guideInfo': null, // 关联导购的ID或者工号
      'shopId': null, // 绑定门店
      'status': null, // 状态
      'type': 0
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
      obj: {
        length: 15,
        searchMap: {
          guideInfo: '',
          keyword: '',
          wechatId: '',
          wechatName: '',
          type: 0
        },
        start: 0
      },
      operatingStatus: [{ label: '全部', value: 0 }, { label: '已登陆', value: 1 }, { label: '未登录', value: 2 }],
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      select: true,
      shopList: [],
      searchform: {
        // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        }
      }
    }
  },
  mounted: function () {
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
  },
  components: {
    NsArea
  },
  computed: {},
  methods: {
    renderHeader (h, data) {
      return h('div', { attrs: { class: 'cell', style: 'margin-top:7px' } }, [h('span', ['微信昵称']), h('el-tooltip', { attrs: { class: 'el-icon-question bg-white', effect: 'light', content: '建议微信昵称统一为：品牌名 + 秘书，如：南讯秘书', placement: 'bottom' } }, [h('i', { 'class': 'el-icon-question', style: 'color:rgb(153, 153, 153)' })])])
    },
    ElSliderChange (val, row) { // 透支权重值发生变化的方法
      this.$emit('ElSliderChange', val, row)
    },
    wxCodeUrl (row) {
      this.$emit('wxCodeUrl', row)
    },
    BlurIput (val, row) { // 每日透支次数值发生变化的方法
      this.$emit('BlurIput', val, row)
    },
    formatTooltip (val) {
      return val
    },
    synchronization () {
      this.$emit('synchronization')
    },
    addPersonalNumber () { // 查看门店详情和查看所属区域详情
      this.$emit('addPersonalNumber')
    },
    batchBindShoppingGuide () {
      this.$emit('batchBindShoppingGuide')
    },
    uploadFile (row) {
      this.$emit('uploadFile', row)
    },
    // 处理上传图片
    handleAvatarSuccess: function (response, file) {
      var _this = this
      _this.$reload()
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    onRedactFun (val) {
      this.$emit('onRedactFun', val)
    },
    onDelsTipFun (val) {
      this.$emit('onDelsTipFun', val)
    },
    dimissionFun (val) {
      this.$emit('dimissionFun', val)
    }
  }
}
