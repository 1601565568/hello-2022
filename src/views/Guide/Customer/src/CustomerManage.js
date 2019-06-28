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
      shopKuhuShow: false,
      result: null,
      _queryConfig: { expand: false }
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
    onRedactFun (val) {
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
          nick: val.nick,
          nickType: val.nickType,
          customerFrom: val.customerFrom,
          guideId: Number(val.guideId),
          shopId: null
        }).then(resp => {
          if (resp.success && resp.result != null) {
            _this.shopKuhuShow = true
            _this.items = resp.result
          }
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
        })

        _this.$http.fetch(_this.$api.guide.guide.customerQueryValidPoint, {
          nick: val.nick,
          nickType: val.nickType,
          customerFrom: val.customerFrom
        }).then(resp => {
          _this.result = resp.result
        }).catch((resp) => {
          _this.$notify.error(getErrorMsg('查询失败', resp))
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
          obj.nick = item.nick
          obj.nickType = item.nickType
          obj.customerFrom = Number(item.customerFrom)
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
}
