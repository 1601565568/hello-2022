import tableMixin from 'mixins/table' // 引入tableMixin
import moment from 'moment'
// import ErrorCode from 'configs/errorCode' // 引入错误代码
export default {
  name: 'NsTableOnlineShop',
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
          this.$emit('open-dialog', 'edit', '修改线上店铺', args.row)
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
          this.$emit('open-dialog', 'addOnline', '新增线上店铺')
        },
        'icon': 'el-icon-add',
        'name': '\u65B0\u589E',
        'auth': ``,
        'visible': `  `
      }
     /* {
        'func': function () {
          that.$notify.success('更新授权成功')
          that.$parent.$refs.table.$reload()
        },
        'icon': 'el-icon-add',
        'name': '\u66f4\u65b0\u6388\u6743',
        'auth': ``,
        'visible': `  `
      } */
      /*
      {
        'func': function () {
          // var that = this
          var data = this.$parent.$getSelectionsOfCurrPage()
          if (data.length <= 0) {
            this.$notify.warning('未选择店铺！')
          } else {
            var ids = []
            var shopNames = []
            if (data.length > 0) {
              data.forEach(function (val) {
                ids.push(val.id)
                shopNames.push(val.shop_name)
              })
            }
            that.$parent.bindBrandModel.brands = ids
            that.$parent.bindBrandModel.shopNames = shopNames
            that.$parent.batchBrindVisiable = true
          }
        },
        'icon': 'el-icon-add',
        'name': '\u6279\u91cf\u5173\u8054\u54c1\u724c',
        'auth': ``,
        'visible': `  `
      }
      */
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
    var model = Object.assign({}, {shop_name: '', uid: '', channels: '', brands: '', platform: []}, {}) // 根据字段修改
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
      isOnline: 1, // 线上
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {shop_name: '', uid: '', channel_code: '', brand_id: '', platform: []}, {}),
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
    that.url = this.$api.core.sysShop.queryOnlineShopList
    this.$http.fetch(this.$api.core.common.queryPlatForm)
      .then((resp) => {
        that.platformOptions = resp.result
      })
    // 初始化搜索框的事件监听
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
  },
  computed: {},
  methods: {
    onReset: function () {
      let that = this
      that.model.channels = ''
      that.model.brands = ''
      that.$refs.table_filter_form.resetFields()
    },
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
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
