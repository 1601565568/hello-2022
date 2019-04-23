import tableMixin from 'mixins/table' // 引入tableMixin
import NsDatetime from 'components/NsDatetime'
// import ErrorCode from '@/config/errorCode' // 引入错误代码
export default {
  name: 'NsTableEmailSendLogs',
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
        'func': function (scope) {
          this.$emit('email-detail', scope.row)
        },
        'icon': '$.noop',
        'name': '\u8BE6\u60C5',
        'auth': ``,
        'visible': `  `
      }
    ]
    // 表格外的操作button
    var operateButtons = []
    // 查询操作
    var quickInput = [{
      'template': '',
      'inline': true,
      'name': 'target',
      'text': '收件邮箱',
      'placeholder': '请输入邮箱',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {
      'time': [],
      'target': '',
      'send_addr': '',
      'send_time': '',
      'send_name': '',
      'source_model': '',
      'send_status': '',
      'start': '',
      'end': ''
    }, {})
    var that = this
    // 直接复制就行
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
      quickSearchModel: quickSearchModel,
      state: {},
      rules: Object.assign({}, {}, {
        email_addr: [{
          min: 0,
          max: 100,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        }],
        send_name: [{
          min: 0,
          max: 100,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        }],
        send_addr: [{
          min: 0,
          max: 100,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        }]
      }),
      url: this.$api.touch.emailSend.emailSendLogs,
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
  components: {
    NsDatetime
  },
  computed: {},
  methods: {
    'emailDetail': function (obj) {
      this.$emit('email-detail', obj)
    },
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
