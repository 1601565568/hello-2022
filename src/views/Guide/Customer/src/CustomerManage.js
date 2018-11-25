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
      items: {
        address: '浙江省/杭州市/西湖区',
        id: '0',
        birthday: '2018-09-09',
        createTime: '2018-08-08',
        customerId: '88888888',
        customerName: 'Temo',
        grade: 'VIP8',
        gradeName: '高级会员',
        image: 'https://ecrm.oss-cn-hangzhou.aliyuncs.com/test/201811/120,910,104,359,001/e6d44b7b-88a8-47c8-9822-cccb54745b37.png',
        impression: '“伟大的变革——庆祝改革开放40周年大型展览”目前正在中国国家博物馆举行，展览上的“时光杂货铺”内陈列的展品呈现了改革开放40年来人民衣食住行等生活方式的变迁，带领人们“穿越”历史，重温美好时光。',
        memberCard: '888888888',
        mobile: '15888888888',
        point: '88888888',
        sex: '男',
        tagList: [
          {
            id: '999999',
            name: 'kkkkkk',
            tagType: '009',
            value: '998877'
          }
        ]
      },
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
      shopKuhuShow: false,
      // pickerOptions: {
      //   disabledDate (time) {
      //     return time.getTime() > Date.now() - 8.64e7
      //   }
      // },
      _queryConfig: {expand: false}
    }
  },
  methods: {
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
    handleSelectionChange (value) {
      this.multipleSelection = value
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.customerGetGuideTree).then(resp => {
        if (resp.success && resp.result != null) {
          resp.result.map(item => {
            _this.shopFindList.push(...item.children)
          })
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 更换导购弹窗\详情展示
    onRedactFun (val) {
      var _this = this
      if (val === undefined) {
        if (this.multipleSelection.length > 0) {
          _this.shopFindListShow = true
        } else {
          _this.$notify.error('请选择要更换导购的客户')
        }
      } else {
        _this.$http.fetch(_this.$api.guide.guide.customerGetDetail, {
          customerId: Number(val.customerId),
          guideId: Number(val.guideId),
          shopId: null
        }).then(resp => {
          if (resp.success && resp.result != null) {
            _this.items = resp.result
          }
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
        _this.$notify.error('查询失败：' + resp.msg)
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
      this.shopFindListShow = false
    },
    onSave () {
      var _this = this
      _this.shopFindList.map(item => {
        if (_this.value === item.id) {
          _this.value = item
        }
      })
      if (_this.value !== null) {
        _this.multipleSelection.map(item => {
          _this.customerIdList.push(item.customerId)
        })
        this.$http.fetch(this.$api.guide.guide.updateCustomerGuide, {
          customerIds: _this.customerIdList.join(','),
          newGuideId: Number(_this.value.id),
          oldGuideId: Number(_this.value.id),
          shopId: Number(_this.value.parentId)
        }).then(resp => {
          _this.closeDialog()
          _this.$notify.success('保存成功')
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
