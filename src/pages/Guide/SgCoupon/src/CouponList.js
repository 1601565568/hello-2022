import formMixin from '@nascent/ecrp-ecrm/src/mixins/form'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [formMixin],
  data: function () {
    let rules = {
      coupon_id: [{
        required: true,
        validator: (rule, value, callback) => {
          if (value === '' || value === null || value === 0) {
            callback(new Error('请选择优惠券'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }],
      type: [{
        required: true,
        validator: (rule, value, callback) => {
          if (value === '' || value === null) {
            callback(new Error('请选择分配方式'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }],
      coupon_total: [{
        required: true,
        validator: (rule, value, callback) => {
          var regin = /^(0|[1-9][0-9]*)$/
          var flag = regin.test(value)
          if (!flag) {
            callback(new Error('请输入整数'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }]
    }
    let paginations = {
      enable: true,
      size: 10,
      sizeOpts: [10, 20, 30, 50],
      page: 1,
      total: 0
    }
    let shopSearch = {
      shopName: null,
      province: null,
      city: null,
      county: null
    }
    let storeModel = {
      couponCode: null, // 优惠券编码
      couponTitle: null, // 标题
      couponType: null, // 门店优惠券类型（0：未知，1：代金券、2：折扣券、3：兑换券）
      couponValue: null, // store_coupon_type=1:面值;  store_coupon_type=2: 折扣额 8.5在数据库存的0.85
      couponTotal: null, // 优惠券数量  0:无限量， 1：总数
      dateType: null, // 有效时间类型: dateType=0,start_time和end_time有效;  dateType=1,after_get_valid_days和valid_days有效;
      startTime: null, // 开始时间
      endTime: null, // 领取N天后生效
      after_get_valid_days: null, // 领取N天后生效
      valid_days: null, // 有效天数
      maxType: null, // 类型
      conditionJson: null, // 使用条件 json,
      remainingQuantity: null // 优惠券剩余数量
    }
    let activityModel = {
      type: 0,
      coupon_id: null,
      coupon_code: null,
      coupon_total: 0
    }
    let shopModel = {
      shop_coupon_total: null,
      shop_id: null
    }
    return {
      title: null, // 新增弹窗标题
      forbidden: false, // 默认保存
      rules: rules, // 保存校验
      paginations: paginations, // 分页
      storeCouponList: null, // 店铺优惠券列表
      shopAllList: [], // 所有店铺列表
      shopList: [], // 当前页店铺列表
      shopCouponList: [], // 保存到后台的集合
      shopMap: null, // 店铺map
      shopSearch: shopSearch, // 店铺搜索model
      activityModel: activityModel, // 活动表model
      shopModel: shopModel, // 店铺表model
      storeModel: storeModel, // store model
      addCouponDialogVisible: false, // 新增弹窗是否显示控制
      storeCouponListLength: 0,
      couponListShow: false
    }
  },
  methods: {
    showListDialogFun (id) {
      this.$nextTick(() => {
        this.$refs.listDialogDom.showToggle(id)
      })
    },
    /**
     * 重置表单数据
     */
    resetForm (formName) {
      var _this = this
      _this.activityModel = {
        type: 0,
        coupon_id: null,
        coupon_code: null,
        coupon_total: 0
      }
      _this.shopModel = {
        shop_coupon_total: 0,
        shop_id: null
      }
    },
    /**
     * 打开弹框
     */
    addCoupon: function (item) {
      this.couponListShow = true
      this.$nextTick(() => {
        this.$refs.couponList.init(item)
      })
    },
    closeDialogCouponList () {
      let _this = this
      _this.$refs.table.$reload()
      setTimeout(() => {
        _this.couponListShow = false
      }, 500)
    },
    /**
     * 检验配额整数 以及总数量
     */
    activityCouponTotal: function () {
      var _this = this
      var couponId = _this.activityModel.coupon_id
      if (couponId === 0 || couponId === null || couponId === '') {
        _this.activityModel.coupon_total = 0
        _this.$notify.info('请选择优惠券')
        return
      }
      // _this.storeModel.couponTotal = 0 代表不限额，不做数量校验
      if (_this.storeModel.maxType > 0) {
        if (_this.storeModel.remainingQuantity < _this.activityModel.coupon_total) {
          _this.activityModel.coupon_total = 0
          _this.$notify.info('配额不能大于优惠券总数')
        }
      }
    },
    /**
     * 选择类型
     */
    radioOnclick: function (status) {
      var _this = this
      _this.shopList = []
      if (status === 1) {
        _this.paginations.size = 10
        _this.paginations.page = 1
        // 第一次进入的时候默认传true
        _this.findShopList(true)
      }
    },
    /**
     * 查询店铺优惠券列表上
     */
    findStoreCouponList: function () {
      var _this = this
      _this.$http.fetch(_this.$api.guide.activityCoupon.findStoreCouponList, {

      }).then(resp => {
        if (resp.success && resp.result != null) {
          _this.storeCouponList = resp.result
          _this.storeCouponListLength = resp.result.length
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询活动优惠券列表失败', resp))
      })
    },
    /**
     * 优惠券下拉框改变
     */
    storeCouponChange: function (value) {
      var _this = this
      _this.activityModel.coupon_id = value
      _this.activityModel.type = 0
      _this.storeCouponList.map(item => {
        if (value === item.id) {
          _this.storeModel.remainingQuantity = Number(item.maxIssueAmount) - Number(item.couponFreezeAmount) - Number(item.hadIssueAmount)
        }
      })
      for (let i = 0; i < _this.storeCouponList.length; i++) {
        if (value === _this.storeCouponList[i].id) {
          _this.activityModel.coupon_code = _this.storeCouponList[i].storeCouponCode
          _this.storeModel.couponCode = _this.storeCouponList[i].storeCouponCode
          _this.findOnlineShopList(_this.storeModel.couponCode)
          _this.storeModel.couponTitle = _this.storeCouponList[i].storeCouponTitle
          if (_this.storeModel.couponTitle !== null && _this.storeModel.couponTitle.length > 20) {
            _this.storeModel.couponTitle = _this.storeCouponList[i].title.substr(0, 19) + '...'
          }
          _this.storeModel.couponType = Number(_this.storeCouponList[i].storeCouponType)
          let temporaryCouponValue = _this.storeCouponList[i].storeCouponValue
          let temporaryIndex = (temporaryCouponValue !== Math.floor(temporaryCouponValue)) ? (temporaryCouponValue.toString()).split('.')[1].length : 0
          if (temporaryIndex > 1) {
            _this.storeModel.couponValue = (temporaryCouponValue * 10).toFixed(1)
          }
          if (temporaryIndex === 1) {
            _this.storeModel.couponValue = temporaryCouponValue * 10
          }
          if (temporaryIndex === 0) {
            _this.storeModel.couponValue = temporaryCouponValue
          }
          // _this.storeModel.couponValue = _this.storeCouponList[i].storeCouponValue
          // console.log('优惠券value', _this.storeModel.couponValue)
          _this.storeModel.couponTotal = Number(_this.storeCouponList[i].maxIssueAmount)
          _this.storeModel.maxType = Number(_this.storeCouponList[i].maxIssueAmount)
          _this.storeModel.dateType = Number(_this.storeCouponList[i].dateValidType)
          _this.storeModel.startTime = _this.storeCouponList[i].startTime
          _this.storeModel.endTime = _this.storeCouponList[i].endTime
          _this.storeModel.after_get_valid_days = Number(_this.storeCouponList[i].afterGetValidDays)
          _this.storeModel.valid_days = Number(_this.storeCouponList[i].validDays)
          _this.storeModel.conditionJson = _this.storeCouponList[i].useConditionJson
          break
        }
      }
    },
    /**
     * 查询所有的店铺店铺列表
     */
    findOnlineShopList: function (couponCode) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.activityCoupon.findCouponShop, {
        'length': 100000,
        'start': 0,
        searchMap: {
          'storeCouponCode': couponCode,
          'isOnline': 0
        }
      }).then(resp => {
        if (resp.success && resp.result != null) {
          if (resp.result.ext != null) {
            let isContains = resp.result.ext.isContain
            if (!isContains) {
              this.$confirm('此优惠券也可以在其他门店购买，是否继续？', '提示', {
                confirmButtonText: '是',
                type: 'warning',
                cancelButtonText: '否'
              }).then(() => {
                // 将所有店铺存入map中
                _this.shopMap = new Map()
                _this.shopAllList = resp.result.data
                for (let i = 0; i < _this.shopAllList.length; i++) {
                  _this.shopMap.set(_this.shopAllList[i].id, _this.shopAllList.slice(i, i + 1))
                }
              }).catch(() => {
                this.activityModel.coupon_id = ''
              })
            }
          } else {
            // 将所有店铺存入map中
            _this.shopMap = new Map()
            _this.shopAllList = resp.result.data
            for (let i = 0; i < _this.shopAllList.length; i++) {
              _this.shopMap.set(_this.shopAllList[i].id, _this.shopAllList.slice(i, i + 1))
            }
          }
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询店铺列表失败', resp))
      })
    },
    /**
     * 分页查询店铺店铺列表
     */
    findShopList: function (status) {
      var _this = this
      _this.$http.fetch(_this.$api.guide.activityCoupon.findCouponShop, {
        'length': _this.paginations.size,
        'start': _this.paginations.size * (_this.paginations.page - 1),
        searchMap: {
          'storeCouponCode': _this.storeModel.couponCode,
          'isOnline': 0,
          'shop_name': _this.shopSearch.shopName
        }
      }).then(resp => {
        if (resp.success && resp.result.data != null) {
          // 第一次点击radio的时候计算均值
          if (status) {
            _this.calcQuota(resp.result.data)
          } else {
            _this.shopList = []
            // _this.shopList = Object.assign({}, resp.result.data)
            for (let a = 0; a < resp.result.data.length; a++) {
              // 通过key将value取出 转换为深拷贝
              let shopObject = this.shopMap.get(resp.result.data[a].id)
              let shopObj = JSON.stringify(shopObject)
              let newShopObject = JSON.parse(shopObj)
              _this.shopList.push(newShopObject)
            }
          }
          this._data.paginations.total = Number(resp.result.recordsTotal)
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询店铺列表失败', resp))
      })
    },
    /**
     * 计算每个店铺的配额
     */
    calcQuota: function (thisPageList) {
      // 优惠券总数
      let couponTotal = Number(this.activityModel.coupon_total)
      // 计算倍数
      let multiple = parseInt(couponTotal / this.shopAllList.length)
      // 计算余数
      let remainder = couponTotal % this.shopAllList.length
      for (let i = 0; i < this.shopAllList.length; i++) {
        let shop = {}
        shop = this.shopAllList[i]
        if (remainder >= i + 1) {
          shop.shopCouponNumber = multiple + 1
        } else {
          shop.shopCouponNumber = multiple
        }
        this.shopMap.set(shop.id, shop)
      }
      for (let a = 0; a < thisPageList.length; a++) {
        // 通过key将value取出 转换为深拷贝
        let shopObject = this.shopMap.get(thisPageList[a].id)
        let shopObj = JSON.stringify(shopObject)
        let newShopObject = JSON.parse(shopObj)
        this.shopList.push(newShopObject)
      }
    },
    checkNum: function (row) {
      // 判断输入是否是正整数
      if (!(/(^[1-9]\d*$)/.test(row.shopCouponNumber))) {
        _this.$notify.info('请输入正整数')
        row.shopCouponNumber = 0
      }
    },
    /**
     * 计算优惠券总数couponTitle
     * 输入框的值改变
     * 利用map key的唯一性 每次修改map
     */
    inputChange: function (row) {
      row.shopCouponNumber = Number(row.shopCouponNumber.replace(/[^\d]/g, ''))
      var _this = this
      var total = 0
      var couponTotal = _this.activityModel.coupon_total
      var couponId = _this.activityModel.coupon_id
      let remainingQuantity = _this.storeModel.remainingQuantity
      // 判断输入是否是正整数
      if (!(/(^[0-9]\d*$)/.test(row.shopCouponNumber))) {
        _this.$notify.info('请输入正整数')
        row.shopCouponNumber = 0
        return
      }
      // 判断是否选择优惠券
      if (couponId === 0 || couponId === null || couponId === '') {
        _this.activityModel.coupon_total = 0
        _this.$notify.info('请选择优惠券')
        row.shopCouponNumber = 0
        return
      }
      if (row.shopCouponNumber === null || row.shopCouponNumber === '') {
        row.shopCouponNumber = 0
      }
      // 判断是否在分配中新增店铺
      if (_this.shopMap.get(row.id)) {
        // 当前店铺改变前的优惠券数量
        var oldValue = _this.shopMap.get(row.id).shopCouponNumber
        // 优惠券总数 = 改变前的总数 - 改变前当前行的数量 + 改变后的当前行的数量
        total = parseInt(couponTotal) - parseInt(oldValue) + parseInt(row.shopCouponNumber)
      } else {
        // 改变前的优惠券总数 + 新增店铺的分配优惠券的总数
        total = parseInt(couponTotal) + parseInt(row.shopCouponNumber)
      }
      // 判断是否超过总数 _this.storeModel.couponTotal ==0 代表不限量
      if (_this.storeModel.maxType > 0) {
        // 该判断计算的是所有优惠券数量（包含已使用的）
        // if (total > _this.storeModel.couponTotal) {
        //   _this.$notify.info('门店总配额不能超过优惠券总配额')
        //   row.shopCouponNumber = oldValue
        //   return
        // }
        if (total > remainingQuantity) {
          _this.$notify.info('门店总配额不能超过优惠券总配额')
          row.shopCouponNumber = oldValue
          // 禁止保存延迟设置，防止点击过快
          setTimeout(() => { this.forbidden = false }, 1000)
          return
        }
      }
      // 给总数赋值
      _this.activityModel.coupon_total = total
      // 将当前行转换为深拷贝 set进 map
      let shopObj = JSON.stringify(row)
      let newShopObject = JSON.parse(shopObj)
      _this.shopMap.set(row.id, newShopObject)
      setTimeout(() => { this.forbidden = false }, 500)
    },
    // 更改字段布尔值
    ChangeForbiddenStatus () {
      setTimeout(() => { this.forbidden = true }, 500)
    },
    // 延时更改字段布尔值
    delayedChangeStatus () {
      setTimeout(() => { this.forbidden = false }, 500)
    },
    // 分页-页数改变
    shopPageChange (page) {
      var _this = this
      if (this.shopList.length > 0) {
        this.shopList = []
      }
      _this.paginations.page = page
      _this.findShopList()
    },
    // 分页-大小改变
    shopSizeChange (pageSize) {
      var _this = this
      _this.paginations.size = pageSize
      _this.paginations.page = 1
      _this.findShopList()
    },
    /**
     * 店铺搜索
     */
    onSearchShop: function () {
      var _this = this
      _this.paginations.page = 1
      this.findShopList()
    },
    /**
     * 保存活动优惠券
     */
    onSaveActivityCoupon: function () {
      var _this = this
      _this.forbidden = true
      _this.$refs.form.validate((valid) => {
        if (valid) {
          if (_this.activityModel.coupon_total === 0) {
            _this.$notify.error('总配额必须大于0')
            _this.forbidden = false
            return
          }
          // 判断优惠券是否超额 _this.storeModel.couponTotal = 0 代表不限量
          if (_this.storeModel.maxType > 0) {
            if (_this.storeModel.couponTotal < _this.activityModel.coupon_total) {
              // _this.$notify.info('门店总配额不能超过优惠券总配额')
              _this.forbidden = false
              return
            }
          }
          _this.shopCouponList = []
          _this.shopMap.forEach(function (value, key, map) {
            var shop = {}
            shop.shopId = value.id
            shop.shopCouponTotal = parseInt(value.shopCouponNumber)
            shop.shopName = value.shopName
            _this.shopCouponList.push(shop)
          })
          // console.log(JSON.stringify(_this.shopCouponList))
          // return
          _this.$http.fetch(_this.$api.guide.activityCoupon.saveActiviCoupon, {
            sgActivityCoupon: _this.activityModel,
            couponShopList: _this.shopCouponList
          }).then(resp => {
            if (resp.success) {
              _this.addCouponDialogVisible = false
              _this.$refs.table.$reload()
              _this.$notify.success(resp.msg)
              _this.forbidden = false
            }
          }).catch((resp) => {
            _this.$notify.error(getErrorMsg('保存失败', resp))
            _this.forbidden = false
          })
        } else {
          _this.forbidden = false
        }
      })
    },
    /**
     * 关闭弹窗
     */
    closeDialog: function () {
      var _this = this
      _this.paginations.size = 10
      _this.addCouponDialogVisible = false
    }
  },
  mounted: function () {
    // var _this = this
    // _this.findShopAllList()
  }
}
