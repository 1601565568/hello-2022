import tableMixin from 'mixins/table' // 引入tableMixin

export default {
  name: 'NsTableDownload',
  mixins: [tableMixin],
  data: function () {
    // 分页 （可以直接复制）
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    // 表格内操作的button
    var tableButtons = [
      {
        'func': function (args) {
          // 操作
          this.$emit('download', '下载短信验证', args.row)
        },
        'icon': '$.noop',
        'name': '\u4e0b\u8f7d', // 以Unicode显示
        'auth': ``,
        'visible': `  `
      }
    ]
    // 表格外的操作button
    var operateButtons = []
    // 查询操作
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'user_name',
      'text': '创建人',
      'placeholder': '请输入创建人',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {'fileName': '', 'user_name': '', 'export_status': ''}, {})
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
    // 赋值
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      url: this.$api.core.exportTask.queryTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {expand: false}
    }
  },
  mounted: function () {
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    // 额外操作方法
  },
  created: function () {
  }
}
