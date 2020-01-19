import { getErrorMsg } from '@/utils/toast'

export default {
  data: function () {
    const tableButtons = [{}]
    const operateButtons = [
      {
        'func': function () {
          this.$emit('add')
        },
        'name': '新增导购'
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
      brand_id: null, // 品牌id
      friendNick: null, // 好友昵称
      privateNick: null, // 个人号昵称
      wName: null
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let that = this
    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // todo 由于特殊需求导致以下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })
    return {
      friendNick: null, // 好友昵称
      wname: null, // 好友微信id
      head: null, // 好友头像
      nick_py_full: null, // 好友昵称全称
      privateNick: null, // 个人号昵称
      wid: null, // 个人号微信id
      dialogFormVisible: false, // 好友信息弹窗
      friendDetail: { // 好友详情
        wid: null, // 个人号id
        wname: null, // 微信号
        gender: -1, // 性别
        head: null, // 头像url
        nick: null, // 微信昵称
        areaName: null // 地区
      },
      title: '详情',
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {}
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      _queryConfig: { expand: false }
    }
  },
  methods: {
    formatTooltip (val) {
      return val / 100
    },
    toTransfer () { // 批量操作前往会员管理页面按钮
      this.$router.push({
        path: '/Guide/Customer/CustomerManage'
      })
    },
    getCurrentRow (row, index) { // 单选按钮
      this.radio = index
      this.value = row
    },
    transfer () {
      this.$router.push({
        path: '/Guide/Customer/CustomerManage'
      })
    },
    logo (value) {
      let _this = this
      _this.changeValue.logoValue = value
      _this.changeObj.logoChange = true
    },
    names (value) {
      let _this = this
      _this.changeValue.namesValue = value
      _this.changeObj.namesChange = true
    },
    changeShop (shopId) {
      this.shopIds = shopId
    },
    handleSelectionChange (value) {
      this.dimissionArry = value
      this.multipleSelection = value
      this.replaceStoresArry = value
      this.allPageCustomer = value
      this.dimissionArry.map(item => {
        if (item.status === 2) {
          this.accordingToJudgmentShow = true
        }
      })
    },
    aaaa () {
      this.$http.fetch(this.$api.overView.exit, {})
    },
    removeDuplicate () { // 好友排重筛选
    },
    initShopList () {

    },
    onRedactFun (wid, ownerId) { // 好友详情功能
      let _this = this
      _this.dialogFormVisible = true
      _this.$http.fetch(this.$api.guide.friendData.frindDetail, {
        wxid: wid,
        ownerId: ownerId }).then(resp => {
        if (resp.success) {
          _this.friendDetail = resp.result
        }
      }).catch(resp => {
        _this.$notify.error(getErrorMsg('查询失败'), resp)
      })
    },
    sendWechatMsg (wid) { // 好友聊天功能
      let _this = this
      _this.$http.fetch(this.$api.guide.friendData.sendMsg,
        { wxid: wid }).then(resp => {
        if (resp.success) {
          // console.log(resp.result)
        }
      }).catch(resp => {
        _this.$notify.error(getErrorMsg('查询失败'), resp)
      })
    },
    // 分页-页数改变
    customerPageChange (page) {
      var _this = this
      _this.paginations.page = page
      _this.findCustomerList()
    },
    // 分页-大小改变
    customerSizeChange (pageSize) {
      var _this = this
      _this.paginations.size = pageSize
      _this.paginations.page = 1
      _this.findCustomerList()
    },
    closeDialog () {
      // Object.assign(this.$data.model, this.$options.data().model)
      this.$data.model = this.$options.data().model
      this.$refs.addForm.resetFields()
      this.dialogFormVisible = false
      this.isHidden = false
      this.row = null
    }
  },
  watch: {
    subordinateStores (newValue) {
      this.storeOwnershipDisplay = !!(newValue && newValue.length > 0)
    }
  }
}
