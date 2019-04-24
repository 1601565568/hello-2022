import tableMixin from 'web-crm/src/mixins/table'
import NsArea from 'web-crm/src/components/NsArea'
export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        'func': function () {
          this.$emit('synchronousStores')
        },
        'name': '同步门店'
      }
    ]
    const operateButtons = [
      {
        'func': function (args) {
          this.$emit('onAddCustomer', args.row)
        },
        'icon': '',
        'name': '编辑',
        'auth': '',
        'visible': ''
      },
      {
        'func': function (args) {
          this.$emit('ondelete', args.row)
        },
        'icon': '',
        'name': '删除',
        'auth': '',
        'visible': '',
        'color': '#f00'
      },
      {
        'func': function (args) {
          this.$emit('quit', args.row)
        },
        'icon': '',
        'name': '离职',
        'auth': '',
        'visible': ''
      }
    ]
    let quickInput = [{
      'template': '',
      'inline': false,
      'name': 'name',
      'text': '任务名称',
      'placeholder': '请输入任务名称',
      'type': 'text',
      'value': ''
    }]
    let quickSearchNames = quickInput.map(x => x.name)
    let quickSearchModel = {}
    let searchModel = {
      sgGuide: {
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_id: null,
        password: null,
        image: null
      },
      sgGuideShop: {
        id: null,
        shop_id: null,
        job: 0
      }
    }
    let findVo = {
      'shopName': null, // 门店名称
      'city': null, // 门点所在区域市
      'district': null, // 门点所在区域区
      'province': null, // 门点所在区域省
      'shopType': null, // 门店类型
      'phone': null, // 联系电话
      'area_region': null, // 所属地区
      'shopStatus': null, // 营业状态
      'area': [] // 所属区域
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      select: true,
      shopLeiXing: [{
        value: 'B',
        label: '天猫'
      }, {
        value: 'C',
        label: '淘宝店'
      }, {
        value: 'ZYD',
        label: '直营店'
      }, {
        value: 'JMD',
        label: '加盟店'
      }],
      operatingStatus: [{
        value: -2,
        label: '已关店'
      }, {
        value: -1,
        label: '暂停'
      }, {
        value: 1,
        label: '正常营业'
      }],
      searchform: {
        // 区域选择相关start
        key: {
          children: 'children',
          label: 'label',
          value: 'label',
          disabled: 'disabled'
        }
      }
    }
  },

  mounted: function () {
    var vm = this
    vm.initShopList()
    if (typeof this.$init === 'function') {
    } else {
      this.$reload()
    }
  },
  components: {
    NsArea
  },
  computed: {},
  methods: {
    async scopeRowCountAndviewDetails (succeedObj) { // 查看门店详情和查看所属区域详情
      let that = this
      let obj = {}
      obj.templateId = succeedObj.template_id
      obj.appId = succeedObj.app_id
      that.particularsObj = {}
      await this.$http
        .fetch(that.$api.isv.getTemplateInfo, obj)
        .then(resp => {
          resp.result.audit_category = JSON.parse(resp.result.audit_category)
          that.particularsObj = resp.result
        })
        .catch(resp => {
          this.$notify.error(resp.msg || '查询失败')
        })
    },
    elIconMenu () {
      this.$emit('elIconMenu')
    },
    scopeRowCount (data) { // 查看门店详情和查看所属区域详情
      this.$emit('scopeRowCount', data)
    },
    onAreaChange () { // 城市切换进行赋值
      let that = this
      that.model.district = that.model.area[2]
      that.model.city = that.model.area[1]
      that.model.province = that.model.area[0]
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    shopDel (index) {
      this.guideShopList.splice(index, 1)
    },
    disabled (shopId) {
      let retVal = this.guideShopList.some(item => {
        return item.shopId === shopId
      })
      return retVal
    },
    thisGuideDisabled (guideId) {
      let retVal = this.guideShopList.some(item => {
        return item.id === guideId
      })
      return retVal
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    onRedactFun (val) {
      this.$emit('onRedactFun', val)
    },
    onDelsTipFun (val) {
      this.$emit('onDelsTipFun', val)
    },
    dimissionFun (val) {
      this.$emit('dimissionFun', val)
    },
    // 解析后台传进来的字符串
    strToJson (str) {
      if (str && str.length > 0) {
        return JSON.parse(str)
      } else {
        return null
      }
    },
    getListFirst (list) {
      if (list && list.length > 0) {
        return list[0]
      } else {
        return {
          district: '',
          name: '',
          job: ''
        }
      }
    },
    changeState (state, id) {
      let _this = this
      _this.$http.fetch(_this.$api.guide.guide.updateGuideStatus, {
        guideId: id,
        status: state
      }).then(resp => {
        if (resp.success) {
          _this.$notify.success('切换成功！')
        } else {
          _this.$notify.error('切换失败，原因：' + resp.msg)
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    }
  }
}
