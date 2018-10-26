import tableMixin from 'mixins/table'
import apiRequestConfirm from 'utils/apiRequestConfirm'
export default {
  name: 'NsYsChannel',
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
        'func': function (args) {
          this.$emit('open-dialog', 'edit', '修改通道标识', args.row)
        },
        'icon': '$.noop',
        'name': '\u4FEE\u6539',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          var that = this
          apiRequestConfirm('删除该通道').then(() => {
            that.$http.fetch(this.$api.touch.ysChannel.deleteById, {id: args.row.id})
              .then(resp => {
                that.$notify.success(resp.msg)
                that.$reload()
              })
          }).catch(() => {
          })
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      }
    ]
    var operateButtons = [
      {
        'func': function () {
          this.$emit('open-dialog', 'add', '新增通道标识')
        },
        'icon': '$.noop',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': `  `
      }
    ]
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'sp_name',
      'text': '通道名称',
      'placeholder': '请输入通道名称',
      'type': 'text',
      'value': ''
      // 'isConvenient': false
    }]

    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {sp_name: '', channel_code: '', channel_type: ''}, {})
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
      accountOptions: [],
      brandOptions: [],
      url: this.$api.touch.ysChannel.queryTable,
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
    // this.$reload()
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else { this.$reload() }
  },
  methods: {
    onDefaultChange: function (call, currVal, row) {
      this.$emit('default-change', call, currVal, row)
    }
  }
}
