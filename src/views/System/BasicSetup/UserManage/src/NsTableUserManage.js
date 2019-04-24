import tableMixin from 'web-crm/src/mixins/table'
import NsDroptree from 'web-crm/src/components/NsDroptree'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
import $ from 'jquery'

export default {
  name: 'NsTableUserManage',
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
          this.$emit('update-user', obj.row)
        },
        'icon': '$.noop',
        'name': '\u4fee\u6539',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          let that = this
          apiRequestConfirm('删除用户').then(function () {
            that.$http.fetch(that.$api.core.sysUser.batchDel
              , { ids: obj.row.id })
              .then((resp) => {
                that.$notify.success('删除成功')
                that.$reload()
              }).catch((resp) => {
                that.$notify.error(resp.msg)
              })
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
          this.$emit('add-user')
        },
        'icon': '$.noop',
        'name': '\u65b0\u589e',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function () {
          var that = this
          var data = that.$parent.$getSelectionsOfCurrPage()
          if (data.length > 0) {
            let ids = data.map(x => x.id)
            apiRequestConfirm('删除所选择的用户').then(function () {
              that.$http.fetch(that.$api.core.sysUser.batchDel, { ids: ids })
                .then((resp) => {
                  that.$notify.success('删除成功')
                  that.$parent.$reload()
                }).catch((resp) => {
                  that.$notify.error(resp.msg)
                })
            }).catch(() => {})
          } else {
            this.$notify.warning('未选择用户')
          }
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': ``
      }
    ]

    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
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
        name: '',
        userStatus: '',
        roleId: '',
        department: {}
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
      url: this.$api.core.sysUser.queryTable,
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
    NsDroptree
  },
  methods: {
    '$handleParams': function (params) {
      if (params.searchMap && !$.isEmptyObject(params.searchMap.department)) {
        params.searchMap.departmentId = params.searchMap.department.value
      }
      delete params.searchMap.department
      return params
    },
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    changeStatus: function (obj) {
      this.$http.fetch(this.$api.core.sysUser.updateUserStatus, { id: obj.id, userStatus: obj.user_status })
        .then((resp) => {
        })
    },
    onSearch () {
      console.log('搜索响应')
    }
  }
}
