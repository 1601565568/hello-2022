import api from '@/config/http'
import moment from 'moment/moment'
import { getErrorMsg } from '@/utils/toast'
export default {
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let paginations = {
      enable: true,
      size: 10,
      sizeOpts: [5, 10, 15],
      page: 1,
      total: 0
    }
    const tableButtons = [{}]
    const operateButtons = [
      {
        'func': function () {
          this.$emit('synchronousStores')
        },
        'name': '同步门店'
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
        work_num: '',
        password: null,
        image: ''
      },
      sgGuideShop: {
        id: null,
        shop_id: '',
        job: 0,
        memberBelonging: 1,
        updateAllGuidePrefix: 0
      },
      sgGuideVo: {
        newShopId: 0,
        type: 0
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
    let rules = {
      'name': [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change' }
      ],
      'shop': [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.model.sgGuideShop.shop_id === null || this.model.sgGuideShop.shop_id === 0) {
              callback(new Error('请选择所属门店'))
            } else {
              callback()
            }
          }
        }
      ],
      'shops': [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.subordinateStores.length < 1) {
              callback(new Error('请选择所属门店'))
            } else {
              callback()
            }
          }
        }
      ],
      'nickname': [
        // {required: true, message: '请输入昵称', trigger: 'blur'},
        { min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change' }
      ],
      'mobile': [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机号格式错误，请您重新输入！' }
      ],
      'work_id': [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.model.sgGuide.work_number === '') {
              callback(new Error('请输入工号'))
            } else {
              callback()
            }
          }
        }
      ]
    }
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
      dataList: [
        {
          id: 0,
          size: 8,
          introduce: {
            size: '小尺寸：适用于屏幕类、宣传册等',
            distance: '边长约8cm，最佳扫码距离0.5m'
          }
        },
        {
          id: 1,
          size: 15,
          introduce: {
            size: '中尺寸：适用于海报、展架等',
            distance: '边长约15cm，最佳扫码距离1m'
          }
        },
        {
          id: 2,
          size: 50,
          introduce: {
            size: '大尺寸：适用于幕布、大型广告等',
            distance: '边长约50cm，最佳扫码距离2.5m'
          }
        }
      ],
      checked: true,
      batchDownLoad: false,
      batchShopIds: '',
      subordinateStores: [],
      showUpdateAllGuidePrefix: false,
      disabledWorkPrefix: true,
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      title: '',
      transferWay: '1',
      url: api.API_ROOT + '/guide/ehd/getShopRecruitmentQrcode?codeType=',
      batchUrl: api.API_ROOT + '/guide/ehd/batchDownloadShopRecruitmentQrcode?codeType=',
      // url: 'http://47.96.228.119:8089/guide/ehd/getShopRecruitmentQrcode?codeType=0&'+shopId=1001267+'&size=1',
      memberBelongingShows: false,
      dialogFormVisible: false,
      shopFormVisible: false, //  店铺弹窗
      resignFormVisible: false, // 导购离职弹窗
      deleteFormVisible: false, // 删除员工弹窗
      specifyTransferFormVisible: false, // 离职-指定转移弹窗
      customFormVisible: false, // 离职-自定义转移弹窗
      allDeleteFormVisible: false, // 批量删除员工弹窗
      shopFindListShow: false, // 更换门店弹窗
      customerIds: null, // 转移的客户ids，用逗号隔开
      allPageCustomer: [], // 选择的所有的客户
      thisPageCustomer: [], // 当前页面全选的客户
      pageChange: true, // 当前页数
      guideId: null, //  当前导购的id
      shopId: null,
      shopIds: null,
      successCount: null,
      failCount: null,
      receiveGuideId: null, //  接收的导购id
      customerTotal: null,
      rules: rules,
      row: null,
      memberBelongingtitle: '',
      memberBelongingShow: false,
      guideList: [],
      shopList: [],
      shopFindList: [],
      guideShopList: [],
      dimissionArry: [], // 批量离职员工数组
      replaceStoresArry: [], // 批量更换门店数组
      tableDataCustomer: [], // 客户集合
      multipleSelection: [],
      multipleSelections: [],
      allDeleteName: [],
      model: model,
      changeValue: {},
      guideValue: null,
      succeedObj: {
        codeType: null,
        shopId: null,
        size: null
      },
      newAdd: {
        brand_id: null,
        name: null,
        nickname: null,
        sex: 1,
        mobile: null,
        birthday: null,
        work_num: '',
        password: null,
        image: '',
        id: null,
        shop_id: null,
        job: 0
      },
      logoValue: null,
      nicknameValue: null,
      birthdayValue: null,
      sexsValue: null,
      mobileValue: null,
      jobsValue: null,
      memberBelongingValue: null,
      namesValue: null,
      storeValue: null,
      workIdChangeValue: null,
      changeObj: {},
      quickSearchModel: quickSearchModel,
      state: {},
      obj: {},
      _pagination: pagination,
      paginations: paginations,
      shopTitle: '门店更换列表',
      scopeRowCountShow: false,
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
      _queryConfig: { expand: false },
      viewId: null
    }
  },
  methods: {
    handlerDownClick (scope, codeType) {
      let params = {
        shopId: this.succeedObj.shopId,
        size: scope.row.size,
        exportType: 36,
        codeType
      }
      if (this.batchDownLoad) {
        params = { ...params, shopIds: this.batchShopIds }
      }
      this.$http.fetch(this.$api.guide.task.exportExcel, params).then((resp) => {
        this.$notify.success('已加入下载中心')
      }).catch((resp) => {
        this.$notify.error(resp.msg || '导出报错，请联系管理员')
      })
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
    nickname (value) {
      let _this = this
      _this.changeValue.nicknameValue = value
      _this.changeObj.nicknameChange = true
    },
    birthday (value) {
      let _this = this
      _this.changeValue.birthdayValue = value
      _this.changeObj.birthdayChange = true
    },
    jobs (value) {
      let _this = this
      _this.guideValue = value
      _this.changeValue.jobsValue = value
      _this.changeObj.jobsChange = true
    },
    memberBelonging (value) {
      let _this = this
      if (value === 1) {
        _this.memberBelongingShows = true
      } else {
        _this.memberBelongingShows = false
        this.model.sgGuideVo.type = 2
      }
      _this.changeValue.memberBelongingValue = value
      _this.changeObj.memberBelongingChange = true
    },
    sexs (value) {
      let _this = this
      _this.changeValue.sexsValue = value
      _this.changeObj.sexsChange = true
    },
    mobile (value) {
      let _this = this
      _this.changeValue.mobileValue = value
      _this.changeObj.mobileChange = true
    },
    names (value) {
      let _this = this
      _this.changeValue.namesValue = value
      _this.changeObj.namesChange = true
    },
    store (vId) {
      let _this = this
      _this.changeValue.storeValue = vId
      _this.changeObj.storeChange = true
    },
    changeShop (shopId) {
      this.shopIds = shopId
    },
    changeMemberBelonging (value) {
      this.model.sgGuideVo.newShopId = value
      this.model.sgGuideShop.shop_id = value
      this.model.sgGuideVo.type = 1
    },
    handleSelectionChange (value) {
      this.multipleSelection = value
      this.dimissionArry = value
      this.replaceStoresArry = value
    },
    memberBelongingEnsure (model) { // 多门店门店减少功能
      let _this = this
      let guide = this.model.sgGuide
      let guideShop = []
      guideShop.push(_this.model.sgGuideVo)
      let sgGuideVo = _this.model.sgGuideVo
      let allImageUrl = null
      _this.subordinateStores.map((item, i) => {
        guideShop[i] = Object.assign({ job: 1, shop_id: item }, guideShop[i])
      })
      // guideShop.shift()
      _this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (guide.birthday instanceof Date) {
            guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
          }
          if (guide.birthday === null) { guide.birthday = '' }
          if (guide.work_num === null) { guide.work_num = '' }
          this.$http.fetch(this.$api.guide.guide.saveOrUpdateGuide, {
            sgGuide: guide,
            sgGuideShopList: guideShop,
            sgGuideVo: sgGuideVo
          }).then(resp => {
            _this.closeDialog()
            _this.$notify.success('保存成功')
            this.$refs.table.$reload()
          }).catch((resp) => {
            _this.closeDialog()
            this.model.sgGuide.image = allImageUrl
            _this.$notify.error(getErrorMsg('保存失败', resp))
          })
        }
      })
    },
    allDelete () { // 组团删除功能
      var _this = this
      if (_this.multipleSelection.length < 1) {
        _this.$notify.error('请选择要操作的员工')
      } else {
        _this.allDeleteName = []
        _this.multipleSelection.map(item => {
          _this.allDeleteName.push(item.name)
        })
        _this.$confirm('请确认是否对 ' + _this.allDeleteName.join('、') + ' 进行删除操作!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.multipleSelection.map(item => {
            _this.multipleSelections.push(item.id)
          })
          _this.$http.fetch(_this.$api.guide.guide.deleteGuides, {
            guideIds: _this.multipleSelections.join(',')
          }).then(resp => {
            if (resp.result.failCount > 0) {
              _this.successCount = resp.result.successCount
              _this.failCount = resp.result.failCount
              _this.allDeleteFormVisible = true
            } else {
              _this.$notify.success('删除成功')
              _this.$refs.table.$reload()
            }
          }).catch((resp) => {
            _this.$notify.error(getErrorMsg('查询失败', resp))
          })
        })
      }
    },
    dimission () { // 组团离职功能
      var _this = this
      var dimissionshopIdArry = []
      var dimissionIdArry = []
      if (_this.dimissionArry.length < 1) {
        _this.$notify.error('请选择要操作的员工')
      } else {
        _this.allDeleteName = []
        _this.dimissionArry.map(item => {
          _this.allDeleteName.push(item.name)
        })
        _this.$confirm('请确认是否对 ' + _this.allDeleteName.join('、') + ' 进行离职操作!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.allDeleteName = []
          _this.dimissionArry.map(item => {
            if (item.status === 2) {
              _this.allDeleteName.push(item.name)
              _this.$confirm(_this.allDeleteName.join('、') + '已经是离职状态!', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
            } else {
              dimissionIdArry.push(item.id)
              dimissionshopIdArry.push(item.shop_id)
            }
          })
          _this.$http.fetch(_this.$api.guide.guide.guideLeave, {
            guideIds: dimissionIdArry.join(','),
            shopIds: dimissionshopIdArry.join(',')
          }).then(resp => {
            if (resp.result.failCount > 0) {
              _this.successCount = resp.result.successCount
              _this.failCount = resp.result.failCount
              _this.allDeleteFormVisible = true
            } else {
              _this.$notify.success('批量离职成功')
              _this.$refs.table.$reload()
            }
          }).catch((resp) => {
            _this.$notify.error(getErrorMsg('查询失败', resp))
          })
        })
      }
    },
    showShop () {
      var _this = this
      if (_this.replaceStoresArry.length < 1) {
        _this.$notify.error('请选择要操作的员工')
      } else {
        _this.allDeleteName = []
        _this.dimissionArry.map(item => {
          _this.allDeleteName.push(item.name)
        })
        _this.$confirm('请确认是否对 ' + _this.allDeleteName.join('、') + ' 进行更换门店操作!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.shopFindListShow = true
          _this.allDeleteName = []
          _this.replaceStoresArry.map(item => {
            _this.allDeleteName.push(item.name)
          })
        })
      }
    },
    replaceStores () { // 组团更换门店功能
      var _this = this
      var dimissionIdArry = []
      _this.replaceStoresArry.map(item => {
        dimissionIdArry.push(item.id)
      })
      if (this.shopIds !== null) {
        _this.$http.fetch(_this.$api.guide.guide.updateShopId, {
          guideIds: dimissionIdArry.join(','),
          shopId: this.shopIds
        }).then(resp => {
          if (resp.result.failCount > 0) {
            _this.successCount = resp.result.successCount
            _this.failCount = resp.result.failCount
            _this.allDeleteFormVisible = true
          } else {
            _this.shopFindListShow = false
            _this.$notify.success('批量更换门店成功')
            _this.$refs.table.$reload()
          }
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })
      }
    },
    elIconMenu ({ row, viewId }) {
      let _this = this
      _this.viewId = viewId
      _this.succeedObj.shopId = row.id
      _this.memberBelongingShow = true
      _this.batchDownLoad = false
      _this.title = '下载招募码'
    },
    batchElIconMenu ({ row, viewId }) {
      let _this = this
      _this.viewId = viewId
      _this.batchShopIds = row
      _this.memberBelongingShow = true
      _this.batchDownLoad = true
      _this.title = '批量下载招募码'
    },
    scopeRowCount (data) {
      this.scopeRowCountShow = true
      this.memberBelongingtitle = '查看关联数字门店详情'
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findDigitalShopByShopId, { shopId: data }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    onDelsTipFun (row) {
      var _this = this
      _this.$confirm('请确认是否对 ' + row.name + ' 进行删除操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$http.fetch(_this.$api.guide.guide.deleteGuides, {
          guideIds: row.id
        }).then(resp => {
          if (resp.result.failCount > 0) {
            _this.deleteFormVisible = true
          } else {
            _this.$notify.success('删除成功')
            _this.$refs.table.$reload()
          }
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('删除失败，原因', resp))
        })
      })
    },
    initShopList () {
      // var _this = this
      // _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then(resp => {
      //   if (resp.success && resp.result != null) {
      //     _this.shopFindList = resp.result
      //   }
      // }).catch((resp) => {
      //   _this.$notify.error(getErrorMsg('查询失败', resp))
      // })
    },
    queryGuideShopList (guideId) {
      var _this = this
      _this.$http.fetch(this.$api.guide.guide.queryGuideShopList, {
        guide_id: guideId
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.guideShopList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    onRedactFun () { // 同步门店
      let _this = this
      _this.$http.fetch(this.$api.guide.guide.shopSyn).then(resp => {
        _this.$notify.success(resp.msg)
        _this.$refs.table.$reload()
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('同步失败', resp))
      })
    },
    onSave (model) {
      let _this = this
      let guide = this.model.sgGuide
      let guideShop = []
      let sgGuideVo = {}
      let allImageUrl = null
      let updateAllGuidePrefix = this.model.sgGuideShop.updateAllGuidePrefix
      if (model.sgGuideShop.job === 1 && this.title === '编辑员工信息') {
        this.$http.fetch(this.$api.guide.guide.findGuideShopCustomerSum, {
          guideId: model.sgGuideShop.id,
          shopIds: this.subordinateStores.join(',')
        }).then(resp => {
          if (resp.result.sum > 0) {
            _this.memberBelongingtitle = '选择会员归属'
            _this.memberBelongingShow = true
            sgGuideVo = this.model.sgGuideVo
          } else {
            _this.$refs.addForm.validate((valid) => {
              if (valid) {
                if (guide.birthday instanceof Date) {
                  guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                }
                if (guide.birthday === null) { guide.birthday = '' }
                if (guide.work_num === null) { guide.work_num = '' }
                _this.subordinateStores.map((item, i) => {
                  guideShop[i] = Object.assign({ job: 1, shop_id: item }, guideShop[i])
                })
                this.$http.fetch(this.$api.guide.guide.saveOrUpdateGuide, {
                  sgGuide: guide,
                  sgGuideShopList: guideShop,
                  sgGuideVo: sgGuideVo,
                  updateAllGuidePrefix: updateAllGuidePrefix
                }).then(resp => {
                  _this.closeDialog()
                  _this.$notify.success('保存成功')
                  this.$refs.table.$reload()
                }).catch((resp) => {
                  _this.closeDialog()
                  this.model.sgGuide.image = allImageUrl
                  _this.$notify.error(getErrorMsg('保存失败', resp))
                })
              }
            })
          }
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('请求失败', resp))
        })
      } else {
        if (this.title === '新增员工' && model.sgGuideShop.job === 1) {
          this.subordinateStores.map((item, i) => {
            guideShop[i] = Object.assign({ job: 1, shop_id: item }, guideShop[i])
          })
          _this.$refs.addForm.validate(valid => {
            if (valid) {
              if (guide.birthday instanceof Date) {
                guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
              }
              if (guide.birthday === null) { guide.birthday = '' }
              if (guide.work_num === null) { guide.work_num = '' }
              this.$http.fetch(this.$api.guide.guide.saveOrUpdateGuide, {
                sgGuide: guide,
                sgGuideShopList: guideShop,
                sgGuideVo: sgGuideVo,
                updateAllGuidePrefix: updateAllGuidePrefix
              }).then(resp => {
                _this.closeDialog()
                _this.$notify.success('保存成功')
                this.$refs.table.$reload()
              }).catch((resp) => {
                _this.closeDialog()
                this.model.sgGuide.image = allImageUrl
                _this.$notify.error(getErrorMsg('保存失败', resp))
              })
            }
          })
        }
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
      let _this = this
      if (guideId === _this.guideId) {
        return true
      } else {
        return false
      }
    },
    /**
     * 校验工号
     * @param list
     */
    workIdChange (value) {
      var _this = this
      _this.changeObj.workIdChangeChange = true
      _this.changeValue.workIdChangeValue = value
      // var regin = /^(0|[1-9][0-9]*)$/
      // var flag = regin.test(_this.model.sgGuide.work_num)
      var guideId = null
      if (_this.row != null) {
        guideId = _this.row.id
      }
      _this.$http.fetch(this.$api.guide.guide.checkGuideWorkId, {
        id: guideId,
        work_num: _this.model.sgGuide.work_num
      }).then((resp) => {
        if (resp.result !== '0') {
          _this.model.sgGuide.work_num = null
          this.$notify.info('工号存在，请重新输入')
        }
      }).catch((resp) => {
        this.$notify.error('校验工号失败' + resp.result)
      })
    },
    // 处理上传图片
    'handleAvatarSuccess': function (res, file) {
      var _this = this
      _this.model.sgGuide.image = res.result.url
    },
    closeDialog () {
      Object.assign(this.$data.model, this.$options.data().model)
      this.$refs.addForm.resetFields()
      this.dialogFormVisible = false
      this.row = null
    },
    beforeAvatarUpload (file) {
      if (file.size / 1024 > 200) {
        this.$notify.error('上传图片不得大于200KB')
        return false
      }
    }
  },
  mounted: function () {
    // var _this = this
    // _this.initShopList()
  }
}
