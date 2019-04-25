import tableMixin from 'web-crm/src/mixins/table'

export default {
  name: 'ColumnTable',
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
          // this.$parent.model.customerName = obj.row.black_type
        },
        'icon': '$.noop',
        'name': '\u8ddf\u8e2a',
        'auth': ``,
        'visible': ``
      }
    ]

    var operateButtons = [
      {
        'func': function () {
        },
        'icon': '',
        'name': '新增',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
        },
        'icon': '',
        'name': '编辑',
        'auth': ``,
        'visible': ''
      },
      {
        'func': function () {
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': ``
      }
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
        customerName: '',
        outNick: '',
        mobile: '',
        address: '',
        userType: '',
        isExit: '',
        source: '',
        memberGrade: ''
      },
      {})
    var that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      grades: [],
      // url: this.$api.database.black.queryTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {
        expand: false
      }
    }
  },

  mounted: function () {
  },
  components: {},
  methods: {
    onSearch () {
      console.log('搜索响应')
    }
  }
}
