import tableMixin from 'web-crm/src/mixins/table'
import NsArea from 'web-crm/src/components/NsArea'
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
          this.$emit('synchronization')
        },
        'name': '同步'
      },
      {
        'func': function () {
          this.$emit('addPersonalNumber')
        },
        'name': '新增个人号'
      },
      {
        'func': function () {
          this.$emit('batchBindShoppingGuide')
        },
        'name': '批量绑定导购'
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
      sgGuide: {
        image: null
      }
    }
    let findVo = {
      'keyword': null, // 门店名称
      'wechatId': null, // 微信号
      'wechatName': null, // 微信昵称
      'guideInfo': null, // 关联导购的ID或者工号
      'shopId': null, // 绑定门店
      'status': null // 状态
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
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
    var vm = this
    vm.initShopList()
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
    synchronization () {
      this.$emit('synchronization')
    },
    addPersonalNumber () { // 查看门店详情和查看所属区域详情
      this.$emit('addPersonalNumber')
    },
    batchBindShoppingGuide () {
      this.$emit('batchBindShoppingGuide')
    },
    clickOnTheUpload (row) {
      this.$emit('clickOnTheUpload', row)
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
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
