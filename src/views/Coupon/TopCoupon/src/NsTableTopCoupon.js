import tableMixin from 'mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
import moment from 'moment'

export default {
  name: 'NsTableTopCoupon',
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
      // {
      //  'func': function (obj) {
      //    this.$emit('update-coupon', obj.row)
      //  },
      //  'icon': '$.noop',
      //  'name': '\u4fee\u6539',
      //  'auth': ``,
      //  'visible': ``
      // },
      {
        'func': function (obj) {
          let that = this
          apiRequestConfirm('删除优惠券').then(function () {
            that.$http.fetch(that.$api.marketing.coupon.deleteById
              , { id: obj.row.id })
              .then((resp) => {
                that.$notify.success(resp.msg)
                that.$reload()
              })
          }).catch((resp) => {
            that.$notify.error(resp.msg)
          }).catch(() => {})
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
          this.$emit('add-coupon')
        },
        'icon': '$.noop',
        'name': '\u65b0\u589e',
        'auth': ``,
        'visible': ``
      }
    ]

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'couponTitle',
      'text': '优惠券名称',
      'placeholder': '请输入优惠券名称',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({},
      {
        couponTitle: '',
        denominations: '',
        couponStatus: ''
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
      state: {},
      url: this.$api.marketing.coupon.queryTable,
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
  },
  methods: {
    changeStatus: function (obj) {
      var that = this
      this.$http.fetch(this.$api.marketing.coupon.updateByIdAndJL, { id: obj.id, jl: obj.coupon_jingling_power })
        .then((resp) => {
          that.$notify.success(resp.msg)
          that.$reload()
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        })
    },
    showDetail: function (obj) {
      if (obj.used_count !== 0) {
        this.$emit('open-detail', obj)
      }
    },
    overdue (obj) {
      if (new Date().getTime() > moment(obj).toDate().getTime()) {
        return true
      } else {
        return false
      }
    },
    onSearch () {
      console.log('搜索响应')
    }
  }
}
