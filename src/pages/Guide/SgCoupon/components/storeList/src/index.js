import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  mixins: [tableMixin],
  data () {
    let paginations = {
      enable: true,
      size: 10,
      sizeOpts: [10, 20, 30, 50],
      page: 1,
      total: 0
    }
    return {
      model: {
        storeCouponCode: null,
        isOnline: 0,
        shop_name: null
      },
      shopAllList: [], // 所有店铺列表
      shopList: [],
      paginations: paginations,
      isDevide: false // 是否已经评分
    }
  },
  computed: {
    pageData () {
      const data = this.model.shop_name ? this.shopList.filter(item => item.shopName.indexOf(this.model.shop_name) > -1) : this.shopList
      const { size, page } = this.paginations
      this.paginations.total = data.length
      return data.slice((page - 1) * size, page * size)
    },
    devideText () {
      return this.isDevide ? '取消均分' : '均分'
    }
  },
  props: {
    shopListAll: {
      type: Array
    },
    shopMap: {
      type: Map
    },
    activityModel: {
      type: Object
    },
    storeModel: {
      type: Object
    }
  },
  methods: {
    // 点击移除选择的店铺
    removeShop (item) {
      const index = item.$index
      this.shopList.splice(index, 1)
      this.$emit('removeShop', index)
    },
    init (status, resp) {
      this.shopAllList = JSON.parse(JSON.stringify(this.shopListAll))
      this.findShopList(status, resp)
    },
    // 分页-大小改变
    shopSizeChange (pageSize) {
      var _this = this
      _this.paginations.size = pageSize
      _this.paginations.page = 1
    },
    // 分页-页数改变
    shopPageChange (page) {
      var _this = this
      _this.paginations.page = page
    },
    findShopList (status, resp) {
      this.model.storeCouponCode = this.activityModel.coupon_code
      var _this = this
      if (resp.success && resp.result.data != null) {
        if (status) {
          this.calcQuota(resp.result.data)
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
          if (this.activityModel.type === 0) {
            this.resetShopCouponNumber(this.activityModel.coupon_total)
          } else {
            this.resetShopCouponNumber(0)
          }
        }
        this._data.paginations.total = Number(resp.result.recordsTotal)
      }
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
        this.$emit('changeShopMap', shop.id, shop)
      }
      for (let a = 0; a < thisPageList.length; a++) {
        // 通过key将value取出 转换为深拷贝
        let shopObject = this.shopMap.get(thisPageList[a].id)
        let shopObj = JSON.stringify(shopObject)
        let newShopObject = JSON.parse(shopObj)
        this.shopList.push(newShopObject)
      }
    },
    /**
     * 计算优惠券总数couponTitle
     * 输入框的值改变
     * 利用map key的唯一性 每次修改map
     */
    inputChange: function (value, row) {
      row.shopCouponNumber = Number(value)
      var _this = this
      var total = 0
      // var couponTotal = _this.activityModel.coupon_total
      var couponId = _this.activityModel.coupon_id
      // window.console.log('storeList-storeModel', _this.storeModel)
      /// let remainingQuantity = _this.storeModel.remainingQuantity
      // 判断输入是否是正整数
      if (!/(^[0-9]\d*$)/.test(row.shopCouponNumber)) {
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
      // // 判断是否在分配中新增店铺
      // if (_this.shopMap.get(row.id)) {
      //   // 当前店铺改变前的优惠券数量
      //   var oldValue = _this.shopMap.get(row.id).shopCouponNumber
      //   // 优惠券总数 = 改变前的总数 - 改变前当前行的数量 + 改变后的当前行的数量
      //   total =
      //     parseInt(couponTotal) -
      //     parseInt(oldValue) +
      //     parseInt(row.shopCouponNumber)
      // } else {
      //   // 改变前的优惠券总数 + 新增店铺的分配优惠券的总数
      //   // total = parseInt(couponTotal) + parseInt(row.shopCouponNumber)
      // }
      // // 判断是否超过总数 _this.storeModel.couponTotal ==0 代表不限量
      // // window.console.log('storeList', _this.storeModel.maxType, remainingQuantity)
      // if (_this.storeModel.maxType > 0) {
      //   if (total > remainingQuantity) {
      //     _this.$notify.info('门店总配额不能超过优惠券总配额')
      //     row.shopCouponNumber = oldValue
      //     return
      //   }
      // }
      // 给总数赋值
      // _this.activityModel.coupon_total = total
      // 将当前行转换为深拷贝 set进 map
      let shopObj = JSON.stringify(row)
      let newShopObject = JSON.parse(shopObj)
      this.$emit('changeShopMap', row.id, newShopObject)
      const index = this.shopList.findIndex(item => item.id === row.id)
      this.$set(this.shopList, index, newShopObject)
      // _this.shopMap.set(row.id, newShopObject)
    },
    onChangeStoreInput () {
      this.shopPageChange()
    },
    resetShopCouponNumber (num) {
      this.shopList = this.shopList.map(item => {
        const newItem = {
          ...item,
          shopCouponNumber: num
        }
        this.$emit('changeShopMap', item.id, newItem)
        return newItem
      })
    },
    // 均分
    sharing () {
      const couponTotal = Number(this.activityModel.coupon_total)
      const length = this.shopList.length
      const per = Math.floor(couponTotal / length)
      const remainder = couponTotal % length
      const isNoRemainder = couponTotal % length === 0
      this.shopList = this.shopList.map((item, index) => {
        const shopCouponNumber = isNoRemainder ? per : (index + 1 > remainder) ? per : per + 1
        const newItem = {
          ...item,
          shopCouponNumber
        }
        this.$emit('changeShopMap', item.id, newItem)
        return newItem
      })
    },
    handleDevide () {
      this.$confirm((this.isDevide ? '确定取消均分的配额吗？' : '确定均分配额吗?'), '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'custom-dialog'
      }).then(action => {
        if (!this.isDevide) {
          this.sharing()
        } else {
          this.resetShopCouponNumber(0)
        }
        this.isDevide = !this.isDevide
      })
    }
    // this.$reload()
  },
  watch: {
    'activityModel.type' (newVal) {
      if (newVal === 0) {
        this.resetShopCouponNumber(this.activityModel.coupon_total)
      } else {
        this.resetShopCouponNumber(0)
      }
      this.isDevide = false
    }
  }
}
