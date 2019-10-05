import api from '@/config/http'
import tableMixin from 'web-crm/src/mixins/table'
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
      allPageCustomer: [], // 选择的所有的客户
      thisPageCustomer: [], // 当前页面全选的客户
      pageChange: true, // 当前页数
      guideId: null, //  当前导购的id
      shopId: null,
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
      tagData: [],
      integralIsShow: [false, false, false, false, false], // 控制会员详情积分是否显示
      integralIsNum: [0, 0, 0, 0, 0], // 控制会员详情积分
      integralName: ['', '', '', '', ''], // 控制会员详情积分
      mapTag: [],
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
      startTimes: [],
      endTimes: [],
      tableData: [],
      searchParam: {}, // 积分查询条件
      integralAccountArr: [],
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
        // let num = tab.label.substr(2, 1)
        // let index = num - 1
        // let accountCode = this.items.integralAccountList[num - 1].integralAccount
        let tabName = tab.label
        let accountCode = this.accountCode[tab.label]
        this.searchParam.accountCode = accountCode
        this.searchParam.nick = this.items.customerId
        this.getIntegralList(this.items.customerId, accountCode, tabName)
      } else if (tab.label.indexOf('交易') > -1) {
        this.getCustomerRfmInfo(this.items.customerId, this.items.sgShopId == 0 ? this.items.shopId : this.items.sgShopId)
      }
    },
    getIntegralList (nick, accountCode, tabName) { // 查询会员积分
      this.$http.fetch(this.$api.guide.guide.queryCustomerIntegral, this.searchParam
      ).then(resp => {
        this.$set(this.tableData, tabName, resp.result)
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    // 积分搜索
    seachIntegral () {
      let index = this.searchParam.index
      let startTime = this.startTimes[index]
      let endTime = this.endTimes[index]
      if ((!startTime && endTime) || (startTime && !endTime)) {
        this.$notify.error('开始时间和结束时间都要选择')
        return
      }
      if (startTime && endTime) {
        this.searchParam.startTime = startTime
        this.searchParam.endTime = endTime
      }
      this.getIntegralList(index)
    },
    closeDetailDialog () {
      this.selectedTabName = 'basic'
      this.startTimes = []
      this.endTimes = []
      this.accountCode = {}
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
      this.guideFindList(model)
    },
    resetInputAction () { // 重置
      this.model.name = null
      this.model.shop = null
      this.pagination.page = 1
      this.guideFindList()
    },
    async findBrandShopList (model) { // 门店列表查询
      let that = this
      await this.$http
        .fetch(that.$api.guide.shop.findBrandShopList, { isOnline: 0 })
        .then(resp => {
          that.shopList = [...resp.result]
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查询失败', resp))
        })
    },
    async guideFindList (model) { // 导购列表查询
      let that = this
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
        .catch(resp => {})
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
          keyword: that.model.name
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
          _this.guideFindList()
          _this.findBrandShopList()
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
                // this.integralName[i] = '积分' + (i + 1)
                this.integralName[i] = _this.items.integralAccountList[i].integralAlias
                this.integralIsShow[i] = true
                this.accountCode[this.integralName[i]] = _this.items.integralAccountList[i].integralAccount
              }
              _this.integralAccountArr.push(_this.items.integralAccountList)
            }
            if (_this.items.assetJson) {
              let assetJson = JSON.parse(_this.items.assetJson)
              for (let j = 0; j < assetJson.length; j++) {
                let info = assetJson[j]
                this.integralName[j] = info.alias
                this.integralIsNum[j] = info.score
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
      this.$http.fetch(this.$api.guide.guide.queryAllTag, {
        'shopId': row.sgExclusiveShopId !== 0 ? row.sgExclusiveShopId : offLineShopId,
        'sysCustomerId': row.sysCustomerId
      }).then(resp => {
        if (resp.success && resp.result != null) {
          this.tagData = resp.result.sort()
          for (let i = 0; i < this.tagData.length; i++) {
            let tag = this.tagData[i]
            if (tag.value.length > 0) {
              let tagInfo = {}
              tagInfo.id = tag.id
              tagInfo.value = tag.value
              this.mapTag.push(tagInfo)
              this.attribute += 1
              // 0表示文本框，1表示下拉选择，2表示日期 ， 3 : 单选框 4 ： 复选框
              switch (tag.tagType) {
                case 0:
                  this.textIds.push(tag.id)
                  this.attributeValue += 1
                  break
                case 1:
                  this.selectIds.push(tag.id)
                  this.attributeValue += 1
                  break
                case 2:
                  this.dateIds.push(tag.id)
                  this.attributeValue += 1
                  break
                case 3:
                  this.radioIds.push(tag.id)
                  this.attributeValue += 1
                  break
                case 4:
                  let valueArr = tag.value.split('|')
                  let num = valueArr.length
                  this.attributeValue += (num - 2)
                  this.checkboxIds.push(tag.id)
                  // 深入响应式原理，this.checkboxObject[idName] = valueArr 该赋值方法不可用
                  this.$set(this.checkboxObject, tag.id, valueArr)
                  break
                default:
                  break
              }
            } else {
              switch (tag.tagType) {
                case 4:
                  this.$set(this.checkboxObject, tag.id, [])
                  break
                default:
                  break
              }
            }
          }
          console.log('数据：' + JSON.stringify(this.mapTag))
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
      this.pagination.page = 1
      this.pagination.size = 15
    },
    addText (row) {
      let num = this.textIds.indexOf(row.id)
      if (num > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            if (row.value.trim().length === 0) {
              // 判断是否为空
              this.mapTag.splice(i, 1)
              this.textIds.splice(num, 1)
              this.attribute -= 1
              this.attributeValue -= 1
            } else {
              check.value = row.value
            }
          }
        }
      } else {
        if (row.value.trim().length !== 0) {
          this.textIds.push(row.id)
          let check = {}
          check.id = row.id
          check.value = row.value
          this.mapTag.push(check)
          this.attribute += 1
          this.attributeValue += 1
        }
      }
    },
    // 下拉选处理
    addSelect (row) {
      let num = this.selectIds.indexOf(row.id)
      if (num > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            if (check.value.indexOf(row.value) > -1) {
              this.mapTag.splice(i, 1)
              this.selectIds.splice(num, 1)
            } else {
              check.value = row.value
              this.attribute += 1
              this.attributeValue += 1
            }
          }
        }
      } else {
        this.selectIds.push(row.id)
        let check = {}
        check.id = row.id
        check.value = row.value
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
          // 如果mapTag包含该数据
          if (check.id === row.id) {
            // 如果时间为null则删除
            if (!row.value) {
              this.mapTag.splice(i, 1)
              this.dateIds.splice(num, 1)
              this.attribute -= 1
              this.attributeValue -= 1
            } else {
              check.value = row.value
              this.attribute += 1
              this.attributeValue += 1
            }
          }
        }
      } else {
        this.dateIds.push(row.id)
        let check = {}
        check.id = row.id
        check.value = row.value
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
            check.value = item
          }
        }
      } else {
        this.radioIds.push(row.id)
        let check = {}
        check.id = row.id
        check.value = item
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
          if (check.id === row.id) {
            // 如果参数中已经存在已选择的值则去除
            if (check.value.indexOf(item) > -1) {
              // 判断已选择值是否包含新值
              check.value = check.value.replace(item + '|', '') // 去除值
              this.attributeValue -= 1
              if (check.value.length === 1) { // 假如只剩下"|" 删除该值
                this.mapTag.splice(i, 1)
                this.checkboxIds.splice(num, 1)
                this.attribute -= 1
                this.$set(this.checkboxObject, row.id, [])
              } else {
                this.mapTag[i].value = check.value
                let valueArr = check.value.split('|')
                this.$set(this.checkboxObject, row.id, valueArr)
              }
            } else {
              check.value += item + '|'
              let valueArr = check.value.split('|')
              this.$set(this.checkboxObject, row.id, valueArr)
              this.attributeValue += 1
            }
          }
        }
      } else {
        this.checkboxIds.push(row.id)
        let check = {}
        check.id = row.id
        row.value = '|' + item + '|'
        check.value = row.value
        this.mapTag.push(check)
        let itemArr = [item]
        this.$set(this.checkboxObject, row.id, itemArr)
        this.attribute += 1
        this.attributeValue += 1
      }
    },
    saveTag () { // 保存标签
      if (this.mapTag.length === 0) {
        for (let i = 0; i < this.tagData.length; i++) {
          let tag = {}
          tag.id = this.tagData[i].id
          tag.value = ''
          this.mapTag.push(tag)
        }
        // this.$notify.error('未选择属性')
      } else {
        this.$http.fetch(this.$api.guide.guide.saveTag, {
          'sysCustomerId': this.sysCustomerId,
          'tagList': JSON.stringify(this.mapTag)
        }).then(resp => {
          if (resp.success && resp.result != null) {
            this.closeTag()
            this.restTag()
            this.$notify.success('保存成功！')
          }
        }).catch((resp) => {
          this.$notify.error(getErrorMsg('保存失败', resp))
        })
      }
    },
    // 清空标签
    restTag () {
      this.mapTag = []
      for (let i = 0; i < this.tagData.length; i++) {
        let tag = this.tagData[i]
        tag.value = ''
      }
      this.radioIds = []
      this.textIds = []
      this.selectIds = []
      this.dateIds = []
      this.checkboxIds = []
      for (let id in this.checkboxObject) {
        this.$set(this.checkboxObject, id, [])
      }
      this.attribute = 0
      this.attributeValue = 0
    },
    closeTag () {
      this.showTag = false
      this.restTag()
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
  computed: {
  }
}
