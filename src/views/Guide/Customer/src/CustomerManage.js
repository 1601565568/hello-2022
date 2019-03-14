import api from 'configs/http'
import tableMixin from 'mixins/table'
export default {
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let searchModel = {
      sgGuide: {
        guideId: null,
        name: null,
        nickname: null,
        mobile: null
      },
      sgGuideShop: {
        id: null,
        shopId: null,
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
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      brandId: null,
      title: '导购更换列表',
      dialogFormVisible: false,
      allPageCustomer: [],                // 选择的所有的客户
      thisPageCustomer: [],               // 当前页面全选的客户
      pageChange: true,                   // 当前页数
      guideId: null,                      //  当前导购的id
      shopId: null,
      successCount: null,
      failCount: null,
      receiveGuideId: null,               //  接收的导购id
      customerTotal: null,
      row: null,
      guideList: [],
      shopList: [],
      shopFindList: [],
      guideShopList: [],
      tableDataCustomer: [],        // 客户集合
      multipleSelection: [],
      multipleSelections: [],       // 客户详情数组
      customerIdList: [],
      kehushow: false,
      pagination: pagination,
      model: model,
      items: {},
      changeValue: {},
      particularsObj: [],
      logoValue: null,
      nicknameValue: null,
      birthdayValue: null,
      sexsValue: null,
      mobileValue: null,
      jobsValue: null,
      namesValue: null,
      storeValue: null,
      workIdChangeValue: null,
      value: null,
      radio: null,
      changeObj: {},
      state: {},
      obj: {},
      shopFindListShow: false,
      shopKuhuShow: false,
      result: null,
      // pickerOptions: {
      //   disabledDate (time) {
      //     return time.getTime() > Date.now() - 8.64e7
      //   }
      // },
      _queryConfig: {expand: false}
    }
  },
  mixins: [tableMixin],
  methods: {
    getCurrentRow (row, index) { // 单选按钮
      this.radio = index
      this.value = row
    },
    searchAction (model) { // 搜索
      this.guideFindList(model)
    },
    resetInputAction () { // 重置
      this.model.name = null
      this.model.shop = null
      this.guideFindList()
    },
    async findBrandShopList (model) { // 门店列表查询
      let that = this
      await this.$http
        .fetch(that.$api.guide.shop.findBrandShopList, {isOnline: 0})
        .then(resp => {
          that.shopList = [...resp.result]
        })
        .catch(resp => {
          this.$notify.error(resp.msg || '查询失败')
        })
    },
    async guideFindList (model) { // 导购列表查询
      let that = this
      // let shopList = []
      let numbers = /^[1-9]+[0-9]*]*$/
      let obj = {
        length: 15,
        searchMap: {
          shopId: null,
          keyword: null
        },
        start: 0
      }
      if (model !== undefined) {
        obj.searchMap.keyword = model.name
        obj.searchMap.shopId = parseInt(model.shop)
      }
      if (numbers.test(model)) {
        obj.length = model
      }
      await this.$http
        .fetch(that.$api.guide.guide.findShopGuide, obj)
        .then(resp => {
          that.particularsObj = [...resp.result.data]
          that.pagination.total = Number(resp.result.recordsTotal)
          that.particularsObj.map((item, i) => {
            if (item[i].id === item[i + 1].id) {
              item.splice(item[i], item[i + 1])
            }
          })
          that.shopList = new Set(that.shopList)
          that.shopList = Array.from(that.shopList)
        })
        .catch(resp => {
          // this.$notify.error(resp.msg || '查询失败')
        })
    },
    onKeyUp (e) {
      var key = window.event.keyCode
      var _this = this
      if (key === 13) {
        _this.onSave()
      } else if (key === 27) {
        _this.$confirm('内容被修改是否要保存！', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        })
      } else {
        _this.shopFindListShow = false
      }
    },
    // 分页-页数改变
    shopPageChange (page) {
      let that = this
      that.pagination.page = page
      let shopList = []
      let obj = {
        length: 15,
        searchMap: {
          shopId: null,
          keyword: null
        },
        start: (page - 1) * 15
      }
      this.$http.fetch(that.$api.guide.guide.findShopGuide, obj)
        .then(resp => {
          that.particularsObj = [...resp.result.data]
          that.pagination.total = Number(resp.result.recordsTotal)
          that.particularsObj.map((item, i) => {
            if (item[i].id === item[i + 1].id) {
              item.splice(item[i], item[i + 1])
            }
          })
          that.shopList = new Set(shopList)
          that.shopList = Array.from(that.shopList)
        })
        .catch(resp => {
          // this.$notify.error(resp.msg || '查询失败')
        })
      // _this.guideFindList(page)
    },
    // 分页-大小改变
    shopSizeChange (pageSize) {
      var _this = this
      _this.pagination.size = pageSize
      _this.pagination.page = 1
      _this.guideFindList(pageSize)
    },
    handleSelectionChange (value) {
      this.multipleSelection = value
    },
    guideChange (value) {
      this.multipleSelection = value
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.customerGetGuideTree).then(resp => {
        if (resp.success && resp.result !== null) {
          resp.result.map(item => {
            _this.shopFindList.push(...item)
          })
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 更换导购弹窗\详情展示
    onRedactFun (val) {
      let _this = this
      if (val === undefined) {
        if (this.multipleSelection.length > 0) {
          _this.shopFindListShow = true
          _this.guideFindList()
          _this.findBrandShopList()
        } else {
          _this.$notify.error('请选择要更换导购的客户')
        }
      } else {
        _this.title = '客户详情'
        _this.$http.fetch(_this.$api.guide.guide.customerGetDetail, {
          nick: val.nick,
          nickType: val.nickType,
          guideId: Number(val.guideId),
          shopId: null
        }).then(resp => {
          if (resp.success && resp.result != null) {
            _this.shopKuhuShow = true
            _this.items = resp.result
          }
        }).catch((resp) => {
          _this.$notify.error('查询失败：' + resp.msg)
        })

        _this.$http.fetch(_this.$api.guide.guide.customerQueryValidPoint, {
          // customerId: val.customerId
          nick: val.nick,
          nickType: val.nickType
        }).then(resp => {
          _this.result = resp.result
        }).catch((resp) => {
          _this.$notify.error('查询失败：' + resp.msg)
        })
      }
    },
    shopEdit (row) {
      var _this = this
      _this.row = row
      if (row) {
        _this.queryGuideShopList(row.id)
        _this.shopFormVisible = true
      }
    },
    // 查询客户列表
    findCustomerList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.customerFindCustomerList, {
        searchMap: {
          'guideId': _this.guideId,
          'shopId': _this.shopId,
          'pageSize': _this.pagination.size,
          'pageNo': _this.pagination.page
        }
      }).then(resp => {
        if (resp.success && resp.result !== null) {
          _this.tableDataCustomer = resp.result.data
          _this.pagination.total = parseInt(resp.result.recordsTotal)
          _this.chooseCustomerFocus()
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 分页-页数改变
    customerPageChange (page) {
      var _this = this
      _this.pagination.page = page
      _this.findCustomerList()
    },
    // 分页-大小改变
    customerSizeChange (pageSize) {
      var _this = this
      _this.pagination.size = pageSize
      _this.pagination.page = 1
      _this.findCustomerList()
    },
    closeDialog () {
      this.shopFindListShow = false
    },
    onSave () {
      let _this = this
      let obj = {
        nick: null,
        nickType: null
      }
      if (_this.value !== null) {
        _this.customerIdList = []
        _this.multipleSelection.map(item => {
          obj.nick = item.nick
          obj.nickType = item.nickType
          obj = Object.assign({}, obj)
          _this.customerIdList.push(obj)
        })
        // _this.customerIdList = JSON.stringify(_this.customerIdList)
        this.$http.fetch(this.$api.guide.guide.updateCustomerGuide, {
          nickListJson: _this.customerIdList,
          newGuideId: Number(_this.value.id),
          shopId: Number(_this.value.shopId)
        }).then(resp => {
          _this.$notify.success('保存成功')
          _this.$refs.table1.$reload()
          _this.closeDialog()
        }).catch((resp) => {
          _this.$notify.error('保存失败：' + resp.msg)
        })
      } else {
        _this.$notify.error('请选择要更换的导购！')
      }
    }
  },
  mounted: function () {
    var _this = this
    _this.initShopList()
  }
}
