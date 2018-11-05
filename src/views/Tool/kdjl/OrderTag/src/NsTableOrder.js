import tableMixin from 'mixins/table'
import apiRequestConfirm from 'utils/apiRequestConfirm'

export default {
  name: 'NsTableOrder',
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
          let that = this
          apiRequestConfirm('删除订单标签').then(function () {
            that.$http.fetch(that.$api.kdjl.jlOrderTag.deleteByIds
              , {ids: obj.row.id})
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
          this.$emit('add')
        },
        'icon': '$.noop',
        'name': '新增订单标签',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
          let that = this
          var data = that.$parent.$getSelectionsOfCurrPage()
          if (data.length === 0) {
            that.$notify.warning('请选择订单标签')
          } else {
            apiRequestConfirm('删除所选择订单标签').then(function () {
              let ids = data.map(x => x.id)
              that.$http.fetch(that.$api.kdjl.jlOrderTag.deleteByIds
                , {ids: ids.join(',')})
                .then((resp) => {
                  that.$notify.success(resp.msg)
                  that.$parent.$reload()
                })
            }).catch((resp) => {
              that.$notify.error(resp.msg)
            }).catch(() => {})
          }
        },
        'icon': '$.noop',
        'name': '删除',
        'auth': ``,
        'visible': ``
      }
    ]

    return {
      model: {
        shopId: '',
        type: '',
        name: ''
      },
      quickSearchModel: {},
      rules: Object.assign({}, {}, {}),
      state: {},
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.kdjl.jlOrderTag.queryTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons
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
  components: {},
  methods: {
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    }
  }
}
