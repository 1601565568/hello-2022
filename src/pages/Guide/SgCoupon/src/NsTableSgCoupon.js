import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'NsTableSgCoupon',
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
          this.$parent.model.customerName = obj.row.black_type
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
          this.$emit('add')
        },
        'name': '新增'
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
        // 高级搜索字段
        customerName: '',
        couponTitle: '',
        couponType: null,
        couponStatus: null,
        dateType: '1'
      },
      { validTime: [] })
    var that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法1
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      onAddCouponVisible: true,
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      tableData: null,
      grades: [],
      url: this.$api.guide.activityCoupon.findList,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {},
        data: null
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      _queryConfig: {
        expand: false
      },
      dateTypeOptions: [
        {
          value: '1',
          label: '领取有效时间'
        },
        {
          value: '2',
          label: '使用有效时间'
        }
      ]
    }
  },

  mounted: function () {
    var _this = this
    _this.initTableData()
  },
  components: {},
  methods: {
    editCoupon (item) {
      this.$emit('add', item)
    },
    showListDialog (id) {
      this.$emit('showListDialogMain', id)
    },
    initTableData () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.activityCoupon.findList, {
        length: _this._data._pagination.size
      }).then(resp => {
        if (resp.success && resp.result.data != null) {
          _this._data._table.data = resp.result.data
          _this._data._pagination.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    }
  }
}
