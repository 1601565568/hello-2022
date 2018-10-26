import tableMixin from 'mixins/table'
import NsDatetime from 'components/NsDatetime'

export default {
  name: 'NsTableInteract',
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
    var tableButtons = []

    var operateButtons = []

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'customerName',
      'text': '积分信息',
      'placeholder': '请输入姓名',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        mobile: '',
        integralType: '',
        integralSource: '',
        time: '',
        customerName: '',
        memberCard: '',
        operation: ''
      },
      {
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
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.database.interact.queryTable,
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
  },
  components: {
    NsDatetime
  },
  methods: {
    '$handleParams': function (params) {
      if (params.searchMap && params.searchMap.time && params.searchMap.time.length > 0) {
        params.searchMap.startTime = params.searchMap.time[0]
        params.searchMap.endTime = params.searchMap.time[1]
      }
      delete params.searchMap.time
      return params
    },
    hidMobile: function (val) {
      var mobile = '-'
      if (val) {
        mobile = val.substr(0, 3) + '****' + val.substr(7, val.length - 1)
      }
      return mobile
    },
    change (obj) {
      this.typeOptions = this.Options[obj].type
      this.model.integralType = ''
    },
    resetInputAction () {
      this.typeOptions = []
      this.$resetInputAction$()
    }
  },
  created: function () {
    var that = this
    that.$http.fetch(that.$api.database.interact.getIntegralSourceAndType)
      .then((resp) => {
        if (resp.success) {
          that.Options = resp.result
          for (let obj in resp.result) {
            that.sourceOptions.push({ value: obj, label: resp.result[obj].label })
          }
        }
      })
  }
}
