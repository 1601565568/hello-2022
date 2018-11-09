import tableMixin from 'mixins/table'
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
          this.$emit('add')
        },
        'name': '新增'
      },
      {
        'func': function () {
          this.$emit('allDelete')
        },
        'name': '删除'
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
          this.$emit('delete', args.row)
        },
        'icon': '',
        'name': '删除',
        'auth': '',
        'visible': ''
      },
      {
        'func': function (args) {
          this.$emit('quit', args.row)
        },
        'icon': '',
        'name': '离职',
        'auth': '',
        'visible': ''
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
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_id: null,
        password: null,
        image: null
      },
      sgGuideShop: {
        id: null,
        shop_id: null,
        job: 0
      }
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
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
      _queryConfig: {expand: false},
      multipleSelection: [],
      select: true
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
  computed: {},
  methods: {
    search () {
      var _this = this
      if (_this.model.name === null) {
        _this.$confirm('请输入工号/姓名/昵称/手机号!')
      } else if (_this.model.shop === null) {
        _this.$confirm('请选择所属门店!')
      } else if (_this.model.job === null) {
        _this.$confirm('请选择职务!')
      } else {
        _this.$searchAction$()
      }
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.core.sysShop.getBrandList, {
        'length': 100000,
        'start': 0,
        searchMap: {
          'shopStatus': 1
        }
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    shopDel (index) {
      this.guideShopList.splice(index, 1)
    },
    disabled (shopId) {
      let retVal = this.guideShopList.some(item => {
        return item.shopId === shopId
      })
      return retVal
    },
    thisGuideDisabled (guideId) {
      let retVal = this.guideShopList.some(item => {
        return item.id === guideId
      })
      return retVal
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      return this.multipleSelection
    },
    // 解析后台传进来的字符串
    strToJson (str) {
      if (str && str.length > 0) {
        return JSON.parse(str)
      } else {
        return null
      }
    },
    getListFirst (list) {
      if (list && list.length > 0) {
        return list[0]
      } else {
        return {
          district: '',
          name: '',
          job: ''
        }
      }
    }
  }
}
