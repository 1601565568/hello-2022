import tableMixin from 'web-crm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import BindDevice from '../components/BindDevice'

export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  components: { BindDevice },
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
        'func': function (scope) {
          this.onRedactFun(scope.row)
        },
        'icon': '',
        'name': '编辑',
        'auth': ``,
        'visible': `scope.row.status !== 2`
      },
      {
        'func': function (scope) {
          this.onShowBindDialog(scope.row)
        },
        'icon': '',
        'name': '绑定终端',
        'auth': ``,
        'visible': `scope.row.job == 1 || (scope.row.job != 1 && !scope.row.deviceNos) `
      },
      {
        'func': function (scope) {
          this.dimissionFun(scope.row)
        },
        'icon': '',
        'name': '离职',
        'auth': ``,
        'visible': `scope.row.status === 0 || scope.row.status === 1`
      },
      {
        'func': function (scope) {
          this.onDelsTipFun(scope.row)
        },
        'icon': '',
        'name': '删除',
        'auth': ``,
        'visible': ``,
        'color': '#f00'
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
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
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
      bindDeviceDialog: {
        visible: false,
        guide: {}
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
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    scopeRowCount (data) { // 查看门店详情和查看所属区域详情
      this.$emit('scopeRowCount', data)
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
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
          _this.$notify.error(getErrorMsg('切换失败，原因', resp))
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    onShowBindDialog (row) {
      this.bindDeviceDialog.guide = row
      this.bindDeviceDialog.visible = true
    }
  }
}
