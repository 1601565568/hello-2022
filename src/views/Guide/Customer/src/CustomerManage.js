import api from '@/config/http'
import tableMixin from 'web-crm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import fa from 'nui-v2/src/locale/lang/fa'
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
      mapTag: [],
      textIds: [], // 会员打标签输入框id集合
      selectIds: [], // 会员打标签下拉选id集合
      dateIds: [], // 会员打标签日期id集合
      checkboxIds: [], // 会员打标签复选框id集合
      radioIds: [], // 会员打标签单选框id集合
      checkboxList: [], // 标签页复选框绑定值
      attribute: 0, // 标签属性
      attributeValue: 0, // 标签属性值
      sysCustomerId: '', // 会员id
      shopKuhuShow: false,
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
      tableData: [{
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      },
      {
        integral: '增加 93',
        time: '2019-08-15 11:39:00',
        type: '赠送'
      }]
    }
  },
  mixins: [tableMixin],
  methods: {
    getCurrentRow (row, index) { // 单选按钮
      this.radio = index
      this.value = row
    },
    handleClick (tab, event) {
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
    // 更换导购弹窗\详情展示
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
    showTagData (row) {
      this.showTag = true
      this.sysCustomerId = row.sysCustomerId
      if (this.sysCustomerId.length > 0 && this.sysCustomerId !== row.sysCustomerId) {
        // 清空选项
        this.restTag()
      }
      this.$http.fetch(this.$api.guide.guide.queryAllTag, {
        'shopId': row.sgExclusiveShopId,
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
              if (tag.tagType !== 4 && tag.tagType !== 2) {
                this.attributeValue += 1
              } else if (tag.tagType === 4) {
                let valueArr = tag.value.split('|')
                let num = valueArr.length
                this.attributeValue += (num - 1)
                this.checkboxIds.push(tag.id)
                this.checkboxList.push.apply(this.checkboxList, valueArr)
              } else if (tag.tagType === 2) {
                let timeArr = tag.value.split(',')
                tag.value = timeArr
                this.attributeValue += 1
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
    },
    addText (row) {
      if (this.textIds.indexOf(row.id) > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            if (row.value.trim().length === 0) { // 判断是否为空
              this.mapTag.splice(i, 1)
              this.textIds = this.textIds.slice(row.id, 1)
              this.attribute -= 1
              this.attributeValue -= 1
            } else {
              check.value = row.value
            }
          }
        }
      } else {
        this.textIds.push(row.id)
        let check = {}
        check.id = row.id
        check.value = row.value
        this.mapTag.push(check)
        this.attribute += 1
        this.attributeValue += 1
      }
      console.log('更新后数据：' + JSON.stringify(this.mapTag))
    },
    addSelect (row) {
      if (this.selectIds.indexOf(row.id) > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            if (check.value.indexOf(row.value) > -1) {
              this.mapTag.splice(i, 1)
              this.selectIds.slice(row.id, 1)
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
      console.log('更新后数据：' + JSON.stringify(this.mapTag))
    },
    addDate (row) {
      if (this.dateIds.indexOf(row.id) > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            if (!row.value) {
              this.mapTag.splice(i, 1)
              this.dateIds.slice(row.id, 1)
            } else {
              check.value = row.value.join(',')
              this.attribute += 1
              this.attributeValue += 1
            }
          }
        }
      } else {
        this.dateIds.push(row.id)
        let check = {}
        check.id = row.id
        check.value = row.value.join(',')
        this.mapTag.push(check)
        this.attribute += 1
        this.attributeValue += 1
      }
      console.log('更新后数据：' + JSON.stringify(this.mapTag))
    },
    addRadio (row, item) {
      if (this.radioIds.indexOf(row.id) > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) { // 假如选中数据已包含在数组中
            if (check.id === 4) {
              this.mapTag.splice(i, 1)
            }
            if (check.value.indexOf(item) > -1) { // 假如选中值重复则去除
              check.value = check.value.replace(item, '')
              if (check.value.length === 0) {
                this.mapTag.splice(i, 1)
                this.radioIds.slice(row.id, 1)
              }
            } else {
              check.value = item
              this.attribute += 1
              this.attributeValue += 1
            }
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
      console.log('更新后数据：' + JSON.stringify(this.mapTag))
    },
    addCheckbox (row, item) {
      // 出现匹配失败的问题 判断4 变成判断504匹配成功
      if (this.checkboxIds.indexOf(row.id) > -1) {
        for (let i = 0; i < this.mapTag.length; i++) {
          let check = this.mapTag[i]
          if (check.id === row.id) {
            if (check.value.indexOf(item) > -1) { // 判断已选择值是否包含新值
              check.value = check.value.replace(item + '|', '') // 去除值
              this.attributeValue -= 1
              if (check.value.length === 1) { // 假如只剩下"|" 删除该值
                this.mapTag.splice(i, 1)
                this.checkboxIds.slice(row.id, 1)
                this.attribute -= 1
              } else {
                this.mapTag[i].value = check.value
              }
            } else {
              check.value += item + '|'
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
        this.attribute += 1
        this.attributeValue += 1
      }
      console.log('更新后数据：' + JSON.stringify(this.mapTag))
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
      this.checkboxList = []
      this.attribute = 0
      this.attributeValue = 0
    },
    closeTag () {
      this.showTag = false
      this.attribute = 0
      this.attributeValue = 0
    },
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
          obj.platform = item.platform === 302 ? 19 : item.platform
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
    }
  },
  mounted: function () {
  },
  computed: {
    disposeCheckValue (value) {
      let arr = value.replace('|', ',')
      return arr
    }
  }
}
