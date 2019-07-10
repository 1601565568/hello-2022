import tableMixin from 'web-crm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  name: 'NsTableFriend',
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
          this.$emit('add')
        },
        'name': '批量打标'
      },
      {
        'func': function () {
          this.$emit('removeDuplicate')
        },
        'name': '好友排重筛查'
      }
    ]
    const operateButtons = [
      {
        'func': function (args) {
          console.log('参数：' + args)
          this.$emit('onAddCustomer', args.row)
        },
        'icon': '',
        'name': '详情',
        'auth': '',
        'visible': ''
      },
      {
        'func': function (args) {
          this.$emit('ondelete', args.row)
        },
        'icon': '',
        'name': '聊天',
        'auth': '',
        'visible': '',
        'color': '#f00'
      },
      {
        'func': function (args) {
          this.$emit('quit', args.row)
        },
        'icon': '',
        'name': '打标',
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
      friendNick: null, // 好友昵称
      privateNick: null, // 个人号昵称
      wName: null
    }
    let model = Object.assign({}, searchModel)
    return {
      model: model,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {},
        wechatValue: []

      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      select: true
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
      await this.$http.fetch(that.$api.isv.getTemplateInfo, obj)
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
      // var _this = this
      // _this.$http.fetch(_this.$api.guide.friendData.findList).then(resp => {
      //   if (resp.success) {
      //     console.log(resp.result)
      //     // _this.shopFindList = resp.result
      //     _this.wechatValue = resp.result
      //   }
      // }).catch((resp) => {
      //   _this.$notify.error(getErrorMsg('查询失败', resp))
      // })
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
    sendWechatMsg (val) {
      this.$emit('sendWechatMsg', val)
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
    }
  }
}
