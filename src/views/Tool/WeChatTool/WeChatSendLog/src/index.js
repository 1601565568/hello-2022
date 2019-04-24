import tableMixin from 'web-crm/src/mixins/table' // 引入tableMixin
import NsDatetime from 'web-crm/src/components/NsDatetime'
export default {
  name: 'index',
  mixins: [tableMixin],
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    // 表格内操作的button
    var tableButtons = []
    var operateButtons = []
    // 查询操作
    var quickInput = [{
      'inline': true,
      'name': 'customerName',
      'text': '接收人',
      'placeholder': '请输入接收人',
      'type': 'text',
      'isConvenient': false }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {}, {
      customerName: '',
      userName: '',
      target: '',
      wxAccount: '',
      sendStatus: '',
      sourceModel: '',
      start: '',
      end: '',
      time: []
    })
    var that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
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
      ban_disabled: false,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      url: this.$api.touch.wxSendLogs.queryWxSendLogs,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false }
    }
  },
  mounted: function () {
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  components: {
    NsDatetime
  },
  methods: {
    '$handleParams': function (params) {
      if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
        params.searchMap.start = params.searchMap.time[0]
        params.searchMap.end = params.searchMap.time[1]
      }
      delete params.searchMap.time
      return params
    }
  },
  created: function () {
  }
}
