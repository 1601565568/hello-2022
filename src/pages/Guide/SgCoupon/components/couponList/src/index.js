import Coupon from '../../coupon'
import StoreList from '../../storeList'
import moment from 'moment'
export default {
  components: {
    Coupon,
    StoreList
  },
  data () {
    let bgCoupon = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/no-coupon.png'
    let activityModel = {
      type: 0,
      coupon_id: 0,
      coupon_code: null,
      coupon_total: 0
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
      remainingQuantity: null, // 优惠券剩余数量
      remark: null, // 备注
      useRemark: null // 使用备注
    }
    return {
      distributionMode: 0, // 分配方式 默认为零
      forbidden: false, // 默认保存
      addCouponDialogVisible: false,
      activityModel: activityModel,
      storeModel: storeModel,
      storeCouponList: null, // 店铺优惠券列表
      storeCouponListLength: 0,
      bgcoupon: bgCoupon,
      shopMap: null, // 店铺map
      shopAllList: [],
      isShowCouponNumber: true // 折扣券 展示
    }
  },
  methods: {
    init () {
      this.addCouponDialogVisible = true
      this.activityModel.coupon_id = 0
    },
    // 关闭新增弹窗
    closeDialog () {
      this.addCouponDialogVisible = !this.addCouponDialogVisible
      this.$emit('closeDialog')
    },
    onSaveActivityCoupon () {
      let _this = this
      if (_this.activityModel.coupon_total === 0) {
        _this.$notify.error('总配额必须大于0')
        // _this.forbidden = false
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
      console.log(_this.shopCouponList, 'shopCouponList')
      // this.closeDialog()
    },
    // 打开优惠券弹窗
    onOpenCoupon () {
      // this.$reload()
      this.distributionMode = 0
      this.$refs.Coupon.init()
    },
    // 获取优惠券信息
    getCouponMessage (data) {
      var _this = this
      _this.activityModel.coupon_id = data.id
      _this.activityModel.coupon_code = data.storeCouponCode
      _this.findOnlineShopList(_this.activityModel.coupon_code)
      _this.storeModel.couponCode = data.storeCouponCode
      _this.storeModel.remainingQuantity = Number(data.maxIssueAmount) - Number(data.couponFreezeAmount) - Number(data.hadIssueAmount)
      _this.storeModel.couponTitle = data.storeCouponTitle
      if (_this.storeModel.couponTitle !== null && _this.storeModel.couponTitle.length > 20) {
        _this.storeModel.couponTitle = data.title.substr(0, 19) + '...'
      }
      _this.storeModel.couponType = Number(data.storeCouponType)
      let temporaryCouponValue = data.storeCouponValue
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
      // console.log('优惠券value', _this.storeModel.couponValue)
      _this.storeModel.couponTotal = Number(data.maxIssueAmount)
      _this.storeModel.maxType = Number(data.maxIssueAmount)
      _this.storeModel.dateType = Number(data.dateValidType)
      // _this.storeModel.startTime = data.startTime
      // _this.storeModel.endTime = data.endTime
      _this.storeModel.startTime = moment(Number(data.startTime)).format('YYYY-MM-DD HH:mm:ss')
      _this.storeModel.endTime = moment(Number(data.startTime)).format('YYYY-MM-DD HH:mm:ss')
      _this.storeModel.after_get_valid_days = Number(data.afterGetValidDays)
      _this.storeModel.valid_days = Number(data.validDays)
      _this.storeModel.conditionJson = data.useConditionJson
      _this.storeModel.remark = data.remark
      _this.storeModel.useRemark = data.useRemark
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
        _this.$notify.error(`查询店铺列表失败${resp}`)
      })
    },
    // 修改分配方式
    onChangeDistributionMode (type) {
      this.distributionMode = type
      if (type === 1) {
        this.$nextTick(() => {
          this.$refs.storeList.init(true)
        })
      }
    },
    /**
     * 检验配额整数 以及总数量
     */
    activityCouponTotal () {
      var _this = this
      var couponId = _this.activityModel.coupon_id
      if (couponId === 0 || couponId === null || couponId === '') {
        _this.activityModel.coupon_total = 0
        _this.$notify.info('请先选择优惠券')
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
    changeShopMap (id, shop) {
      this.shopMap.set(id, shop)
    },
    //  type = 0 返回个位数  type= 1 返回小数
    splitCouponNumber (data, type) {
      window.console.log('折扣券', data)
      // debugger
      var indexOf = data.indexOf('.')
      if (type === 0) {
        if (indexOf === 0) {
          this.isShowCouponNumber = false
          return data
        } else {
          this.isShowCouponNumber = true
          // window.console.log('折扣券个位数', data.substr(0, indexOf))
          return data.substr(0, indexOf)
        }
      } else {
        // window.console.log('折扣券小数位', data.substr(indexOf, data.length))
        return data.substr(indexOf, data.length)
      }
    },
    findShopList (status) {
      // var _this = this
      // _this.$http.fetch(_this.$api.guide.activityCoupon.findCouponShop, {
      //   'length': _this.paginations.size,
      //   'start': _this.paginations.size * (_this.paginations.page - 1),
      //   searchMap: {
      //     'storeCouponCode': _this.storeModel.couponCode,
      //     'isOnline': 0,
      //     'shop_name': _this.shopSearch.shopName
      //   }
      // }).then(resp => {
      //   if (resp.success && resp.result.data != null) {
      //     // 第一次点击radio的时候计算均值
      //     if (status) {
      //       _this.calcQuota(resp.result.data)
      //     } else {
      //       _this.shopList = []
      //       // _this.shopList = Object.assign({}, resp.result.data)
      //       for (let a = 0; a < resp.result.data.length; a++) {
      //         // 通过key将value取出 转换为深拷贝
      //         let shopObject = this.shopMap.get(resp.result.data[a].id)
      //         let shopObj = JSON.stringify(shopObject)
      //         let newShopObject = JSON.parse(shopObj)
      //         _this.shopList.push(newShopObject)
      //       }
      //     }
      //     this._data.paginations.total = Number(resp.result.recordsTotal)
      //   }
      // }).catch((resp) => {
      //   _this.$notify.error(getErrorMsg('查询店铺列表失败', resp))
      // })
    }
  }
}
