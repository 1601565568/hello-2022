import tableMixin from 'mixins/table' // 引入tableMixin
import moment from 'moment'
export default {
  name: 'NsTableOfflineShop',
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
          this.$emit('open-dialog', 'edit', '修改线下店铺', args.row)
        },
        'icon': '$.noop',
        'name': '\u4FEE\u6539', // 以Unicode显示
        'auth': ``,
        'visible': `  `
      }
    ]
    var operateButtons = [
      {
        'func': function () {
          this.$emit('query-shop', 'queryShop', '同步店铺')
        },
        'icon': 'el-icon-add',
        'name': '同步店铺',
        'auth': ``,
        'visible': `  `
      }
      // {
      //   'func': function () {
      //     this.$emit('open-dialog', 'updateOffline', '关注公众号')
      //     // that.$notify.success('关联公众号成功')
      //     // that.$parent.$refs.table.$reload()
      //   },
      //   'icon': 'bui-add',
      //   'name': '\u5173\u8054\u516c\u4f17\u53f7',
      //   'auth': ``,
      //   'visible': `  `
      // }

    ]
    // 查询操作
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'shop_name',
      'text': '店铺名称',
      'placeholder': '请输入店铺名称',
      'type': 'text',
      'value': ''
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    var model = Object.assign({}, {shop_name: '', uid: '', channel_code: '', brand_id: '', province: '', city: '', district: '', type: '', area: []}, {}) // 根据字段修改
    var that = this
    // 直接复制就行
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
      key: {
        children: 'children',
        label: 'label',
        value: 'label',
        disabled: 'disabled'
      },
      quickSearchModel: quickSearchModel,
      isOnline: 1, // 线上
      rules: Object.assign({}, {shop_name: '', uid: '', area: [], channel_code: '', brand_id: '', province: '', city: '', district: '', type: ''}, {}),
      state: {},
      shopTabs: 'online',
      platformOptions: [],
      url: '',
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
    let that = this
    that.url = this.$api.core.sysShop.queryShopList
    this.$http.fetch(this.$api.core.common.queryPlatForm)
      .then((resp) => {
        that.platformOptions = resp.result
      })
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    onOpenDialog: function (type, title, data) {
      console.log(123456)
      this.$emit('open-dialog', type, title, data)
    },
    queryShop: function () {
      console.log('this is queryShop 001')
      this.$http.fetch(this.$api.core.sysShop.queryShop, null)
      .then((resp) => {
        console.log(resp)
      }).catch(() => {
        console.log('queryShop in exception')
      }).finally(() => {
        console.log('queryShop in finally')
      })
    },
    onChange: function (data) {
      let that = this
      that.model.province = data[0]
      that.model.city = data[1]
      that.model.district = data[2]
    },
    onReset: function () {
      let that = this
      that.model.area = []
      that.model.channel_code = ''
      that.model.brand_id = ''
      that.model.province = ''
      that.model.city = ''
      that.model.district = ''
      that.model.type = ''
      // that.model.officialAccount = ''
      that.url = that.$api.core.sysShop.queryOfflineShopList
      that.$refs.table_filter_form.resetFields()
    },
    // 判断有效期是否在当前时间之后，之后说明有效，之前就无效了
    isExpire: function (expireTime) {
      if (expireTime) {
        return moment(expireTime).isAfter(moment())
      }
      return false
    }
  },
  created: function () {
  }
}
