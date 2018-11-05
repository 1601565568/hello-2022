import tableMixin from 'mixins/table'

export default {
  name: 'NsTableHash',
  mixins: [tableMixin],
  props: {
    url: Object
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
          this.$emit('edit', args.row)
        },
        'icon': '$.noop',
        'name': '修改',
        'auth': ``,
        'visible': `  `
      }
      // ,
      // {
      //   'func': function (args) {
      //     this.$emit("delete", args.row)
      //   },
      //   'icon': '$.noop',
      //   'name': '\u5220\u9664',
      //   'auth': ``,
      //   'visible': `  `
      // }
    ]

    var operateButtons = [
      // {
      //   'func': function () {
      //     this.$emit("add")
      //   },
      //   'icon': '$.noop',
      //   'name': '\u65B0\u589E',
      //   'auth': ``,
      //   'visible': `  `
      // }
    ]

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'hash_name$LK',
      'text': '哈希名称',
      'placeholder': '请输入哈希名称',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = {
      'hash_key$EQ': '',
      'remark$LK': '',
      'hash_name$LK': '',
      'hash_type$EQ': ''
    }

    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
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
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  }
}
