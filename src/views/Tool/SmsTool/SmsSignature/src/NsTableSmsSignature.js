import tableMixin from 'web-crm/src/mixins/table' // 引入tableMixin
import ErrorCode from '@/config/errorCode'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
export default {
  name: 'NsTableSmsSignature',
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
        'func': function (args) {
          var that = this
          apiRequestConfirm('删除该签名').then(() => {
            that.$http.fetch(this.$api.touch.smsSignature.deleteById, { id: args.row.id })
              .then(resp => {
                that.$notify.success(resp.msg)
                that.$reload()
              })
          }).catch(() => {
          })
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          var that = this
          apiRequestConfirm('提交审核').then(() => {
            that.$http.fetch(this.$api.touch.smsSignature.submitAudit, { id: args.row.id })
              .then(resp => {
                if (resp.code === ErrorCode.SUCCESS) {
                  that.$notify.success(resp.msg)
                } else {
                  that.$notify.error(resp.msg)
                }
                that.$reload()
              })
          }).catch(() => {
          })
        },
        'icon': '$.noop',
        'name': '\u63d0\u4ea4\u5ba1\u6838',
        'auth': ``,
        'visible': `scope.row.sign_status ==0`
      }
    ]

    var operateButtons = [
      {
        'func': function () {
          this.$emit('open-dialog', 'add', '新增签名配置')
        },
        'icon': '$.noop',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': ` `
      }
      /* {
        'func': function () {
          var data = this.$parent.$getSelectionsOfCurrPage()
          if (data.length > 0) {
            var that = this
            var ids = ''
            if (data.length > 0) {
              data.forEach(function (val) {
                ids += val.id + ','
              })
            }
            this.$confirm('是否确定删除所选择的签名？', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$http.fetch(this.$api.touch.smsSignature.batchDeleteByIds, {ids: ids.substring(ids, ids.length - 1)})
                .then((resp) => {
                  that.$notify.success(resp.msg)
                  that.$parent.$reload()
                })
            }).catch(() => {
              that.$notify.error('删除失败')
            })
          } else {
            this.$notify({
              type: 'warning',
              message: '未选择签名'
            })
          }
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      } */
    ]
    var quickInput = [{
      'inline': false,
      'name': 'signatureName',
      'text': '签名',
      'placeholder': '请输入签名',
      'type': 'text',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, { 'signatureName': '', 'userName': '' }, {})
    var that = this

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
      rules: Object.assign({}, {}, {}),
      state: {},
      url: this.$api.touch.smsSignature.queryTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false }
    }
  },
  mounted: function () {
    // 初始化搜索框的事件监听
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    onEffectiveChange: function (call, currVal, row) {
      this.$emit('effective-change', call, currVal, row)
    },
    onDefaultChange: function (call, currVal, row) {
      this.$emit('default-change', call, currVal, row)
    }
  },
  created: function () {
  }
}
