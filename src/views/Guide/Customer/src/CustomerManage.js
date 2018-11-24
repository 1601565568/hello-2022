import api from 'configs/http'
// import moment from 'moment/moment'
export default {
  data: function () {
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
    // let model = Object.assign({}, findVo, {}, searchModel)
    // let that = this
    // quickInput.map(item => {
    //   Object.defineProperty(quickSearchModel, item.name, {
    //     get: function () {
    //       return model[item.name]
    //     },
    //     set: function (val) {
    //       model[item.name] = val
    //       // TODO 由于特殊需求导致以下列写法
    //       if (item.type === 'radio') {
    //         that._data._table.quickSearchMap[item.name] = val
    //         that.$quickSearch$()
    //       }
    //     },
    //     enumerable: true
    //   })
    // })
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
      multipleSelections: [],
      customerIdList: [],
      model: model,
      changeValue: {},
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
      changeObj: {},
      state: {},
      obj: {},
      shopFindListShow: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      _queryConfig: {expand: false}
    }
  },
  methods: {
    handleSelectionChange (value) {
      this.multipleSelection = value
      console.log(this.multipleSelection)
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.customerGetGuideTree).then(resp => {
        if (resp.success && resp.result != null) {
          resp.result.map(item => {
            _this.shopFindList.push(...item.children)
          })
          console.log('kkkkk:', _this.shopFindList)
          // _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    onRedactFun () {
      var _this = this
      if (_this.multipleSelection.length > 0) {
        _this.$confirm('正在对 ' + _this.multipleSelection.length + ' 名会员进行导购更换!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.shopFindListShow = true
        })
      } else {
        _this.$notify.error('请选择要进行导购更换的会员！')
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
    // 离职js开始
    // 查询客户列表
    findCustomerList (page, pageSize) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.findCustomerList, {
        searchMap: {
          'guideId': _this.guideId,
          'shopId': _this.shopId,
          'pageSize': _this.paginations.size,
          'pageNo': _this.paginations.page
        }
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.tableDataCustomer = resp.result.data
          _this.paginations.total = parseInt(resp.result.total)
          _this.chooseCustomerFocus()
        }
      }).catch((resp) => {
        // _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 关闭自定义转移弹窗
    onCancelCustomTransfer () {
      var _this = this
      _this.paginations = {
        enable: true,
        size: 10,
        sizeOpts: [5, 10, 15],
        page: 1,
        total: 0
      }
      _this.customFormVisible = false
      _this.receiveGuideId = null
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
    // 利用map key的唯一性去重
    handRepeatCustomer (selected, unSelected) {
      var _this = this
      var map = new Map()
      var arrays = []
      if (unSelected !== null && unSelected !== undefined && unSelected.length > 0) {
        for (let x = 0; x < _this.allPageCustomer.length; x++) {
          for (let y; y < unSelected.length; y++) {
            if (_this.allPageCustomer[x].customerId === unSelected[y]) {
              _this.allPageCustomer.splice(x, 1)
              x--
            }
          }
        }
      } else {
        for (let x = 0; x < selected.length; x++) {
          map.set(selected[x].customerId + '', selected[x])
        }
        for (let y = 0; y < _this.allPageCustomer.length; y++) {
          map.set(_this.allPageCustomer[y].customerId + '', _this.allPageCustomer[y])
        }
        map.forEach(function (value, key, map) {
          arrays.push(value)
        })
        _this.allPageCustomer = arrays
      }
    },
    selectAll: function (selected) {
      var _this = this
      // 当前页全选
      if (selected.length !== 0) {
        var arrays = []
        for (var a = 0; a < selected.length; a++) {
          arrays.push(selected[a])
        }
        _this.thisPageCustomer = arrays
        if (_this.allPageCustomer.length > 0) {
          // 数组去重
          _this.handRepeatCustomer(arrays, null)
        } else {
          _this.allPageCustomer = arrays
        }
      } else {
        // 当前页全不选
        _this.handRepeatCustomer(null, _this.thisPageCustomer)
      }
    },
    selectRow: function (selected, row) {
      var _this = this
      _this.thisPageCustomer = selected
      if (row !== null) {
        for (let x = 0; x < _this.allPageCustomer.length; x++) {
          if (_this.allPageCustomer[x].customerId === row.customerId) {
            _this.allPageCustomer.splice(x, 1)
            break
          }
        }
      }
      if (selected.length > 0) {
        _this.handRepeatCustomer(selected, null)
      }
    },
    chooseCustomerFocus: function () {
      var _this = this
      if (_this.allPageCustomer.length > 0) {
        _this.tableDataCustomer.filter(function (item, index) {
          for (var i = 0; i < _this.allPageCustomer.length; i++) {
            if (_this.allPageCustomer[i].customerId === item.customerId) {
              setTimeout(function () {
                _this.$refs.chooseCustomer.toggleRowSelection(item)
              }, 0)
            }
          }
        })
      }
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
    closeDialog () {
      Object.assign(this.$data.model, this.$options.data().model)
      this.$refs.addForm.resetFields()
      this.dialogFormVisible = false
      this.row = null
    },
    onSave () {
      console.log('value:', this.value)
      var _this = this
      if (_this.value !== null) {
        _this.multipleSelection.map(item => {
          _this.customerIdList.push(item.customerId)
        })
        // this.model.sgGuide = {
        //   customerIds: _this.customerIdList.join(','),
        //   newGuideId: _this.value.id,
        //   oldGuideId: _this.value.id,
        //   shopId: _this.value.parentId
        // }
        this.$http.fetch(this.$api.guide.guide.updateCustomerGuide, {
          customerIds: _this.customerIdList.join(','),
          newGuideId: Number(_this.value),
          oldGuideId: Number(_this.value.id),
          shopId: Number(_this.value.parentId)
        }).then(resp => {
          _this.closeDialog()
          _this.$notify.success('保存成功')
          this.$refs.table.$reload()
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
