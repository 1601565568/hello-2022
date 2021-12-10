import api from '@/config/http'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import LocalStorage from 'store/dist/store.legacy.min.js'
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
      areaId: null, // 选中的区域ID
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
      options: [],
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
      integralLogIsShow: [false, false, false, false, false],
      recordChooseList: [], // 记录勾选导购转移的数组
      checkNumberLength: 0, // 记录列表勾选会员人数
      replaceStoreShow: false,
      shopAreaTree: [],
      allShopOptions: [],
      shopOptions: [],
      activeTab: {}, // 切换tab之后保存数据，以防止第二次重新打开不请求表格数据
      viewList: null,
      transferRange: null,
      transferSuccessMsg: ''
    }
  },
  mixins: [tableMixin],
  computed: {
    viewId () {
      return this.$store.state.user.remumber.remumber_login_info.productConfig.viewId
    }
  },
  methods: {
    // 更换门店开始
    async handlereplaceShop () {
      let { checkAll, total, removeCheckList, addcheckList, shopCustomerTransferTaskStatus } = this.$refs.table1
      if (shopCustomerTransferTaskStatus && shopCustomerTransferTaskStatus.status !== 3) {
        this.$notify.error('存在执行中的会员转移任务，请稍后再试')
        return false
      }
      this.replaceStoreShow = true
      let result = await this.handleSelection(checkAll, removeCheckList, addcheckList)
      if (result) {
        this.title = '会员更换门店'
        this.checkNumberLength = this.formatCheckNumberLength(checkAll, total, removeCheckList, addcheckList)
        this.$refs.replaceStore.init()
      }
    },
    /**
     * 获取门店区域，所有门店选项
     */
    getShopAreaAndShop: function () {
      let that = this
      if (!this.sameSystemShopId) { return false }
      that.$http.fetch(that.$api.core.sysShop.getShopTree, { sameSystemShopId: this.sameSystemShopId })
        .then((resp) => {
          that.shopAreaTree = resp.result.shopAreaTree
          that.allShopOptions = resp.result.shopOptions
          that.shopOptions = resp.result.shopOptions
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    // 更换门店结束
    // getCurrentRow (row, index) { // 单选按钮
    //   this.radio = index
    //   this.value = row
    // },
    handleClick (tab, event) {
      this.activeTab = tab
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
        shopId: shopId,
        viewId: this.viewId || null
      }).then(resp => {
        this.rfmInfo = resp.result
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    async searchAction () { // 搜索
      this.pagination.page = 1
      await this.guideFindList(this.model)
      this.tableStatus()
    },
    async resetInputAction () { // 重置
      this.model.name = null
      this.model.shop = null
      this.pagination.page = 1
      this.pagination.size = 15
      await this.guideFindList()
      this.tableStatus()
    },
    // 所属门店change
    handleShoperSelectChange () {
      this.searchAction()
    },
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
      that._data._table.loadingtable = true
      await this.$http
        .fetch(that.$api.guide.guide.findShopGuide, obj)
        .then(resp => {
          that._data._table.loadingtable = false
          that.particularsObj = [...resp.result.data]
          that.pagination.total = Number(resp.result.recordsTotal)
          // that.particularsObj.map((item, i) => {
          //   if (item[i].id === item[i + 1].id) {
          //     item.splice(item[i], item[i + 1])
          //   }
          // })
          // that.shopList = new Set(that.shopList)
          // that.shopList = Array.from(that.shopList)
        }).catch(resp => { that._data._table.loadingtable = false })
    },
    // onKeyUp (e) {
    //   var key = window.event.keyCode
    //   var _this = this
    //   if (key === 13) {
    //     _this.onSave()
    //   } else if (key === 27) {
    //     _this.$confirm('内容被修改是否要保存！', '提示', {
    //       confirmButtonText: '保存',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //     })
    //   } else {
    //     _this.shopFindListShow = false
    //   }
    // },
    // 分页-页数改变
    shopPageChange (page) {
      let that = this
      that.pagination.page = page
      let obj = {
        length: this._data.pagination.size,
        searchMap: {
          shopId: that.model.shop || null,
          keyword: that.model.name,
          sameSystemShopId: that.sameSystemShopId
        },
        start: (page - 1) * this._data.pagination.size
      }
      this.$http.fetch(that.$api.guide.guide.findShopGuide, obj)
        .then(resp => {
          that.particularsObj = [...resp.result.data]
          that.pagination.total = Number(resp.result.recordsTotal)
          this.tableStatus()
        })
    },
    // 分页-大小改变
    async shopSizeChange (pageSize) {
      var _this = this
      _this.pagination.size = pageSize
      _this.pagination.page = 1
      await _this.guideFindList(pageSize)
      this.tableStatus()
    },
    // 表格显示状态
    tableStatus () {
      if (this.recordChooseList.length === 0) return false
      let _this = this
      setTimeout(() => {
        this.particularsObj.forEach(row => {
          this.recordChooseList.forEach((item) => {
            if ((row.id === item.id) && (row.shopId === item.shopId)) {
              _this.$refs.table.toggleRowSelection(row, true)
            }
          })
        })
      }, 50)
    },
    async handleSelectionChange () {
      let { checkAll, removeCheckList, addcheckList, shopCustomerTransferTaskStatus, total } = this.$refs.table1
      // 判断是否有执行的任务
      if (shopCustomerTransferTaskStatus && shopCustomerTransferTaskStatus.status !== 3) {
        this.$notify.error('存在执行中的会员转移任务，请稍后再试')
        return false
      }
      let result = await this.handleSelection(checkAll, removeCheckList, addcheckList)
      if (result) {
        this.title = '会员更换导购'
        this.checkNumberLength = this.formatCheckNumberLength(checkAll, total, removeCheckList, addcheckList)
        this.shopFindListShow = true
        this.guideFindList({ sameSystemShopId: this.sameSystemShopId })
      }
      // let { checkAll, removeCheckList, addcheckList } = this.$refs.table1
      // if (!checkAll && removeCheckList.length === 0 && addcheckList.length === 0) {
      //   this.$notify.error('请选择要更换导购的会员')
      //   return false
      // } else if (checkAll && removeCheckList.length > 500) {
      //   this.$notify.error(`已勾选${removeCheckList.length}人，超出手动勾选转移人数上限（500人）`)
      //   return false
      // } else if (!checkAll && addcheckList.length > 500) {
      //   this.$notify.error(`已勾选${addcheckList.length}人，超出手动勾选转移人数上限（500人）`)
      //   return false
      // } else {
      // }
      // this.multipleSelection = value
    },
    // 更新全部数据
    formatCheckNumberLength (checkAll, total, removeArr, addArr) {
      let removeLen = removeArr ? removeArr.length : 0
      let addLen = addArr ? addArr.length : 0
      if (checkAll && addLen === 0 && removeLen === 0) {
        return total
      } else if (!removeLen) {
        return addLen
      } else {
        return parseInt(total) - parseInt(removeLen)
      }
    },
    handleSelection (checkAll, removeCheckList, addcheckList) {
      return new Promise((resolve, reject) => {
        // let { checkAll, removeCheckList, addcheckList } = this.$refs.table1
        if (!checkAll && removeCheckList.length === 0 && addcheckList.length === 0) {
          this.$notify.error('请选择要更换导购的会员')
          resolve(false)
        } else if (checkAll && removeCheckList.length > 500) {
          this.$notify.error(`取消选择人数已超过500人，无法进行会员转移`)
          resolve(false)
        } else if (!checkAll && addcheckList.length > 500) {
          this.$notify.error(`已勾选${addcheckList.length}人，超出手动勾选转移人数上限（500人）`)
          resolve(false)
        } else {
          resolve(true)
        }
      })
    },
    handleSelectChange (selection, row) {
      this.addCheck(selection, row)
    },
    // 添加数组
    addCheck (selection, row) {
      let selectionIndex = selection.findIndex((item) => {
        return (row.id === item.id) && (row.shopId === item.shopId)
      })
      if (selectionIndex >= 0) {
        this.recordChooseList.push(row)
      } else {
        this.delAddCheck(row)
      }
    },
    // 取消勾选
    delAddCheck (row) {
      if (this.recordChooseList.length === 0) {
        return false
      }
      let removeIndex = this.recordChooseList.findIndex((item) => {
        return (row.id === item.id) && (row.shopId === item.shopId)
      })
      this.recordChooseList.splice(removeIndex, 1)
    },
    hanledSelecAllChange (value) {
      let pagedataAll = value.length === 0 // 判断是全选还是全部取消
      if (pagedataAll) {
        this.recordChooseList = this.diffArr(this.recordChooseList, this.particularsObj)
      } else {
        this.recordChooseList = this.recordChooseList.concat(this.particularsObj)
        this.recordChooseList = this.unique(this.recordChooseList)
      }
    },
    // 全选状态下，勾选全部选中
    diffArr (arr1, arr2) {
      let deffArr = arr1.filter(item =>
        !arr2.some(ele => (ele.id === item.id && ele.shopId === item.shopId))
      )
      return deffArr
    },
    // 去重
    unique (arr) {
      let newArr = JSON.parse(JSON.stringify(arr))
      if (newArr.length === 0) {
        return false
      }
      for (var i = 0; i < newArr.length; i++) {
        for (var j = i + 1; j < newArr.length; j++) {
          if ((newArr[i].id === newArr[j].id) && (newArr[i].shopId === newArr[j].shopId)) {
            newArr.splice(j, 1)
            j--
          }
        }
      }
      return newArr
    },
    // 会员详情展示
    onRedactFun (val, offLineShopId, areaId) {
      let _this = this
      _this.title = '会员详情'
      _this.$http.fetch(_this.$api.guide.guide.customerGetDetail, {
        sysCustomerId: val.sysCustomerId,
        guideId: Number(val.guideId),
        areaId: areaId,
        shopId: val.sgExclusiveShopId
      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.shopKuhuShow = true
          if (this.activeTab && this.activeTab.label) {
            this.handleClick(this.activeTab)
          }
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
          // _this.items.customerName = _this.disposeOutNick(_this.items.customerName, _this.items.outAlias)
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
    showTagData (row, offLineShopId, areaId) {
      this.showTag = true
      this.sysCustomerId = row.sysCustomerId
      this.$http.fetch(this.$api.guide.guide.queryAllTag, {
        'shopId': row.sgExclusiveShopId !== 0 ? row.sgExclusiveShopId : offLineShopId,
        'areaId': areaId,
        'sysCustomerId': row.sysCustomerId
      }).then(resp => {
        if (resp.success && resp.result != null) {
          // 打标签时.线下店铺Id = 后台传过来的id,保存标签时使用这个offlineShopId
          this.offLineShopId = row.sgExclusiveShopId

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
                  case 8:
                    this.dateIds.push(tag.id)
                    this.attributeValue += 1
                    tagInfo.value = this.selectTagData[j].value
                    this.$set(this.tagData[i], 'selectValue', this.selectTagData[j].value)
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
      // 清空选中目标导购对象
      this.value = null
      this.shopFindListShow = false
      this.radio = null
      this.model.name = null
      this.model.shop = null
      this.pagination.page = 1
      this.pagination.size = 15
      this.recordChooseList = []
    },
    getOffLineShopId (data) {
      this.sameSystemShopId = data.shopId
      this.areaId = data.areaId
      this.getShopAreaAndShop()
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
        'areaId': this.areaId,
        'list': this.mapTag
      }).then(resp => {
        if (resp.success) {
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
    replaceStoreonSave () {
      this.onSave(2)
    },
    /**
     * @param {*} taskType
     * taskType 1更换导购 2更换门店
     */
    onlyTransMember () {
      if (this.recordChooseList.length === 0) {
        this.$notify.error('请先选择更换导购')
        return
      }
      const confirmText = ['确定仅转移会员', '仅转移会员时，不会同步转移好友关系']
      const arr = []
      const h = this.$createElement
      for (const i in confirmText) {
        arr.push(h('p', null, confirmText[i]))
      }
      this.$confirm('提示信息', {
        title: '提示信息',
        message: h('div', null, arr),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.transferRange = 1
        this.transferSuccessMsg = ''
        this.onSave(1)
      }).catch(() => {
      })
    },
    transAllMember () {
      if (this.recordChooseList.length === 0) {
        this.$notify.error('请先选择更换导购')
        return
      }
      this.$refs.sendMsg.showDialog()
    },
    transClick (msg) {
      this.transferRange = 2
      this.transferSuccessMsg = msg
      this.onSave(1)
    },
    onSave (taskType) {
      var params
      if (taskType === 1 && this.recordChooseList.length === 0) {
        this.$notify.error('请先选择更换导购')
        return false
      }
      let { checkAll, removeCheckList, addcheckList } = this.$refs.table1
      let remumberLoginInfo = this.$store.state.user.remumber.remumber_login_info.productConfig.user
      let { nick, nickId } = remumberLoginInfo
      let obj = {
        viewId: this.viewId,
        outGuideIdList: this.$refs.table1.outGuideId ? [this.$refs.table1.outGuideId] : null,
        operatorName: nick, // 操作人
        operator: nickId,
        shopId: this.sameSystemShopId, // 当前门店ID
        terminalType: 1, // 终端
        taskType: 1, // 按会员转移
        checkType: checkAll ? 1 : 0, // 是否全选 0选中 1取消选中
        customerList: checkAll ? this.formateCustomerList(removeCheckList) : this.formateCustomerList(addcheckList), // 客户选中列表
        transferRange: this.transferRange,
        transferSuccessMsg: this.transferSuccessMsg
      }
      if (taskType === 1) {
        params = {
          ...obj,
          receiveShopGuideList: this.formatOutGuideIdList(this.recordChooseList)
        }
      }
      if (taskType === 2) {
        params = {
          ...obj,
          receiveShopGuideList: [{
            receiveShopId: this.$refs.replaceStore.shopId,
            receiveGuideId: 0
          }]
        }
      }
      this.createCustomerTransferTask(params, taskType)
    },
    // sgExclusiveGuideId: this.formatSgExclusiveGuideId(removeCheckList, addcheckList),
    // 格式化勾选参数数组
    formateCustomerList (arr) {
      let newArr = arr.map((item) => {
        return {
          ...item.nickInfoList[0],
          sgExclusiveGuideId: item.sgExclusiveGuideId
        }
      })
      return newArr
    },
    // 格式化导购ID
    formatOutGuideIdList (arr) {
      return arr.map((item) => {
        return {
          receiveShopId: item.shopId,
          receiveGuideId: item.id
        }
      })
    },
    // formatSgExclusiveGuideId (removeCheckList, addcheckList) {
    //   if (removeCheckList.length === 0) {
    //     return addcheckList.map((item) => {
    //       return item.sgExclusiveGuideId
    //     })
    //   } else {
    //     return removeCheckList.map((item) => {
    //       return item.sgExclusiveGuideId
    //     })
    //   }
    // },
    // 创建客户转移任务
    createCustomerTransferTask (params, taskType) {
      this.$http.fetch(this.$api.guide.shop.createCustomerTransferTask, params).then((res) => {
        if (res.success) {
          this.$refs.table1.clearRemoveStatus()
          this.shopFindListShow = false
          this.$refs.table1.$reload()
          this.$refs.remindMsg.showMsg()
          // this.$refs.table1.getShopCustomerTransferTaskStatus()
          if (taskType === 2) {
            this.replaceStoreShow = false
          }
        } else {
          this.$notify.error('会员转移失败', res.result)
        }
      }).catch((err) => {
        this.$notify.error(`会员转移失败${err.msg}`)
      })
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
  }
}
