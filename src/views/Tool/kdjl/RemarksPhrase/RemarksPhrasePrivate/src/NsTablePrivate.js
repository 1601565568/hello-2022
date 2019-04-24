import tableMixin from 'web-crm/src/mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

export default {
  name: 'NsTablePrivate',
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
          for (let index of this._data._table.data) {
            if (index.id === obj.row.id) {
              index.memo_type = 1
            } else {
              index.memo_type = 0
            }
          }
          var that = this
          that.$http.fetch(that.$api.kdjl.remarks.updateMemoType
            , { type: 1, id: obj.row.id })
            .then().catch((resp) => {
              that.$notify.error(resp.msg)
            })
        },
        'icon': '$.noop',
        'name': '自动',
        'auth': ``,
        'visible': ` scope.row.memo_type === 0 `
      },
      {
        'func': function (obj) {
          for (let index of this._data._table.data) {
            if (index.id === obj.row.id) {
              index.memo_type = 0
            }
          }
          var that = this
          that.$http.fetch(that.$api.kdjl.remarks.updateMemoType
            , { type: 0, id: obj.row.id })
            .then().catch((resp) => {
              that.$notify.error(resp.msg)
            })
        },
        'icon': '$.noop',
        'name': '取消',
        'auth': ``,
        'visible': ` scope.row.memo_type === 1 `
      },
      {
        'func': function (obj) {
          this.$emit('update-private', obj.row)
        },
        'icon': '$.noop',
        'name': '\u4fee\u6539',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          let that = this
          apiRequestConfirm('删除备注短语').then(function () {
            that.$http.fetch(that.$api.kdjl.remarks.deleteById
              , { ids: obj.row.id.split(',') })
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
          this.$emit('add-private')
        },
        'icon': '$.noop',
        'name': '新增短语',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
          let that = this
          var data = that.$parent.$getSelectionsOfCurrPage()
          if (data.length === 0) {
            this.$notify.warning('请选择备注短语')
          } else {
            apiRequestConfirm('删除所选择备注短语').then(function () {
              let ids = data.map(x => x.id)
              that.$http.fetch(that.$api.kdjl.remarks.deleteById
                , { ids: ids })
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

    var model = { staus: '', shopId: '' }

    return {
      model: model,
      quickSearchModel: {},
      rules: Object.assign({}, {}, {}),
      state: {},
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.kdjl.remarks.queryPriviteTable,
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
    },
    changeStatus: function (obj) {
      var that = this
      this.$http.fetch(this.$api.kdjl.remarks.updateMemoStaus, { status: obj.memo_staus, id: obj.id })
        .then((resp) => {
          that.$notify.success(resp.msg)
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        })
    },
    sortByUpClick (obj) {
      let index = obj.$index
      let data = this._data._table.data
      let other = data[index - 1]
      let frontOrder = other.memo_order
      let indexObj = obj.row
      other.memo_order = indexObj.memo_order
      indexObj.memo_order = frontOrder
      var that = this
      this.$http.fetch(this.$api.kdjl.remarks.updateOrder, { id: indexObj.id, order: indexObj.memo_order, otherId: other.id, otherOrder: other.memo_order })
        .then((resp) => {
          data.splice(index - 1, 1, indexObj)
          data.splice(index, 1, other)
          // that.$notify.success(resp.msg)
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        })
    },
    sortBydownClick (obj) {
      let index = obj.$index
      let data = this._data._table.data
      let other = data[index + 1]
      let backOrder = other.memo_order
      let indexObj = obj.row
      other.memo_order = obj.row.memo_order
      indexObj.memo_order = backOrder
      var that = this
      this.$http.fetch(this.$api.kdjl.remarks.updateOrder, { id: indexObj.id, order: indexObj.memo_order, otherId: other.id, otherOrder: other.memo_order })
        .then((resp) => {
          data.splice(index + 1, 1, indexObj)
          data.splice(index, 1, other)
          // that.$notify.success(resp.msg)
        }).catch((resp) => {
          that.$notify.error(resp.msg)
        })
    }
  }
}
