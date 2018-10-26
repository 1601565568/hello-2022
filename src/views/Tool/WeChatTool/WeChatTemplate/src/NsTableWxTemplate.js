import tableMixin from 'mixins/table'
import apiRequestConfirm from 'utils/apiRequestConfirm'
export default {
  name: 'NsTableWxTemplate',
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
          this.$emit('edit', args.row)
        },
        'icon': '$.noop',
        'name': '修改',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          let that = this
          apiRequestConfirm('删除微信模板').then(() => {
            // 删除行记录
            that.deleteRow(that.$api.touch.wxTemplate.deleteById, args.row.id)
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
        'func': function () {
          this.$emit('add')
        },
        'icon': '$.noop',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': `  `
      }
    ]
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'templateName',
      'text': '模板名称',
      'placeholder': '请输入模板名称',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = {'templateCode': '', 'templateName': '', 'templateType': ''}
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      url: this.$api.touch.wxTemplate.queryTable,
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
  computed: {},
  methods: {},
  props: {
    templateTypeOptions: Array,
    wxAccountOptions: Array
  }
}
