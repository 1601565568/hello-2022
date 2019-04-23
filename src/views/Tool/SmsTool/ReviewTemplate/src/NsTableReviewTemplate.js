import tableMixin from 'mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

export default {
  name: 'NsTablereviewTemplate',
  mixins: [tableMixin],
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
        'func': function (args) {
          this.$emit('open-dialog', 'edit', '修改回评模板', args.row)
        },
        'icon': '$.noop',
        'name': '\u4FEE\u6539',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          var that = this
          apiRequestConfirm('删除该回评模板').then(() => {
            that.$http.fetch(this.$api.touch.reviewTemplate.deleteById, { id: args.row.id })
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
          this.$emit('open-dialog', 'add', '新增回评模板')
        },
        'icon': '$.noop',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': `  `
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
            this.$confirm('是否确定删除所选择回评模板？', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$http.fetch(this.$api.touch.reviewTemplate.batchDeleteReviewTemplate, {ids: ids.substring(ids, ids.length - 1)})
                .then((resp) => {
                  that.$notify.success(resp.msg)
                  that.$parent.$reload()
                })
            })
          } else {
            this.$notify({
              type: 'warning',
              message: '未选择回评模板'
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
      'template': '',
      'inline': false,
      'name': 'templateTitle',
      'text': '模板名称',
      'placeholder': '请输入模板名称',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {}, {})
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
      url: this.$api.touch.reviewTemplate.queryTable,
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
    }
  },
  props: {
  }
}
