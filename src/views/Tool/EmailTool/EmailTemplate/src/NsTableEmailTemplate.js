import tableMixin from 'mixins/table' // 引入tableMixin
import apiRequestConfirm from 'utils/apiRequestConfirm'

export default {
  name: 'NsTableEmailTemplate',
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
        'func': function (obj) {
          var NUM = 'eduit'
          this.$emit('email-edit', obj.row, NUM)
        },
        'icon': '$.noop',
        'name': '\u4FEE\u6539',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          var that = this
          apiRequestConfirm('删除该邮件模板').then(() => {
            that.$http.fetch(this.$api.touch.emailTemplate.deleteById, {id: args.row.id})
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
      }

    ]

    var operateButtons = [
      {
        'func': function () {
          this.$emit('email-add')
        },
        'icon': 'el-icon-add',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': `  `
      }
     /* 批量删除先不要
     {
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
            this.$confirm('是否确定删除所选择邮件模板？', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$http.fetch(this.$api.touch.emailTemplate.batchDeleteEmailTemplate, {ids: ids.substring(ids, ids.length - 1)})
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
              message: '未选择邮件模板'
            })
          }
        },
        'icon': 'el-icon-delete',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      } */
    ]

    var quickInput = [{
      'inline': false,
      'name': 'templateTitle',
      'text': '模板标题',
      'placeholder': '请输入模板标题',
      'type': 'text',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {'templateType': '', 'templateTitle': ''}, {
      'templateType': ''
    })
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
      rules: Object.assign({}, {}, {
        template_title$LK: [{
          min: 0,
          max: 100,
          message: '已超过可输入长度',
          trigger: 'blur,change'
        }]
      }),
      state: {},
      url: this.$api.touch.emailTemplate.queryTable,
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
  methods: {
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    }
  },
  computed: {},
  created: function () {
  },
  props: {
    templateTypeOptions: Array
  }
}
