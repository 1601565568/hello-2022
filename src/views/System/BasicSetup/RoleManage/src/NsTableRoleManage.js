import tableMixin from 'mixins/table'
import apiRequestConfirm from 'utils/apiRequestConfirm'

export default {
  name: 'NsTableRoleManage',
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
        'func': function (obj) {
          this.$emit('shop-update', obj.row)
        },
        'icon': '$.noop',
        'name': '\u4fee\u6539',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (obj) {
          this.batchDel(obj.row.id)
        },
        'icon': '',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      }
    ]

    var operateButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'icon': '',
        'name': '\u65b0\u589e',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function () {
          var that = this
          var data = that.$parent.$getSelectionsOfCurrPage()
          if (data.length > 0) {
            let ids = data.map(x => x.id)
            this.$parent.batchDel(ids.join(','))
          } else {
            this.$notify.warning('未选择角色')
          }
        },
        'icon': '',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      }
    ]

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'role_name$LK',
      'text': '角色名称',
      'placeholder': '请输入角色名称',
      'type': 'text',
      'value': ''
    }]

    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {'role_name$LK': '', 'state$EQ': 1}, {})
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
      url: this.$api.core.sysRole.queryTable,
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
  components: {},
  methods: {
    batchDel (ids) {
      var that = this
      apiRequestConfirm('删除角色').then(function () {
        that.$http.fetch(that.$api.core.sysRole.batchDetele
          , {'ids': ids})
          .then((resp) => {
            that.$notify.success(resp.msg)
            that.$reload()
          }).catch((resp) => {
            that.$notify.error(resp.msg)
          })
      }).catch(() => {})
    },
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    onSearch () {
      console.log('搜索响应')
    }
  }
}
