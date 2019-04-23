import tableMixin from 'mixins/table'
import NsDatetime from 'components/NsDatetime'

export default {
  name: 'NsTableBrand',
  mixins: [tableMixin],
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'alias_file_name',
      'text': '文件名称',
      'placeholder': '请输入文件名称',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, { alias_file_name: '', login_account: '' }, { exportTime: [] })
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
      url: this.$api.core.exportDownloadLog.queryTable,
      _pagination: pagination,
      _table: {
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: {
        expand: false
      }
    }
  },
  methods: {
    '$handleParams': function (params) {
      if (params.searchMap && params.searchMap.exportTime && params.searchMap.exportTime.length > 0) {
        params.searchMap.start_time = params.searchMap.exportTime[0]
        params.searchMap.end_time = params.searchMap.exportTime[1]
      }
      delete params.searchMap.exportTime
      return params
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
  }
}
