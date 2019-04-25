import tableMixin from 'web-crm/src/mixins/table'

export default {
  name: 'NsTableSgCustomer',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var paginations = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var tableButtons = [
      {
        'func': function (obj) {},
        'icon': '$.noop',
        'name': '\u8be6\u60c5',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          this.$parent.trackVisible = true
          this.$parent.model.customerName = obj.row.black_type
        },
        'icon': '$.noop',
        'name': '\u8ddf\u8e2a',
        'auth': ``,
        'visible': ``
      }
    ]

    var operateButtons = [
    ]

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'customerName',
      'text': '姓名',
      'placeholder': '请输入姓名',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        // 高级搜索字段
        transName: '',
        receiveName: '',
        transType: '',
        operationType: ''
      },
      { validTime: [] })
    var that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法1
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      customerData: null,
      showCustomerDialogVisible: false,
      model: model,
      title: null,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      tableData: null,
      url: this.$api.guide.guide.findTransRecordList,
      _pagination: pagination,
      paginations: paginations,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {},
        data: null
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      _queryConfig: {
        expand: false
      }
    }
  },

  mounted: function () {
    var _this = this
    _this.initTableData()
  },
  components: {},
  methods: {
    showListDialog (id) {
      var _this = this
      _this.title = '转移会员'
      _this.showCustomerDialogVisible = true
      _this.findCustomerDetail(id)
      // this.$emit('showListDialogMain', id)
    },
    onSearch () {
    },
    initTableData () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.findTransRecordList, {
        length: _this._data._pagination.size
      }).then(resp => {
        if (resp.success === true && resp.result.data != null) {
          _this._data._table.data = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    findCustomerDetail (transRecordId) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.findCustomerTransRecordList, {
        searchMap: {
          transRecordId: transRecordId
        }
      }).then(resp => {
        if (resp.success === true && resp.result.data != null) {
          _this.customerData = resp.result.data
          _this._data.paginations.total = parseInt(resp.result.total)
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 关闭自定义转移弹窗
    onCancleDialog () {
      var _this = this
      _this.paginationss = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.customerData = null
      _this.showCustomerDialogVisible = false
    }
  }
}
