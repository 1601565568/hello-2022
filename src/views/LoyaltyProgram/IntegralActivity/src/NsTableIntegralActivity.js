import tableMixin from 'mixins/table'
import NsDatetime from 'components/NsDatetime'
import apiRequestConfirm from 'utils/apiRequestConfirm'

export default {
  name: 'NsTableIntegralActivity',
  mixins: [tableMixin],
  props: {
    types: Object,
    department: Array,
    role: Array
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
        'func': function (obj) {
          this.$emit('update-activity', obj.row)
        },
        'icon': '$.noop',
        'name': '\u4fee\u6539',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          let that = this
          if (obj.row.integral_activities_stauts === 0) {
            apiRequestConfirm('删除积分活动').then(function () {
              that.$http.fetch(that.$api.integral.integralActivity.deleteById
                , {id: obj.row.id})
                .then((resp) => {
                  that.$notify.success(resp.msg)
                  that.$reload()
                }).catch((resp) => {
                  that.$notify.error(resp.msg)
                })
            }).catch(() => {})
          } else {
            this.$notify.warning('启用状态无法删除')
          }
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': ``
      }
    ]

    var operateButtons = [
      {
        'func': function () {
          this.$emit('add-activity')
        },
        'icon': '$.noop',
        'name': '新增积分活动',
        'auth': ``,
        'visible': ``
      }
    ]
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'activityName',
      'text': '活动信息',
      'placeholder': '请输入活动名称',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        activityName: '',
        isAllCrowd: '',
        time: ''
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
      url: this.$api.integral.integralActivity.queryTable,
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
    changeStatus: function (obj) {
      var that = this
      this.$http.fetch(this.$api.integral.integralActivity.updateACtivityState, {id: obj.id, state: obj.integral_activities_stauts})
        .then((resp) => {
          that.$notify.success(resp.msg)
          that.$reload()
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        })
    },
    showRule: function (obj) {
      var json = JSON.parse(obj.integral_activities_condition)
      switch (obj.integral_activities_type) {
        case 0: {
          return '单笔交易满 ' + json.orderPrice + '元' + ' \r\n ' + '单笔交易满' + json.orderAmount + '件'
        }
      }
    },
    onSearch () {
      console.log('搜索响应')
    }
  }
}
