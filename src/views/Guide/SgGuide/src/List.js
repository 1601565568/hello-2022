import api from 'configs/http'
import moment from 'moment/moment'
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
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let rules = {
      'name': [
        {required: true, message: '请输入姓名', trigger: 'blur'},
        {min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change'}
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
        {min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change'}
      ],
      'mobile': [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '手机号格式错误，请您重新输入！'}
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
      subordinateStores: [],
      showUpdateAllGuidePrefix: false,
      disabledWorkPrefix: true,
      imageRoot: api.API_ROOT + '/core/file/showImage?fileKey=',
      title: '',
      transferWay: '1',
      brandId: null,
      memberBelongingShows: false,
      dialogFormVisible: false,
      shopFormVisible: false,             //  店铺弹窗
      resignFormVisible: false,           // 导购离职弹窗
      deleteFormVisible: false,            // 删除员工弹窗
      specifyTransferFormVisible: false,  // 离职-指定转移弹窗
      customFormVisible: false,           // 离职-自定义转移弹窗
      allDeleteFormVisible: false,        // 批量删除员工弹窗
      shopFindListShow: false,            // 更换门店弹窗
      customerIds: null,                  // 转移的客户ids，用逗号隔开
      allPageCustomer: [],                // 选择的所有的客户
      thisPageCustomer: [],               // 当前页面全选的客户
      pageChange: true,                   // 当前页数
      guideId: null,                      //  当前导购的id
      shopId: null,
      shopIds: null,
      successCount: null,
      failCount: null,
      receiveGuideId: null,               //  接收的导购id
      customerTotal: null,
      rules: rules,
      row: null,
      memberBelongingtitle: '',
      memberBelongingShow: false,
      guideList: [],
      shopList: [],
      shopFindList: [],
      guideShopList: [],
      dimissionArry: [],      // 批量离职员工数组
      replaceStoresArry: [],  // 批量更换门店数组
      tableDataCustomer: [],        // 客户集合
      multipleSelection: [],
      multipleSelections: [],
      allDeleteName: [],
      model: model,
      changeValue: {},
      guideValue: null,
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
      _queryConfig: {expand: false}
    }
  },
  methods: {
    updateWorkPrefix () {
      this.disabledWorkPrefix = false
      this.showUpdateAllGuidePrefix = !this.showUpdateAllGuidePrefix
    },
    blurWorkPrefix () {
      this.disabledWorkPrefix = true
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
        guideShop[i] = Object.assign({job: 1, shop_id: item}, guideShop[i])
      })
      guideShop.shift()
      _this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (guide.birthday instanceof Date) {
            guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
          }
          if (guide.birthday === null) guide.birthday = ''
          if (guide.work_num === null) guide.work_num = ''
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
            _this.$notify.error('保存失败：' + resp.msg)
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
            _this.$notify.error('查询失败：' + resp.msg)
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
            _this.$notify.error('查询失败：' + resp.msg)
          })
        })
      }
    },
    showShop () {
      var _this = this
      if (_this.replaceStoresArry.length < 1) {
        _this.$notify.error('请选择要操作的员工')
      } else {
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
          _this.$notify.error('查询失败：' + resp.msg)
        })
      }
    },
    onKeyUp (e) {
      var key = window.event.keyCode
      var _this = this
      if (key === 13) {
        _this.onSave()
      }
      if (key === 27) {
        if (_this.changeObj.workIdChangeChange || _this.changeObj.logoChange || _this.changeObj.nicknameChange || _this.changeObj.birthdayChange || _this.changeObj.sexsChange || _this.changeObj.mobileChange || _this.changeObj.jobsChange || _this.changeObj.namesChange || _this.changeObj.storeChange) {
          _this.$confirm('内容被修改是否要保存！', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (_this.changeObj.storeChange) {
              _this.newAdd.shop_id = _this.storeValue
            } else if (_this.changeObj.namesChange) {
              _this.newAdd.name = _this.namesValue
            } else if (_this.changeObj.nicknameChange) {
              _this.newAdd.nickname = _this.nicknameValue
            } else if (_this.changeObj.birthdayChange) {
              _this.newAdd.birthday = _this.birthdayValue
            } else if (_this.changeObj.sexsChange) {
              _this.newAdd.sex = _this.sexsValue
            } else if (_this.changeObj.mobileChange) {
              _this.newAdd.mobile = _this.mobileValue
            } else if (_this.changeObj.jobsChange) {
              _this.newAdd.job = _this.jobsValue
            } else if (_this.changeObj.workIdChangeChange) {
              _this.newAdd.work_num = _this.workIdChangeValue
            } else if (_this.changeObj.logoChange) {
              _this.newAdd.image = _this.logoValue
            }
            _this.dialogFormVisible = false
          })
        } else {
          _this.dialogFormVisible = false
        }
      }
    },
    scopeRowCount (data) { // 查看员工属性
      this.scopeRowCountShow = true
      this.memberBelongingtitle = '查看员工属性详情'
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.findGuideShopList, {guideId: data}).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
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
          _this.$notify.error('删除失败，原因：' + resp.msg)
        })
      })
    },
    initShopList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, {isOnline: 0}).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindList = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
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
        _this.$notify.error('查询失败,' + resp.msg)
      })
    },
    onRedactFun (row) { // 编辑和新增功能
      this.row = row
      if (row) {
        this.title = '编辑员工信息'
        this.guideValue = row.job
        this.subordinateStores = []
        this.subordinateStores = row.shop_ids.split(',')
        this.model.sgGuide = {
          id: row.id,
          name: row.name,
          nickname: row.nickname,
          sex: row.sex,
          mobile: row.mobile,
          birthday: row.birthday === null ? null : new Date(row.birthday),
          work_number: row.work_number,
          image: row.image,
          work_prefix: row.work_prefix
        }
        this.model.sgGuideShop = {
          id: row.gsId,
          job: row.job,
          shop_id: row.shop_id
        }
        this.model.updateAllGuidePrefix = 0
        this.showUpdateAllGuidePrefix = false
        this.dialogFormVisible = true
      } else {
        this.title = '新增员工'
        this.guideValue = 0
        let that = this
        this.subordinateStores = []
        that.$http.fetch(this.$api.guide.guide.findGuideNewWorkNumAndPrefix, {}
        ).then(resp => {
          this.model.sgGuide = {
            id: this.newAdd.id,
            name: this.newAdd.name,
            nickname: this.newAdd.nickname,
            sex: this.newAdd.sex,
            mobile: this.newAdd.mobile,
            birthday: this.newAdd.birthday === null ? null : new Date(row.birthday),
            image: this.newAdd.image,
            work_prefix: resp.result.workPrefix,
            work_number: resp.result.workNumber
          }
          this.model.sgGuideShop = {
            id: this.newAdd.gsId,
            job: this.newAdd.job,
            shop_id: this.newAdd.shop_id
          }
          this.model.updateAllGuidePrefix = 0
          this.showUpdateAllGuidePrefix = false
          this.dialogFormVisible = true
        }).catch((err) => {
          that.$notify.error('查询失败:' + err.msg)
        })
      }
    },
    onSave (model) {
      let _this = this
      let guide = this.model.sgGuide
      let guideShop = []
      guideShop.push(this.model.sgGuideShop)
      let sgGuideVo = {}
      let allImageUrl = null
      let updateAllGuidePrefix = this.model.sgGuideShop.updateAllGuidePrefix
      if (model.sgGuideShop.job === 1 && this.title === '编辑员工信息') {
        this.$http.fetch(this.$api.guide.guide.findGuideShopCustomerSum, {
          guideId: model.sgGuideShop.id,
          shopIds: this.subordinateStores.join(',')
        }).then(resp => {
          if (resp.result.result.sum > 0) {
            _this.memberBelongingtitle = '选择会员归属'
            _this.memberBelongingShow = true
            sgGuideVo = this.model.sgGuideVo
          } else {
            _this.$refs.addForm.validate((valid) => {
              if (valid) {
                if (guide.birthday instanceof Date) {
                  guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                }
                if (guide.birthday === null) guide.birthday = ''
                if (guide.work_num === null) guide.work_num = ''
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
                  _this.$notify.error('保存失败：' + resp.msg)
                })
              }
            })
          }
        }).catch((resp) => {
          _this.$notify.error('请求失败：' + resp.msg)
        })
      } else {
        if (this.title === '新增员工' && model.sgGuideShop.job === 1) {
          this.subordinateStores.map((item, i) => {
            guideShop[i] = Object.assign({job: 1, shop_id: item}, guideShop[i])
          })
          guideShop.shift()
          _this.$refs.addForm.validate(valid => {
            if (valid) {
              if (guide.birthday instanceof Date) {
                guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
              }
              if (guide.birthday === null) guide.birthday = ''
              if (guide.work_num === null) guide.work_num = ''
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
                _this.$notify.error('保存失败：' + resp.msg)
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
    // 查询导购列表
    findGuideList () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.findList, {
        searchMap: {
          'guideState': 1,
          'guideId': _this.guideId,
          'status': 1
        },
        length: 10000
      }).then(resp => {
        if (resp.success && resp.result.data != null) {
          _this.guideList = resp.result.data
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
     // 会员离职
    dimissionFun (row) {
      var _this = this
      _this.transferWay = '1'
      _this.$confirm('请确认是否对 ' + row.name + ' 进行离职操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$http.fetch(_this.$api.guide.guide.getCustomerCount, {
          searchMap: {
            'guideId': row.id,
            'shopId': row.shop_id
          }
        }).then(resp => {
          if (resp.result.recordsFiltered > 0) {
            _this.guideId = row.id
            _this.shopId = row.shop_id
            _this.customerTotal = resp.result.recordsFiltered
            _this.resignFormVisible = true
          } else {
            var params = {
              transGuideId: row.id,
              transStatus: 0
            }
            _this.guideLeave(params, false)
          }
        }).catch((resp) => {
          // _this.$notify.error('查询失败：' + resp.msg)
        })
      })
    },
    onConfirmResign () {
      var _this = this
      var status = _this.transferWay
      _this.resignFormVisible = false
      if (status === '1') {
        _this.averageTransfer()
      } else if (status === '2') {
        _this.findGuideList()
        _this.specifyTransferFormVisible = true
      } else if (status === '3') {
        _this.findCustomerList()
        _this.findGuideList()
        _this.customFormVisible = true
      }
    },
    // 平均转移
    averageTransfer () {
      var _this = this
      _this.$confirm('请确认是否对导购客户进行平均转移操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          transGuideId: _this.guideId,
          transStatus: 1,
          resource: 0
        }
        _this.guideLeave(params, false)
      })
    },
    // 取消指定转移
    onCancelSpecifyTransfer () {
      var _this = this
      _this.specifyTransferFormVisible = false
      _this.receiveGuideId = null
    },
    // 保存指定导购转移
    onSaveSpecifyTransfer () {
      var _this = this
      if (_this.receiveGuideId === null || _this.receiveGuideId === 0) {
        _this.$notify.error('请选择指定导购')
        return
      }
      var params = {
        transGuideId: _this.guideId,
        receiveGuideId: _this.receiveGuideId,
        transStatus: 2,  // 对应后台枚举
        resource: 0  // 对应后台枚举
      }
      _this.guideLeave(params, false)
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
    // 保存自定义转移客户
    onSaveCustomTransfer () {
      var _this = this
      var isLeave = false
      if (_this.allPageCustomer.length > 0) {
        if (_this.allPageCustomer.length === _this.paginations.total) {
          isLeave = true
        }
        for (let index = 0; index < _this.allPageCustomer.length; index++) {
          if (index === 0) {
            _this.customerIds = _this.allPageCustomer[index].customerId
          } else {
            _this.customerIds += ',' + _this.allPageCustomer[index].customerId
          }
        }
      } else {
        _this.$notify.error('请选择转移的客户')
        return
      }

      if (_this.receiveGuideId === null || _this.receiveGuideId === '') {
        _this.$notify.error('请选择转移的导购')
        return
      }
      var params = {
        customerIds: _this.customerIds,
        receiveGuideId: _this.receiveGuideId,
        transGuideId: _this.guideId,
        transStatus: 3,   // 对应后台枚举
        resource: 0,      // 对应后台枚举
        isLeave: isLeave
      }
      _this.guideLeave(params, isLeave)
    },
    // 导购离职
    guideLeave (data, isClose) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.updateGuideCustomer, data)
      .then(resp => {
        _this.paginations = {
          enable: true,
          size: 10,
          sizeOpts: [5, 10, 15],
          page: 1,
          total: 0
        }
        _this.receiveGuideId = null
        _this.customerIds = null
        _this.guideId = null
        _this.specifyTransferFormVisible = false
        _this.customFormVisible = false
        if (!isClose) {
          _this.$refs.table.$reload()
        }
        _this.$notify.success('操作成功')
      }).catch((resp) => {
        _this.$notify.error('操作成功 ' + resp.msg)
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
    var _this = this
    console.log(this.$store)
    _this.initShopList()
  }
}
