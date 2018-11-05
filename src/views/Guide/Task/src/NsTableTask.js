import tableMixin from 'mixins/table'
import moment from 'moment'

export default {
  name: 'NsTableTask',
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
      }
    ]
    const operateButtons = [
      {
        'func': function (args) {
          this.$emit('stop', args.row)
        },
        'icon': '',
        'name': '终止',
        'auth': '',
        'visible': 'scope.row.state === 1'
      },
      {
        'func': function (args) {
          this.$emit('edit', args.row)
        },
        'icon': '',
        'name': '修改',
        'auth': '',
        'visible': 'scope.row.state === 1'
      },
      {
        'func': function (args) {
          this.$emit('delete', args.row)
        },
        'icon': '',
        'name': '删除',
        'auth': ''
      }
    ]

    var quickInput = [{
      'name': 'name'
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        name: '',
        outer_id: '',
        min_price: '',
        max_price: '',
        target: ''
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
    moment (time) {
      return moment(time).format('YYYY-MM-DD')
    }
  }
}
