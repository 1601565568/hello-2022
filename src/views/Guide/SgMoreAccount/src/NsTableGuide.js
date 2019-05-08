import tableMixin from 'web-crm/src/mixins/table'
import NsArea from 'web-crm/src/components/NsArea'
export default {
  name: 'NsTableGuide',
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
      'shopName': null, // 门店名称
      'city': null, // 门点所在区域市
      'district': null, // 门点所在区域区
      'province': null, // 门点所在区域省
      'shopType': null, // 门店类型
      'phone': null, // 联系电话
      'area_region': null, // 所属地区
      'shopStatus': null, // 营业状态
      'area': [] // 所属区域
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
      multipleSelection: [],
      select: true,
      shopLeiXing: [{
        value: 'B',
        label: '天猫'
      }],
      operatingStatus: [{
        value: -2,
        label: '已关店'
      }],
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
    onAreaChange () { // 城市切换进行赋值
      let that = this
      that.model.district = that.model.area[2]
      that.model.city = that.model.area[1]
      that.model.province = that.model.area[0]
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
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
