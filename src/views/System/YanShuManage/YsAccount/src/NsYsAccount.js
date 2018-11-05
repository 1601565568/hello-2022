import tableMixin from 'mixins/table'
import ErrorCode from 'configs/errorCode'
import apiRequestConfirm from 'utils/apiRequestConfirm'
export default {
  name: 'NsYsAccount',
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
        'func': function (args) {
          this.$emit('detail', 'detail', '通道账号详情', args.row)
        },
        'icon': '$.noop',
        'name': '\u8be6\u60c5',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          this.$emit('open-dialog', 'edit', '修改通道账号', args.row)
        },
        'icon': '$.noop',
        'name': '\u4FEE\u6539',
        'auth': ``,
        'visible': `  `
      },
      {
        'func': function (args) {
          var that = this
          apiRequestConfirm('删除该账号').then(() => {
            that.$http.fetch(this.$api.touch.ysChannel.hasChannelExist, {ysAccount: args.row.ys_account})
              .then((resp) => {
                if (resp.code === ErrorCode.YS_CHANNEL_EXIST) {
                  that.$notify.error('存在未删除的通道，请删除通道后重试')
                } else {
                  that.$http.fetch(this.$api.touch.ysAccount.deleteById, {id: args.row.id})
                    .then(resp => {
                      that.$notify.success(resp.msg)
                      that.$reload()
                    })
                }
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
        'func': function (args) {
          this.$emit('open-dialog')
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
      'name': 'ys_account',
      'text': '账号名称',
      'placeholder': '请输入账号名称',
      'type': 'text',
      'value': ''
      // 'isConvenient': false
    }]

    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {'ys_account': ''}, {})
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
      url: this.$api.touch.ysAccount.queryTable,
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
  methods: {}
}
