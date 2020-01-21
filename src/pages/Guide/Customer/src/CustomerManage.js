import api from '@/config/http'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
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
    let integralPagination = {
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
      dontSave: false,
      title: '导购更换列表',
      dialogFormVisible: false,
      allPageCustomer: [], // 选择的所有的客户
      thisPageCustomer: [], // 当前页面全选的客户
      pageChange: true, // 当前页数
      guideId: null, //  当前导购的id
      shopId: null,
      offLineShopId: 0,
      successCount: null,
      failCount: null,
      receiveGuideId: null, //  接收的导购id
      customerTotal: null,
      row: null,
      guideList: [],
      shopList: [],
      shopFindList: [],
      guideShopList: [],
      tableDataCustomer: [], // 客户集合
      multipleSelection: [],
      multipleSelections: [], // 客户详情数组
      customerIdList: [],
      kehushow: false,
      pagination: pagination,
      integralPagination: integralPagination,
      integralTotal: 0,
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
      showTag: false,
      tagData: [], // 所有表情值
      selectTagData: [], // 会员选中属性值
      integralIsShow: [false, false, false, false, false], // 控制会员详情积分是否显示
      integralIsNum: [0, 0, 0, 0, 0], // 控制会员详情积分
      integralName: ['', '', '', '', ''], // 控制会员详情积分
      integralAliasName: ['', '', '', '', ''], // 积分别名
      mapTag: [],
      sameSystemShopId: null, // 门店ID,用于更换会员导购弹窗查询同体系门店的参数
      textIds: [], // 会员打标签输入框id集合
      selectIds: [], // 会员打标签下拉选id集合
      dateIds: [], // 会员打标签日期id集合
      checkboxIds: [], // 会员打标签复选框id集合
      radioIds: [], // 会员打标签单选框id集合
      checkboxList: [], // 标签页复选框绑定值
      checkboxObject: {}, // 标签页复选框绑定值
      attribute: 0, // 标签属性
      attributeValue: 0, // 标签属性值
      sysCustomerId: '', // 会员id
      shopKuhuShow: false,
      rfmInfo: {}, // rfm信息
      accountCode: {}, // 用于保存积分账号
      result: null,
      _queryConfig: { expand: false },
      // 弹窗假数据
      selectedTabName: 'basic',
      dialogVisible: false,
      value1: '',
      value2: '',
      remark: '备注备注备',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      value3: '',
      startDateTime: null,
      endDateTime: null,
      defaultImage: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      startTime: null,
      endTime: null,
      tableData: [],
      searchParam: {}, // 积分查询条件
      integralAccountArr: [],
      currentIndex: '',
      integralLogIsShow: [false, false, false, false, false]
    }
  },
  mixins: [tableMixin],
  methods: {
    getCurrentRow (row, index) { // 单选按钮
      this.radio = index
      this.value = row
    },
    handleClick (tab, event) {
      // 假如切换到积分tab
      if (tab.label.indexOf('基础信息') === -1 && tab.label.indexOf('交易信息') === -1) {
        this.restParams()
        let tabName = tab.label
        this.currentIndex = tab.label
        let accountCode = this.accountCode[tab.label]
        this.searchParam.accountCode = accountCode
        this.searchParam.nick = this.items.customerId
        this.searchParam.length = this.integralPagination.size
        this.searchParam.pageNo = this.integralPagination.page
        this.getIntegralList(tabName)
      } else if (tab.label.indexOf('交易') > -1) {
        this.getCustomerRfmInfo(this.items.customerId, this.items.sgShopId === 0 ? this.items.shopId : this.items.sgShopId)
      }
    },
    getIntegralList (tabName) { // 查询会员积分
      this.$http.fetch(this.$api.guide.guide.queryCustomerIntegral, this.searchParam
      ).then(resp => {
        this.integralPagination.total = parseInt(resp.result.total)
        this.$set(this.tableData, tabName, resp.result.data)
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 积分搜索
    seachIntegral (index) {
      let startTime = this.startTime
      let endTime = this.endTime
      if ((!startTime && endTime) || (startTime && !endTime)) {
        this.$notify.error('开始时间和结束时间都要选择')
        return
      }
      if (startTime > endTime) {
        this.$notify.error('开始时间必须小于结束时间')
        return
      }
      this.searchParam.startTime = startTime
      this.searchParam.endTime = endTime
      this.getIntegralList(this.integralName[index])
    },
    // 积分分页-页数改变
    integralPageChange (page) {
      this.searchParam.pageNo = page
      this.getIntegralList(this.currentIndex)
    },
    // 积分分页-大小改变
    integralSizeChange (pageSize) {
      this.searchParam.length = pageSize
      this.searchParam.pageNo = 1
      this.getIntegralList(this.currentIndex)
    },
    // 开始时间清除处理
    disposeStartTime (value) {
      if (!value) {
        this.startTime = null
      }
    },
    // 结束时间清除处理
    disposeEndTime (value) {
      if (!value) {
        this.endTime = null
      }
    },
    // 初始化参数
    restParams () {
      this.searchParam = {}
      this.startTime = null
      this.endTime = null
    },
    // 关闭会员详情弹窗
    closeDetailDialog () {
      if (this.shopKuhuShow) {
        this.shopKuhuShow = false
        this.selectedTabName = 'basic'
        this.startTime = null
        this.endTime = null
        this.accountCode = {}
        this.searchParam = {}
        this.integralIsShow = [false, false, false, false, false]
        this.integralIsNum = [0, 0, 0, 0, 0] // 控制会员详情积分
        this.integralName = ['', '', '', '', '']
        this.integralAliasName = ['', '', '', '', '']
        // 重置tabs 分页组件size大小
        for (let i = 1; i <= this.integralLogIsShow.length; i++) {
          if (this.integralLogIsShow[i - 1]) {
            let name = 'integralPage' + i
            this.$refs[name].internalPageSize = 15
          }
        }
      }
    },
    getCustomerRfmInfo (customerId, shopId) { // 查询会员Rfm信息
      this.$http.fetch(this.$api.guide.guide.queryCustomerRfmInfo, {
        customerId: customerId,
        shopId: shopId
      }).then(resp => {
        this.rfmInfo = resp.result
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    searchAction (model) { // 搜索
      this.pagination.page = 1
      this.guideFindList(model)
    },
    resetInputAction () { // 重置
      this.model.name = null
      this.model.shop = null
      this.pagination.page = 1
      this.pagination.size = 15
      this.guideFindList()
    },
    // async findBrandShopList (model) { // 门店列表查询
    //   let that = this
    //   await this.$http
    //     .fetch(that.$api.guide.shop.findBrandShopList, { isOnline: 0, sameSystemShopId: model.sameSystemShopId })
    //     .then(resp => {
    //       that.shopList = [...resp.result]
    //     })
    //     .catch(resp => {
    //       this.$notify.error(getErrorMsg('查询失败', resp))
    //     })
    // },
    async guideFindList (model) { // 导购列表查询
      let that = this
      let numbers = /^[1-9]+[0-9]*]*$/
      let obj = {
        length: that._data.pagination.size,
        searchMap: {
          shopId: Number.parseInt(that.model.shop),
          keyword: that.model.name,
          sameSystemShopId: that.sameSystemShopId
        },
        start: 0
      }
      if (model !== undefined && typeof model === 'object') {
        obj.searchMap.keyword = model.name
        if (model.shop) {
          obj.searchMap.shopId = parseInt(model.shop)
          obj.searchMap.sameSystemShopId = null
        } else {
          obj.searchMap.sameSystemShopId = model.sameSystemShopId ? parseInt(model.sameSystemShopId) : that.sameSystemShopId
        }
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
        }).catch(resp => {})
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
        length: this._data.pagination.size,
        searchMap: {
          shopId: that.model.shop,
          keyword: that.model.name,
          sameSystemShopId: that.sameSystemShopId
        },
        start: (page - 1) * this._data.pagination.size
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
        })
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
    // 会员详情展示
    onRedactFun (val, offLineShopId) {
      let _this = this
      if (val === undefined) {
        if (this.multipleSelection.length > 0) {
          _this.title = '导购更换列表'
          _this.shopFindListShow = true
          let shopId = this.sameSystemShopId
          _this.guideFindList({ sameSystemShopId: shopId })
          // _this.findBrandShopList({ sameSystemShopId: shopId })
        } else {
          _this.$notify.error('请选择要更换导购的会员')
        }
      } else {
        _this.title = '会员详情'
        _this.$http.fetch(_this.$api.guide.guide.customerGetDetail, {
          sysCustomerId: val.sysCustomerId,
          guideId: Number(val.guideId),
          shopId: offLineShopId
        }).then(resp => {
          if (resp.success && resp.result != null) {
            _this.shopKuhuShow = true
            _this.items = resp.result

            if (_this.items.integralAccountList) {
              let length = _this.items.integralAccountList.length
              for (let i = 0; i < length; i++) {
                _this.integralLogIsShow[i] = true
                // 积分名称
                this.integralName[i] = _this.items.integralAccountList[i].integralName
                this.integralAliasName[i] = _this.items.integralAccountList[i].integralAlias
                // 积分显示
                this.integralIsShow[i] = true
                this.accountCode[this.integralName[i]] = _this.items.integralAccountList[i].integralAccount
              }
              _this.integralAccountArr.push(_this.items.integralAccountList)
            }
            if (_this.items.assetJson) {
              let assetJson = JSON.parse(_this.items.assetJson)
              let length = _this.items.integralAccountList.length
              for (let name in assetJson) {
                for (let i = 0; i < length; i++) {
                  // 积分别名
                  let accountCode = _this.items.integralAccountList[i].integralAccount
                  if (accountCode.indexOf(name) > -1) {
                    this.integralIsNum[i] = assetJson[name]
                  }
                }
              }
            }
            _this.items.province = _this.disposeArea(_this.items.province, _this.items.city)
            _this.items.customerName = _this.disposeOutNick(_this.items.customerName, _this.items.outAlias)
          }
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })
        // 积分暂时无法查询，先注释 20190911
        // _this.$http.fetch(_this.$api.guide.guide.customerQueryValidPoint, {
        //   nick: val.nick,
        //   nickType: val.nickType,
        //   customerFrom: val.customerFrom
        // }).then(resp => {
        //   _this.result = resp.result
        // }).catch((resp) => {
        //   _this.$notify.error(getErrorMsg('查询失败', resp))
        // })
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
    // 显示启用的标签
    showTagData (row, offLineShopId) {
      this.showTag = true
      this.sysCustomerId = row.sysCustomerId
      this.offLineShopId = offLineShopId
      this.$http.fetch(this.$api.guide.guide.queryAllTag, {
        'shopId': row.sgExclusiveShopId !== 0 ? row.sgExclusiveShopId : offLineShopId,
        'sysCustomerId': row.sysCustomerId
      }).then(resp => {
        if (resp.success && resp.result != null) {
          // 已启用的会员标签数据
          this.tagData = resp.result.allPropertyInfo
          // 客户已打标的数据
          this.selectTagData = resp.result.propertyInfo
          this.attribute = this.selectTagData.length
          for (let i = 0; i < this.tagData.length; i++) {
            let tag = this.tagData[i]
            if (tag.isMark === 1) {
              tag.isMark = false
            } else {
              tag.isMark = true
            }
            // 处理复选框默认值
            if (tag.tagType === 7) {
              this.$set(this.tagData[i], 'selectValue', [])
            }
            // 选中的值赋值
            for (let j = 0; j < this.selectTagData.length; j++) {
              if (this.selectTagData[j].id === tag.id) {
                let tagInfo = {}
                tagInfo.id = tag.id
                tagInfo.tagType = tag.tagType
                // 0表示文本框，1表示下拉选择，2表示日期 ， 3 : 单选框 4 ： 复选框
                // 新：1：字符文本框 2：数字文本框 3：小数文本框 4:  选择框 5：日期框 6：单选框 7：复选框',
                switch (tag.tagType) {
                  case 1:
                  case 2:
                  case 3:
                    this.textIds.push(tag.id)
                    this.attributeValue += 1
                    tagInfo.value = this.selectTagData[j].value
                    this.$set(this.tagData[i], 'selectValue', this.selectTagData[j].value)
                    break
                  case 4:
                    this.selectIds.push(tag.id)
                    this.attributeValue += 1
                    tagInfo.value = this.selectTagData[j].value
                    this.$set(this.tagData[i], 'selectValue', this.selectTagData[j].value)
                    break
                  case 5:
                    this.dateIds.push(tag.id)
                    this.attributeValue += 1
                    tagInfo.value = this.selectTagData[j].value
                    this.$set(this.tagData[i], 'selectValue', this.selectTagData[j].value)
                    break
                  case 6:
                    this.radioIds.push(tag.id)
                    this.attributeValue += 1
                    tagInfo.value = this.selectTagData[j].value
                    this.$set(this.tagData[i], 'selectValue', this.selectTagData[j].value)
                    break
                  case 7:
                    if (this.selectTagData[j].value) {
                      let valueArr = this.selectTagData[j].value.split('|')
                      this.attributeValue += valueArr.length
                      tagInfo.value = valueArr
                      this.$set(this.tagData[i], 'selectValue', valueArr)
                    }
                    this.checkboxIds.push(tag.id)
                    break
                  default:
                    break
                }
                this.mapTag.push(tagInfo)
              }
            }
          }
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('查询失败', resp))
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
      this.radio = null
      this.model.name = null
      this.model.shop = null
      this.pagination.page = 1
      this.pagination.size = 15
    },
    getOffLineShopId (data) {
      this.sameSystemShopId = data
    },
    addText (row) {
      if (row.selectValue) {
        if (row.tagType === 2) {
          let pattern = /^-?[0-9]\d*$/
          if (Number.isNaN(Number(row.selectValue)) || !pattern.test(Number.parseFloat(row.selectValue))) {
            this.$notify.error('请输入整数')
            row.selectValue = null
            setTimeout(() => { this.dontSave = false }, 1000)
          }
        } else if (row.tagType === 3) {
          let pattern = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$|^-?[0-9]\d*$/
          if (Number.isNaN(Number(row.selectValue)) || !pattern.test(Number.parseFloat(row.selectValue))) {
            this.$notify.error('请输入小数')
            row.selectValue = null
            setTimeout(() => { this.dontSave = false }, 1000)
          }
        }
      }

      let num = this.textIds.indexOf(row.id)
      if (num > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            if (!row.selectValue || row.selectValue.trim().length === 0) {
              // 判断是否为空
              // this.mapTag.splice(i, 1)
              // this.textIds.splice(num, 1)
              check.value = null
              this.attribute -= 1
              this.attributeValue -= 1
            } else {
              this.addAttribute(check)
              check.value = row.selectValue
            }
          }
        }
      } else {
        if (row.selectValue && row.selectValue.trim().length !== 0) {
          this.textIds.push(row.id)
          let check = {
            id: row.id,
            value: row.selectValue,
            tagType: row.tagType
          }
          this.mapTag.push(check)
          this.attribute += 1
          this.attributeValue += 1
        }
      }
      setTimeout(() => { this.dontSave = false }, 1000)
    },
    focusChange () {
      setTimeout(() => { this.dontSave = true }, 500)
    },
    blurChange () {
      setTimeout(() => { this.dontSave = false }, 500)
    },
    // 下拉选处理
    addSelect (row) {
      let num = this.selectIds.indexOf(row.id)
      if (num > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            this.addAttribute(check)
            if (row.selectValue) {
              check.value = row.selectValue
            } else {
              check.value = null
              this.attribute -= 1
              this.attributeValue -= 1
            }
          }
        }
      } else {
        this.selectIds.push(row.id)
        let check = {
          id: row.id,
          value: row.selectValue,
          tagType: row.tagType
        }
        this.mapTag.push(check)
        this.attribute += 1
        this.attributeValue += 1
      }
    },
    // 日期处理逻辑
    addDate (row) {
      let num = this.dateIds.indexOf(row.id)
      if (num > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) { // 假如选中数据已包含在数组中
            if (row.selectValue) {
              this.addAttribute(check)
              check.value = row.selectValue
            } else {
              // this.mapTag.splice(i, 1)
              // this.dateIds.splice(num, 1)
              check.value = null
              this.attribute -= 1
              this.attributeValue -= 1
            }
          }
        }
      } else {
        this.dateIds.push(row.id)
        let check = {
          id: row.id,
          value: row.selectValue,
          tagType: row.tagType
        }
        this.mapTag.push(check)
        this.attribute += 1
        this.attributeValue += 1
      }
    },
    // 单选框处理逻辑
    addRadio (row, item) {
      let num = this.radioIds.indexOf(row.id)
      if (num > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) { // 假如选中数据已包含在数组中
            this.addAttribute(check)
            check.value = item
          }
        }
      } else {
        this.radioIds.push(row.id)
        let check = {
          id: row.id,
          value: item,
          tagType: row.tagType
        }
        this.mapTag.push(check)
        this.attribute += 1
        this.attributeValue += 1
      }
    },
    // 复选框处理逻辑
    addCheckbox (row, item) {
      let num = this.checkboxIds.indexOf(row.id)
      if (num > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          // 如果选中的行id=已选的值id
          if (check.id === row.id) {
            // 如果参数中已经存在已选择的值则去除
            if (check.value.indexOf(item) > -1) {
              // 判断已选择值是否包含新值
              // 去除值
              check.value.splice(check.value.indexOf(item), 1)
              this.attributeValue -= 1
              if (check.value.length === 0) { // 没有值
                // this.mapTag.splice(i, 1)
                // this.checkboxIds.splice(num, 1)
                this.attribute -= 1
              } else {
                this.mapTag[i].value = check.value
                this.$set(row, 'selectValue', check.value)
              }
            } else {
              if (check.value.length === 0) {
                this.attribute += 1
              }
              check.value.push(item)
              this.$set(row, 'selectValue', check.value)
              this.attributeValue += 1
            }
          }
        }
      } else {
        this.checkboxIds.push(row.id)
        let check = {
          id: row.id,
          value: [item],
          tagType: row.tagType
        }
        this.mapTag.push(check)
        this.$set(row, 'selectValue', [item])
        this.attribute += 1
        this.attributeValue += 1
      }
    },
    addAttribute (object) {
      if (object.value == null) {
        this.attribute += 1
        this.attributeValue += 1
      }
    },
    saveTag () { // 保存标签
      for (let i = 0; i < this.mapTag.length; i++) {
        if (this.mapTag[i].value && this.mapTag[i].tagType === 7) {
          this.mapTag[i].value = this.mapTag[i].value.join('|')
        }
        delete this.mapTag[i].tagType
      }
      this.$http.fetch(this.$api.guide.guide.saveTag, {
        'sysCustomerId': this.sysCustomerId,
        'shopId': this.offLineShopId,
        'tagList': JSON.stringify(this.mapTag)
      }).then(resp => {
        if (resp.success && resp.result != null) {
          this.restTag(true)
          this.$notify.success('保存成功！')
        }
      }).catch((resp) => {
        this.$notify.error(getErrorMsg('保存失败', resp))
      })
    },
    // 清空标签
    restTag (closePopup) {
      for (let i = 0; i < this.tagData.length; i++) {
        // 判断标签是不是不可更改，不可更改则跳过
        if (this.tagData[i].isMark) {
          continue
        }
        if (this.tagData[i].tagType === 7) {
          // 如果选中的值则减1（防止重复点击清空选择造成过度运算）
          if (this.tagData[i].selectValue.length > 0 && !this.tagData[i].isMark) {
            this.attribute -= 1
          }
          this.$set(this.tagData[i], 'selectValue', [])
        } else {
          // 如果选中的值则减1（防止重复点击清空选择造成过度运算）
          if (this.tagData[i].selectValue != null && !this.tagData[i].isMark) {
            this.attribute -= 1
          }
          this.$set(this.tagData[i], 'selectValue', null)
        }
        // 清空已经选中的值
        for (let j = 0; j < this.mapTag.length; j++) {
          if (this.mapTag[j].id === this.tagData[i].id) {
            if (this.mapTag[j].tagType === 7) {
              this.attributeValue -= this.mapTag[j].value.length
            } else {
              this.attributeValue -= 1
            }
            this.mapTag[j].value = this.tagData[i].selectValue
          }
        }
      }
      if (this.attribute < 0) {
        this.attribute = 0
      }
      if (this.attributeValue < 0) {
        this.attributeValue = 0
      }
      if (closePopup) {
        this.radioIds = []
        this.textIds = []
        this.selectIds = []
        this.dateIds = []
        this.checkboxIds = []
        this.attribute = 0
        this.attributeValue = 0
        this.mapTag = []
        if (this.showTag) {
          this.showTag = false
        }
      }
    },
    // 更换导购
    onSave () {
      let _this = this
      let obj = {
        nick: null,
        nickType: null,
        customerFrom: null
      }
      if (_this.value !== null) {
        _this.customerIdList = []
        _this.multipleSelection.map(item => {
          let nick = {}
          obj.nick = item.outNick
          obj.platform = this.changePlatform(item.platform)
          // obj.customerFrom = Number(item.customerFrom)
          nick = Object.assign({}, obj)
          _this.customerIdList.push(nick)
        })
        this.$http.fetch(this.$api.guide.guide.updateCustomerGuide, {
          nickListJson: _this.customerIdList,
          newGuideId: Number(_this.value.id),
          shopId: Number(_this.value.shopId)
        }).then(resp => {
          _this.$notify.success('保存成功')
          _this.$refs.table1.$reload()
          _this.closeDialog()
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('保存失败', resp))
        })
      } else {
        _this.$notify.error('请选择要更换的导购！')
      }
    },
    // 将platform转化成中台需要的参数
    changePlatform (platform) {
      if (platform === 301 || platform === 302 || platform === 300) {
        return 19
      } else {
        return platform
      }
    },
    // 处理区域信息
    disposeArea (province, city) {
      let area = ''
      if (province) {
        area += province
      }
      if (city) {
        area += city
      }
      if (area.length === 0) {
        return '-'
      }
      return area
    },
    disposeOutNick (customerName, outNick) {
      if (customerName.length === 0) {
        return outNick.substring(0, 5) + '...'
      }
      return customerName
    }
  },
  mounted: function () {
  },
  computed: {}
}
