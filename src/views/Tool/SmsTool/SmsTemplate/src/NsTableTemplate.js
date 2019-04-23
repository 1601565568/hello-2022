import tableMixin from 'mixins/table'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'
export default {
  name: 'NsTableTemplate',
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
          this.$emit('update-template', obj.row)
        },
        'icon': '$.noop',
        'name': '\u7f16\u8f91',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (obj) {
          var that = this
          apiRequestConfirm('删除该模板').then(() => {
            that.$http.fetch(that.$api.touch.smsTemplate.deleteById, { id: obj.row.id })
              .then((resp) => {
                that.$notify.success('删除成功')
                delete that.model.id
                that.$parent.$refs.smsTemplate.$reload()
              }).catch(() => {
              }).finally(() => {
                that.loading = false
                that.wxTemplateVisible = true
              })
          }).catch(() => {})
        },
        'icon': '$.noop',
        'name': '\u5220\u9664',
        'auth': ``,
        'visible': `  `
      }
    ]

    var operateButtons = [
      {
        'func': function (obj) {
          this.$emit('add-template')
        },
        'icon': 'el-icon-add',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': `  `
      }
      /* {
        'func': function () {
          var that = this
          var data = this.$parent.$getSelectionsOfCurrPage()
          if (data.length <= 0) {
            this.$notify.warning('未选择模板！')
          } else {
            var ids = ''
            if (data.length > 0) {
              data.forEach(function (val) {
                ids += val.id + ','
              })
            }
            this.$confirm('是否确定删除所选模板?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'}).then(function () {
                that.$http.fetch(that.$api.touch.smsTemplate.batchDeleteByIds, {ids: ids.substring(ids, ids.length - 1)})
              .then((resp) => {
                that.$notify.success(resp.msg)
                that.$parent.$reload()
              }).catch(() => {
                that.$notify.error('删除失败')
              }).finally(() => {
              })
              }).catch(() => {

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
      'template': '',
      'inline': false,
      'name': 'template_title$LK',
      'text': '模板标题',
      'placeholder': '请输入模板标题',
      'type': 'text',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, { 'templateType': '', 'templateTitle': '' }, {})

    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      url: this.$api.touch.smsTemplate.queryTable,
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
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    }
  }
}
