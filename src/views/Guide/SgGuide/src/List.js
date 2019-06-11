import api from '@/config/http'
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
    let paginationss = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    let customPagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
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
      updateAllGuidePrefix: 0,
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
        job: 0
      },
      sgGuideVo: {
        newShopId: null,
        type: 0
      }
    }
    let findVo = {
      'name': null,
      'shop': null,
      'job': null,
      'guideState': 1
    }
    let customFindVo = {
      'name': null,
      'shop': null,
      'mobile': null
    }
    let model = Object.assign({}, findVo, {}, searchModel)
    let rules = {
      'name': [
        { required: true, message: '请输入姓名', trigger: 'blur,change' },
        { min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change' }
      ],
      'shop': [
        {
          required: true,
          trigger: 'blur,change',
          validator: (rule, value, callback) => {
            if (this.model.sgGuideShop.shop_id === null || this.model.sgGuideShop.shop_id === '') {
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
          trigger: 'blur,change',
          validator: (rule, value, callback) => {
            if (this.subordinateStores.length === 0) {
              callback(new Error('请选择所属门店'))
            } else {
              callback()
            }
          }
        }
      ],
      'nickname': [
        { min: 0, max: 20, message: '已超过可输入长度', trigger: 'blur,change' }
      ],
      'mobile': [
        { required: true, message: '请输入手机号', trigger: 'blur,change' },
        {
          pattern: /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(16[6]{1})|(17[0]{1})|(17[6-8]{1})|(18[0-9]{1})|(19[8-9]{1}))+\d{8})$/,
          message: '手机号格式错误，请您重新输入！'
        }
      ],
      'work_id': [
        {
          required: true,
          trigger: 'blur,change',
          validator: (rule, value, callback) => {
            if (this.model.sgGuide.work_number === '' || this.model.sgGuide.work_prefix === '') {
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
      memberBelongingRadio: '1',
      brandId: null,
      replacementStoresHaveMembersShow: false, // 批量更换门店有会员弹窗
      switchStateName: null, // 批量更换门店与批量离职提示切换字段
      theNumberOfsuccessful: null, // 批量操作返回的成功的人数
      theNumberOfFailures: null, // 批量操作返回的失败的人数
      returnInformationShow: false, // 批量操作返回信息提示弹窗
      multipleStoresAreNotSupportedShow: false, // 多门店更换提示不支持员工多门店
      accordingToJudgmentShow: false,
      memberBelongingShowTow: false, // 会员归属弹窗
      dialogFormVisible: false,
      replaceTheShoppers: false, // 批量更换导购
      storeOwnershipDisplay: false,
      shopFormVisible: false, //  店铺弹窗
      resignFormVisible: false, // 导购离职弹窗
      // deleteFormVisible: false, // 删除员工弹窗
      specifyTransferFormVisible: false, // 离职-指定转移弹窗
      customFormVisible: false, // 离职-自定义转移弹窗
      allDeleteFormVisible: false, // 批量删除员工弹窗
      shopFindListShow: false, // 更换门店弹窗
      nickVoList: [], // 转移的客户数组
      allPageCustomer: [], // 选择的所有的客户
      thisPageCustomer: [], // 当前页面全选的客户
      pageChange: true, // 当前页数
      guideId: null, // 当前导购的id
      employeeDetails: null, // 员工信息详情
      transferShopSize: null, // 转移给指定导购页数改变大小
      transferShopPage: null, // 转移给指定导购页数跳转
      customShopSize: null, // 自定义页数改变大小
      customShopPage: null, // 自定义页数跳转
      shopId: null,
      shopIds: null,
      successCount: null,
      failCount: null,
      receiveGuideId: null, //  接收的导购id
      customerTotal: null,
      rules: rules,
      row: null,
      memberBelongingtitle: '',
      memberBelongingShopid: null,
      memberBelongingShow: false,
      verification: false,
      nextStep: '确定',
      sum: null, // 员工下面的会员数量
      guideShoppersList: [],
      nameArr: [], // 批量删除、批量离职、批量更换门店返回没有成功的员工的名字数组
      guideList: [],
      shopList: [],
      shopFindList: [],
      shopFindLists: [],
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
      transferName: null,
      transferShopName: null,
      transferCount: null,
      transferRadio: '1',
      memberferRadio: '2',
      replacementStoresHaveMembersRadio: '1',
      radio: null,
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
      value4: 50,
      memberBelongingList: [],
      _pagination: pagination,
      paginations: paginations,
      paginationss: paginationss,
      customPagination: customPagination,
      shopTitle: '门店更换列表',
      scopeRowCountShow: false,
      customFindVo: customFindVo,
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
    workPrefix (val) {
      this.model.sgGuide.work_prefix = val
      // eslint-disable-next-line no-console
      console.log('val:', val, this.model.sgGuide.work_prefix)
    },
    formatTooltip (val) {
      return val / 100
    },
    toTransfer () { // 批量操作前往会员管理页面按钮
      this.$router.push({
        path: '/Guide/Customer/CustomerManage'
      })
    },
    bulkReplacementStores () { // 批量更换门店
      this.multipleStoresAreNotSupportedShow = false
      this.returnInformationShow = false
    },
    getCurrentRow (row, index) { // 单选按钮
      this.radio = index
      this.value = row
    },
    updateWorkPrefix () {
      this.disabledWorkPrefix = false
      this.showUpdateAllGuidePrefix = !this.showUpdateAllGuidePrefix
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
      if (value === 0) {
        _this.model.sgGuideShop.shop_id = ''
      } else if (value === 1) {
        if (_this.title === '编辑员工信息') {
          if (_this.subordinateStores.join().indexOf(_this.model.sgGuideShop.shop_id) === -1) {
            _this.subordinateStores.push(_this.model.sgGuideShop.shop_id)
          }
        } else {
          if (_this.model.sgGuideShop.shop_id !== null && _this.model.sgGuideShop.shop_id !== '') {
            _this.subordinateStores = []
            _this.subordinateStores.push(_this.model.sgGuideShop.shop_id)
          }
        }
      }
      _this.guideValue = value
      _this.changeValue.jobsValue = value
      _this.changeObj.jobsChange = true
    },
    storeOwnership (value) {
    },
    memberBelonging (value) {
      let _this = this
      _this.model.sgGuideVo.type = value
      _this.changeValue.memberBelongingValue = value
      _this.memberBelongingRadio = value
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
    reduce (val) {},
    store (vId, row) {
      let _this = this
      let shopListArr = []
      this.shopFindList.map((item, i) => {
        if (vId.indexOf(item.id) !== -1) {
          shopListArr.push(item)
        }
      })
      this.memberBelongingList = shopListArr
      _this.changeValue.storeValue = vId
      if (this.memberBelongingList.length > 0) {
        _this.memberBelongingShopid = this.memberBelongingList[0].id
      }
      _this.shopIds = vId
      _this.changeObj.storeChange = true
      _this.replaceStoresArry.push(row)
    },
    changeShop (shopId) {
      this.shopIds = shopId
    },
    changeMemberBelonging (value) {
      this.model.sgGuideVo.newShopId = value
      this.memberBelongingShopid = value
      this.model.sgGuideVo.type = 1
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
    memberBelongingEnsure (model) { // 门店更换保存功能
      let _this = this
      let guide = this.model.sgGuide
      let guideShop = []
      _this.model.sgGuideVo.type = Number(_this.memberBelongingRadio)
      let sgGuideVo = _this.model.sgGuideVo
      let allImageUrl = null
      if (_this.memberferRadio === '1') {
        _this.subordinateStores.map((item, i) => {
          sgGuideVo.newShopId = _this.memberBelongingShopid
        })
      } else {
        if (_this.guideValue === 0) {
          guideShop[0] = { job: _this.guideValue, shop_id: model.sgGuideShop.shop_id }
        } else {
          _this.subordinateStores.map((item, i) => {
            guideShop[i] = Object.assign({ job: model.sgGuideShop.job, shop_id: item }, guideShop[i])
          })
        }
      }
      _this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (guide.birthday instanceof Date) {
            guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
          }
          if (guide.birthday === null) {
            guide.birthday = ''
          }
          if (guide.work_num === null) {
            guide.work_num = ''
          }
          if (_this.memberBelongingRadio === '1') {
            sgGuideVo.newShopId = _this.memberBelongingShopid
          } else {
            sgGuideVo.newShopId = null
          }
          this.$http.fetch(this.$api.guide.guide.saveOrUpdateGuide, {
            sgGuide: guide,
            sgGuideShopList: guideShop,
            sgGuideVo: sgGuideVo
          }).then(resp => {
            _this.closeDialog()
            _this.$notify.success('保存成功')
            _this.memberBelongingShowTow = false
            _this.memberBelongingShow = false
            this.$refs.table.$reload()
          }).catch(resp => {
            _this.closeDialog()
            this.model.sgGuide.image = allImageUrl
            _this.$notify.error('保存失败：' + resp.msg)
          })
        }
      })
    },
    allDelete () { // 组团删除功能
      let _this = this
      _this.nameArr = []
      _this.multipleSelections = []
      _this.switchStateName = '删除'

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
              resp.result.guideNames.split(',').map((item, i) => {
                if (_this.nameArr.indexOf(resp.result.guideNames.split(',')[i]) === -1) {
                  _this.nameArr.push(item)
                } else {
                  if (item === _this.multipleSelection[_this.nameArr.indexOf(resp.result.guideNames.split(',')[i])].name) {
                    _this.nameArr[_this.nameArr.indexOf(resp.result.guideNames.split(',')[i])] = _this.multipleSelection[_this.nameArr.indexOf(resp.result.guideNames.split(',')[i])].name + '(' + _this.multipleSelection[_this.nameArr.indexOf(resp.result.guideNames.split(',')[i])].work_id + ')'
                  }
                  if (item === _this.multipleSelection[i].name) {
                    _this.nameArr[i] = _this.multipleSelection[i].name + '(' + _this.multipleSelection[i].work_id + ')'
                  }
                }
              })
              _this.nameArr = _this.nameArr.join('，')
              _this.returnInformationShow = true
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
    aaaa () {
      this.$http.fetch(this.$api.overView.exit, {})
    },
    dimission () { // 批量离职功能
      let _this = this
      _this.switchStateName = '离职'
      _this.nameArr = []
      _this.accordingToJudgmentShow = false
      var dimissionshopIdArry = []
      var dimissionIdArry = []
      _this.verification = false
      _this.allDeleteName = []
      if (_this.dimissionArry.length < 1) {
        _this.$notify.error('请选择要操作的员工')
      } else {
        _this.dimissionArry.map(item => {
          if (item.status === 2) {
            _this.accordingToJudgmentShow = true
            _this.allDeleteName.push(item.name)
          }
        })
        if (_this.accordingToJudgmentShow) {
          _this.$confirm(_this.allDeleteName.join('、') + ' 已是离职状态、不能再次进行离职操作!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {})
        } else {
          _this.dimissionArry.map(item => {
            if (item.count > 1) {
              _this.verification = true
            } else {
              _this.allDeleteName.push(item.name)
            }
          })
          if (!_this.verification) {
            _this.$confirm('请确认是否对 ' + _this.allDeleteName.join('、') + ' 进行离职操作!', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _this.dimissionArry.map(item => {
                dimissionIdArry.push(item.id)
                dimissionshopIdArry.push(item.shop_id)
              })
              _this.$http.fetch(_this.$api.guide.guide.guideLeave, {
                guideIds: dimissionIdArry.join(',')
              }).then(resp => {
                if (resp.result.failCount > 0) {
                  _this.theNumberOfsuccessful = resp.result.successCount
                  _this.theNumberOfFailures = resp.result.failCount
                  resp.result.guideNames.split(',').map((item, i) => {
                    if (_this.nameArr.indexOf(resp.result.guideNames.split(',')[i]) === -1) {
                      _this.nameArr.push(item)
                    } else {
                      if (item === _this.multipleSelection[i].name) {
                        _this.nameArr[i] = _this.multipleSelection[i].name + '(' + _this.multipleSelection[i].work_id + ')'
                      }
                    }
                  })
                  _this.nameArr = _this.nameArr.join('，')
                  _this.returnInformationShow = true
                  // _this.$notify.error(resp.result.msg)
                  _this.successCount = resp.result.successCount
                  _this.failCount = resp.result.failCount
                } else {
                  _this.$notify.success('批量离职成功')
                  _this.$refs.table.$reload()
                }
              }).catch((resp) => {
                _this.$notify.error('批量离职失败：' + resp.msg)
              })
            })
          } else {
            _this.multipleStoresAreNotSupportedShow = true
          }
        }
      }
    },
    showShop () { // 组团进行更换门店操作
      let _this = this
      _this.switchStateName = '更换门店'
      _this.verification = false
      _this.allDeleteName = []
      _this.accordingToJudgmentShow = false
      if (_this.replaceStoresArry.length < 1) {
        _this.$notify.error('请选择要操作的员工')
      } else {
        _this.dimissionArry.map(item => {
          if (item.status === 2) {
            _this.accordingToJudgmentShow = true
            _this.allDeleteName.push(item.name)
          }
        })
        if (_this.accordingToJudgmentShow) {
          _this.$confirm(' 离职的员工，不允许更换门店操作!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {})
        } else {
          _this.dimissionArry.map(item => {
            if (item.count > 1) {
              _this.verification = true
            } else {
              _this.allDeleteName.push(item.name)
            }
          })
          if (!_this.verification) {
            _this.$confirm('请确认是否对 ' + _this.allDeleteName.join('、') + ' 进行更换门店操作!', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _this.model.sgGuideShop.shop_id = null
              _this.shopFindListShow = true
              _this.allDeleteName = []
              _this.replaceStoresArry.map(item => {
                _this.allDeleteName.push(item.name)
              })
            })
          } else {
            _this.multipleStoresAreNotSupportedShow = true
          }
        }
      }
    },
    async updateShopId () { // 查询导购下的会员数量
      let _this = this
      let dimissionIdArry = []
      _this.nameArr = []
      _this.replaceStoresArry.map(item => {
        dimissionIdArry.push(item.id)
      })
      await _this.$http.fetch(_this.$api.guide.guide.updateShopId, {
        guideIds: dimissionIdArry.join(','),
        shopId: Number(this.shopIds),
        type: _this.replacementStoresHaveMembersShow ? Number(_this.replacementStoresHaveMembersRadio) : ''
      }).then(resp => {
        if (resp.result.failCount > 0) {
          _this.theNumberOfsuccessful = resp.result.successCount
          _this.theNumberOfFailures = resp.result.failCount
          resp.result.guideNames.split(',').map((item, i) => {
            if (_this.nameArr.indexOf(resp.result.guideNames.split(',')[i]) === -1) {
              _this.nameArr.push(item)
            } else {
              if (item === _this.multipleSelection[i].name) {
                _this.nameArr[i] = _this.multipleSelection[i].name + '(' + _this.multipleSelection[i].work_id + ')'
              }
            }
          })
          _this.nameArr = _this.nameArr.join('，')
          _this.returnInformationShow = true
          // _this.$notify.error(resp.result.msg)
          _this.successCount = resp.result.successCount
          _this.failCount = resp.result.failCount
        } else {
          _this.shopFindListShow = false
          _this.replacementStoresHaveMembersShow = false
          _this.$notify.success('批量更换门店成功')
          _this.$refs.table.$reload()
        }
      }).catch((resp) => {
        _this.$notify.error('批量更换门店失败：' + resp.msg)
      })
    },
    selectStoreButton () { //  选择门店按钮
      this.updateShopId()
    },
    replaceStores () { // 组团更换门店功能
      let _this = this
      let dimissionIdArry = []
      if (_this.model.sgGuideShop.shop_id !== null) {
        _this.replaceStoresArry.map(item => {
          dimissionIdArry.push(item.id)
        })
        _this.$http.fetch(_this.$api.guide.guide.findGuideCustomerSum, {
          guideIds: dimissionIdArry.join(',')
        }).then(resp => {
          if (resp.result.sum > 0) {
            _this.replacementStoresHaveMembersShow = true
          } else {
            _this.updateShopId()
          }
        }).catch(() => {
          _this.$notify.error('查询失败')
        })
      } else {
        _this.$notify.error('请选择要更换的门店！')
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
      this.memberBelongingtitle = '查看（' + data.name + '）所属门店详情'
      var _this = this
      _this.$http.fetch(_this.$api.guide.guide.findGuideShopList, { guideId: data.id }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopFindLists = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    onDelsTipFun (row) { // 删除操作
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
            _this.allDeleteFormVisible = true
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
      _this.$http.fetch(_this.$api.guide.shop.findBrandShopList, { isOnline: 0 }).then(resp => {
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
    onRedactFun (row) { // 修改和新增功能
      this.row = row
      if (row) {
        this.title = '编辑员工信息'
        this.guideValue = row.job
        this.subordinateStores = []
        this.subordinateStores = row.shop_ids.split(',')
        this.nextStep = '确定'
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
        this.model.sgGuideVo = {
          newShopId: row.shop_id
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
          // eslint-disable-next-line no-console
          console.log('work_prefix:', this.model.sgGuide.work_prefix)
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
    async getCustomerCount (guideId) { // 查询导购下的会员数量
      let _this = this
      let b
      await _this.$http.fetch(_this.$api.guide.guide.getCustomerCount, {
        searchMap: {
          'guideId': guideId
        }
      }).then(resp => {
        b = resp.result.recordsFiltered
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
      return b
    },
    async findGuideShopCustomerSum (guideId, shopId, model) { // 批量查询导购下的会员数量
      let _this = this
      let a
      await _this.$http.fetch(this.$api.guide.guide.findGuideShopCustomerSum, {
        guideId: guideId,
        shopIds: shopId
      }).then(resp => {
        a = resp.result.result.sum
      }).catch((resp) => {
        _this.$notify.error('请求失败：' + resp.msg)
      })
      return a
    },
    async saveOrUpdateGuide (guide, guideShop, sgGuideVo) { // 新增或编辑保存
      let _this = this
      let updateAllGuidePrefix = this.model.updateAllGuidePrefix
      let allImageUrl = null
      await this.$http.fetch(this.$api.guide.guide.saveOrUpdateGuide, {
        sgGuide: guide,
        sgGuideShopList: guideShop,
        sgGuideVo: sgGuideVo,
        updateAllGuidePrefix: updateAllGuidePrefix
      }).then(resp => {
        _this.closeDialog()
        _this.$notify.success('保存成功')
        this.$refs.table.$reload()
      }).catch((resp) => {
        // _this.closeDialog()
        this.model.sgGuide.image = allImageUrl
        _this.$notify.error('保存失败：' + resp.msg)
      })
    },
    onSave (model) {
      let _this = this
      // eslint-disable-next-line no-console
      console.log('_this.$refs.addForm:', _this.model.sgGuide.work_prefix)
      _this.$refs.addForm.validate(valid => {
        // eslint-disable-next-line no-console
        console.log('valid:', valid)
        if (valid) {
          let guideShop = []
          let guide = model.sgGuide
          let sgGuideVo = {}
          let guideId = null
          let shopId = null
          let shopArr = []
          if (_this.row) {
            shopArr = _this.row.shop_ids.split(',')
            if (_this.guideValue === 1 && _this.title === '编辑员工信息') {
              if (_this.row.job === 1) {
                guideId = _this.row.id
                shopId = _this.subordinateStores.join(',')
                _this.findGuideShopCustomerSum(guideId, shopId, model).then((res) => {
                  if (res > 0) {
                    _this.memberBelongingtitle = '选择会员归属'
                    _this.memberBelongingShow = true
                  } else {
                    _this.subordinateStores.map((item, i) => {
                      guideShop[i] = Object.assign({ job: _this.guideValue, shop_id: item }, guideShop[i])
                    })
                    if (guide.birthday instanceof Date) {
                      guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                    }
                    if (_this.model.sgGuide.mobile !== '' && _this.subordinateStores.length > 0 && _this.model.sgGuide.name !== '' && _this.model.sgGuide.work_prefix !== '') {
                      _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
                    }
                  }
                })
              } else {
                if (shopArr.indexOf(_this.changeValue.storeValue) === -1) {
                  guideId = _this.row.id
                  shopId = _this.changeValue.storeValue
                  _this.getCustomerCount(shopId).then((res) => {
                    if (res > '0') {
                      _this.memberBelongingtitle = '选择会员归属'
                      _this.memberBelongingShow = true
                    } else {
                      _this.subordinateStores.map((item, i) => {
                        guideShop[i] = Object.assign({ job: _this.guideValue, shop_id: item }, guideShop[i])
                      })
                      // guideShop[0] = { job: _this.guideValue, shop_id: model.sgGuideShop.shop_id }
                      if (guide.birthday instanceof Date) {
                        guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                      }
                      if (_this.model.sgGuide.mobile !== '' && _this.model.sgGuideShop.shop_id !== null && _this.model.sgGuide.name !== '' && _this.model.sgGuide.work_prefix !== '') {
                        _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
                      }
                    }
                  })
                } else {
                  _this.subordinateStores.map((item, i) => {
                    guideShop[i] = Object.assign({ job: _this.guideValue, shop_id: item }, guideShop[i])
                  })
                  // guideShop[0] = { job: _this.guideValue, shop_id: model.sgGuideShop.shop_id }
                  if (guide.birthday instanceof Date) {
                    guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                  }
                  if (_this.model.sgGuide.mobile !== null && _this.model.sgGuideShop.shop_id !== null && _this.model.sgGuide.name !== '' && _this.model.sgGuide.work_prefix !== '') {
                    _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
                  }
                }
              }
            } else if (_this.guideValue === 0 && _this.title === '编辑员工信息') {
              if (_this.row.job === 1) {
                guideId = _this.row.id
                shopId = _this.changeValue.storeValue
                _this.findGuideShopCustomerSum(guideId, shopId, model).then((res) => {
                  if (res > 0) {
                    _this.memberBelongingtitle = '选择会员归属'
                    _this.memberBelongingShow = true
                  } else {
                    guideShop[0] = { job: _this.guideValue, shop_id: model.sgGuideShop.shop_id }
                    // _this.subordinateStores.map((item, i) => {
                    //   guideShop[i] = Object.assign({ job: _this.guideValue, shop_id: item }, guideShop[i])
                    // })
                    if (guide.birthday instanceof Date) {
                      guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                    }
                    if (_this.model.sgGuide.mobile !== '' && _this.subordinateStores.length > 0 && _this.model.sgGuide.name !== '' && _this.model.sgGuide.work_prefix !== '') {
                      _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
                    }
                  }
                })
              } else {
                if (_this.row.id === _this.changeValue.storeValue || _this.changeValue.storeValue === undefined) {
                  guideShop[0] = { job: _this.guideValue, shop_id: model.sgGuideShop.shop_id }
                  if (guide.birthday instanceof Date) {
                    guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                  }
                  if (_this.model.sgGuide.mobile !== '' && _this.model.sgGuideShop.shop_id !== null && _this.model.sgGuide.name !== '' && _this.model.sgGuide.work_prefix !== '') {
                    _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
                  }
                } else {
                  guideId = _this.row.id
                  shopId = _this.row.shop_id
                  _this.getCustomerCount(guideId).then(res => {
                    if (res > '0') {
                      _this.memberBelongingtitle = '选择会员归属'
                      _this.memberBelongingShow = true
                    } else {
                      guideShop[0] = { job: _this.guideValue, shop_id: model.sgGuideShop.shop_id }
                      if (guide.birthday instanceof Date) {
                        guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                      }
                      if (_this.model.sgGuide.mobile !== '' && _this.model.sgGuideShop.shop_id !== null && _this.model.sgGuide.name !== '' && _this.model.sgGuide.work_prefix !== '') {
                        _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
                      }
                    }
                  })
                }
              }
            }
          } else {
            if (model.sgGuideShop.job === 1 && _this.title === '新增员工') {
              this.subordinateStores.map((item, i) => {
                guideShop[i] = Object.assign({ job: _this.guideValue, shop_id: item }, guideShop[i])
              })
              _this.$refs.addForm.validate(valid => {
                if (valid) {
                  if (guide.birthday instanceof Date) {
                    guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                  }
                  if (guide.birthday === null) {
                    guide.birthday = ''
                  }
                  if (guide.work_num === null) {
                    guide.work_num = ''
                  }
                }
              })
              if (_this.model.sgGuide.mobile !== null && _this.subordinateStores.length > 0 && _this.model.sgGuide.name !== null && _this.model.sgGuide.work_prefix !== null) {
                _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
              }
            } else if (model.sgGuideShop.job === 0 && _this.title === '新增员工') {
              guideShop[0] = { job: 0, shop_id: model.sgGuideShop.shop_id }
              _this.$refs.addForm.validate(valid => {
                if (valid) {
                  if (guide.birthday instanceof Date) {
                    guide.birthday = moment(guide.birthday).format('YYYY-MM-DD')
                  }
                  if (guide.birthday === null) {
                    guide.birthday = ''
                  }
                  if (guide.work_num === null) {
                    guide.work_num = ''
                  }
                }
              })
              if (_this.model.sgGuide.mobile !== null && _this.model.sgGuideShop.shop_id !== null && _this.model.sgGuide.name !== null && _this.model.sgGuide.work_prefix !== '') {
                _this.saveOrUpdateGuide(guide, guideShop, sgGuideVo)
              }
            }
          }
          this.disabledWorkPrefix = true
        }
      })
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
    // 客户会转移类型选择
    shiftChange (val) {
      if (val === '2') {
        this.model.name = null
        this.model.shop = null
        this.model.mobile = null
        this.model.workId = null
        this.guideFindList()
      } else if (val === '3') {
        this.model.name = null
        this.model.shop = null
        this.findCustomerList()
        this.guideFindList()
      }
    },
    // 查询客户列表
    findCustomerList (page, pageSize) {
      let _this = this
      _this.$http.fetch(_this.$api.guide.guide.findCustomerList, {
        searchMap: {
          'guideId': _this.guideId,
          'pageSize': _this.customShopSize !== null ? _this.paginations.size = _this.customShopSize : _this.paginations.size,
          'pageNo': _this.customShopPage !== null ? _this.paginations.page = _this.customShopPage : _this.paginations.page,
          'mobile': _this.customFindVo.mobile,
          'name': _this.customFindVo.name,
          'shopId': _this.customFindVo.shop
        }
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.tableDataCustomer = resp.result.data
          if (_this.tableDataCustomer.length > 0) {
            _this.resignFormVisible = true
          }
          _this.customPagination.total = parseInt(resp.result.total)
          _this.paginations.total = parseInt(resp.result.total)
          _this.chooseCustomerFocus()
        }
      }).catch((resp) => {
        // _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 批量设置导购
    Setupbulksalesguide () {
      if (this.allPageCustomer.length < 1) {
        this.$notify.error('请选择转移的客户')
      } else {
        this.replaceTheShoppers = true
      }
    },
    // 转移给指定导购改变页数大小
    transferShopSizeChange (page) {
      this.transferShopSize = page
      let pageSize = 1
      this.guideFindList(page, pageSize)
    },
    // 转移给指定导购页数跳转
    transferShopPageChange (page) {
      this.transferShopPage = page
      let pageChange = 0
      this.guideFindList(page, pageChange)
    },
    // 自定义搜索改变页数大小
    customShopSizeChange (page) {
      this.customShopSize = page
      this.findCustomerList()
    },
    // 自定义搜索页数跳转
    customShopPageChange (page) {
      this.customShopPage = page
      this.findCustomerList()
    },
    // 转移给指定导购搜索
    transferSearch () {
      this.transferShopPage = 1
      this.radio = null
      this.guideFindList()
    },
    // 转移给指定导购重置
    transferToReset () {
      this.model.name = null
      this.model.shop = null
      this.radio = null
      this.transferShopPage = 1
      this.guideFindList()
    },
    // 自定义搜索
    customSearch (model) {
      this.findCustomerList(model)
    },
    // 自定义重置
    customReset () {
      this.model.name = null
      this.model.mobile = null
      this.model.workId = null
      this.model.shop = null
      this.findCustomerList()
    },
    async guideFindList (page, pages) { // 导购列表查询
      let _this = this
      if (pages === 0) { // 页数跳转
        this.transferShopPage = page
      } else if (pages === 1) { // 改变页数大小
        _this.transferShopSize = page
      }
      let obj = {
        length: _this.transferShopSize !== null ? _this.transferShopSize : 15,
        searchMap: {
          shopId: _this.model.shop,
          keyword: _this.model.name === null ? _this.model.shop === null : _this.model.name,
          noGuideId: _this.guideId
        },
        start: _this.transferShopPage !== null ? ((this.transferShopPage - 1) * 15) : 0
      }
      // debugger
      await this.$http
        .fetch(_this.$api.guide.guide.findShopGuide, obj)
        .then(resp => {
          _this.guideList = [...resp.result.data]
          _this.paginationss.total = Number(resp.result.recordsTotal)
          _this.particularsObj.map((item, i) => {
            if (item[i].id === item[i + 1].id) {
              item.splice(item[i], item[i + 1])
            }
          })
          _this.guideList = new Set(_this.guideList)
          _this.guideList = Array.from(_this.guideList)
        })
        .catch(resp => {
          // this.$notify.error(resp.msg || '查询失败')
        })
    },
    // 查询导购列表
    findGuideList (page, pages) {
      let _this = this
      if (pages === 0) { // 页数跳转
        this.transferShopPage = page
      } else if (pages === 1) { // 改变页数大小
        _this.transferShopSize = page
      }
      _this.$http.fetch(_this.$api.guide.guide.findList, {
        searchMap: {
          'guideState': 1,
          'guideId': _this.guideId,
          'status': _this.transferShopPage !== null ? (this.transferShopPage - 1 * 15) : 1,
          'name': _this.model.name,
          'shop': _this.model.shop
        },
        length: _this.transferShopSize !== null ? _this.transferShopSize : 10000
      }).then(resp => {
        if (resp.success && resp.result.data != null) {
          _this.guideShoppersList = resp.result.data
          _this.paginationss.total = parseInt(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error('查询失败：' + resp.msg)
      })
    },
    // 员工离职
    dimissionFun (row) {
      var _this = this
      _this.employeeDetails = row
      _this.transferName = row.name
      _this.transferShopName = row.shopName
      _this.transferWay = '1'
      _this.$confirm('请确认是否对 ' + row.name + ' 进行离职操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$http.fetch(_this.$api.guide.guide.getCustomerCount, {
          searchMap: {
            'guideId': row.id
          }
        }).then(resp => {
          if (resp.result.recordsFiltered > 0) {
            _this.guideId = row.id
            _this.shopId = row.shop_id
            _this.customerTotal = resp.result.recordsFiltered
            _this.transferCount = resp.result.recordsTotal
            _this.resignFormVisible = true
          } else {
            var params = {
              transGuideId: row.id,
              transStatus: 0
            }
            _this.guideLeave(params, false)
          }
        }).catch((resp) => {
          _this.$notify.error('查询失败：' + resp.msg)
        })
      })
    },
    membershipRetention (model) { // 选择会员归属保存
      this.memberBelongingEnsure(model)
    },
    onConfirmResign () {
      var _this = this
      if (_this.transferRadio === '1') {
        _this.averageTransfer()
      } else if (_this.transferRadio === '2') {
        _this.onSaveSpecifyTransfer()
      } else if (_this.transferRadio === '3') {
        _this.guideFindList()
        _this.findCustomerList()
        _this.onSaveCustomTransfer()
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
          isLeave: 0,
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
      if (this.radio === null) {
        _this.$notify.error('请选择指定导购')
        return
      }
      var params = {
        isLeave: 0,
        transGuideId: _this.guideId,
        receiveGuideId: _this.value.id,
        transStatus: 2, // 对应后台枚举
        resource: 0 // 对应后台枚举
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
      var isLeave = 0
      let obj = {
        nick: null,
        nickType: null,
        customerFrom: null
      }
      if (_this.allPageCustomer.length > 0) {
        if (_this.allPageCustomer.length === _this.paginations.total) {
          isLeave = 1
        }
        _this.nickVoList = []
        for (let index = 0; index < _this.allPageCustomer.length; index++) {
          if (index === 0) {
            obj.nick = _this.allPageCustomer[index].nick
            obj.nickType = _this.allPageCustomer[index].nickType
            obj.customerFrom = _this.allPageCustomer[index].customerFrom
            _this.nickVoList.push(obj)
          } else {
            _this.customerIds += ',' + _this.allPageCustomer[index].customerId
          }
        }
      } else {
        _this.$notify.error('请选择转移的客户')
      }
      if (_this.value === undefined) {
        _this.$notify.error('请选择转移的导购')
      } else {
        if (_this.customerTotal === _this.dimissionArry.length) {
          isLeave = 1
        }
        var params = {
          nickVoList: _this.nickVoList,
          receiveGuideId: _this.value.id,
          transGuideId: _this.guideId,
          transStatus: 3, // 对应后台枚举
          resource: 0, // 对应后台枚举
          isLeave: isLeave
        }
        _this.guideLeave(params, isLeave)
      }
    },
    // 导购会员转移
    guideLeave (data, isClose) {
      var _this = this
      _this.customFormVisible = false
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
          _this.$http.fetch(_this.$api.guide.guide.getCustomerCount, {
            searchMap: {
              'guideId': data.transGuideId
            }
          }).then(resp => {
            if (resp.result.recordsFiltered < 1) {
              _this.resignFormVisible = false
            } else {
              _this.resignFormVisible = true
              _this.transferCount = resp.result.recordsFiltered
            }
          }).catch((resp) => {
            _this.$notify.error('请先转移导购的会员')
          })
          _this.specifyTransferFormVisible = false
          _this.customFormVisible = false
          _this.replaceTheShoppers = false
          if (!isClose) {
            _this.guideFindList()
            _this.findCustomerList()
          }
          _this.$notify.success(resp.msg)
          this.$refs.mainTable.$reload()
        }).catch((resp) => {
          _this.$notify.error('操作失败： ' + resp.msg)
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
                // _this.$refs.chooseCustomer.toggleRowSelection(item)
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
      // Object.assign(this.$data.model, this.$options.data().model)
      this.$data.model = this.$options.data().model
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
    _this.initShopList()
  },
  watch: {
    subordinateStores (newValue) {
      this.storeOwnershipDisplay = !!(newValue && newValue.length > 0)
    }
  }
}
