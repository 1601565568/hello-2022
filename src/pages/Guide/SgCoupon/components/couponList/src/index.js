import Coupon from '../../coupon'
import StoreList from '../../storeList'
import HtmlArea from '@/components/NewUi/HtmlArea'
import NsShopDialog from '@/components/NsShopDialog'
import shopSelect from '../../../../components/selectShops'
import moment from 'moment'
export default {
  components: {
    Coupon,
    StoreList,
    HtmlArea,
    NsShopDialog,
    shopSelect
  },
  data () {
    let bgCoupon =
      'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/no-coupon.png'
    let activityModel = {
      type: 0,
      coupon_id: 0,
      coupon_code: null,
      coupon_total: 0,
      apportion_channel: 0 // 分配渠道 0:导购分发 1活动分发
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
      maxType: 0, // 类型
      conditionJson: null, // 使用条件 json,
      remainingQuantity: null, // 优惠券剩余数量
      remark: null, // 备注
      useRemark: null, // 使用备注
      loginAccount: null, // 添加人账号名
      channelConfigType: null, // 渠道配置类型（0：不限，1：配置）
      limitAmount: null, // 渠道配置数量
      channelFreezeAmount: null, // 渠道已冻结总量
      channelHadIssueAmount: null // 渠道已发放总量
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
      isShowCouponNumber: true, // 折扣券 展示
      shopList: [], // 选择的门店
      apportionChannel: 0, // 分配渠道
      activityType: 1, // 分配活动
      activityTypeList: [{ value: 1, label: '裂变大师' }],
      selectShopName: 0 // 分配门店
    }
  },
  methods: {
    removeShop (index) {
      this.shopList.splice(index, 1)
    },
    init () {
      this.addCouponDialogVisible = true
      this.activityModel.coupon_id = 0
    },
    // 关闭新增弹窗
    closeDialog () {
      this.addCouponDialogVisible = false
      this.$emit('closeDialog')
    },
    onSaveActivityCoupon () {
      if (this.activityModel.coupon_id === 0) {
        this.$notify.error('请选择优惠券')
        return
      }
      if (this.apportionChannel === 0) {
        this.onSaveGuidActivityCoupon()
      } else {
        this.onSaveSendActivityCoupon()
      }
    },
    onSaveSendActivityCoupon () {
      this.forbidden = true
      let _this = this
      if (_this.storeModel.maxType >= 0) {
        if (
          _this.activityModel.coupon_total === 0 ||
          _this.activityModel.coupon_total < 0
        ) {
          _this.$notify.error('总配额必须大于0')
          this.forbidden = false
          // _this.forbidden = false
          return
        }
      } else if (_this.storeModel.maxType < 0) {
        if (
          _this.storeModel.remainingQuantity < _this.activityModel.coupon_total
        ) {
          _this.activityModel.coupon_total = 0
          _this.$notify.error('配额不能大于优惠券剩余数量')
          this.forbidden = false
          return
        }
      }
      this.$http
        .fetch(_this.$api.guide.activityCoupon.saveActiviCoupon, {
          apportionChannel: this.apportionChannel, // 分配渠道
          activityType: this.activityType, // 分配活动
          sgActivityCoupon: _this.activityModel,
          couponShopList: _this.shopCouponList
        })
        .then(resp => {
          if (resp.success) {
            _this.addCouponDialogVisible = false
            // _this.$refs.table.$reload()
            _this.$notify.success(resp.msg)
            _this.forbidden = false
            this.closeDialog()
          }
        })
        .catch(resp => {
          _this.$notify.error(getErrorMsg('保存失败', resp))
          _this.forbidden = false
        })
    },
    async onSaveGuidActivityCoupon () {
      this.forbidden = true
      let _this = this
      if (!this.shopList || !this.shopList.length) {
        this.forbidden = false
        _this.$notify.error('分配门店是必填字段')
        return
      }
      if (_this.storeModel.maxType >= 0) {
        if (
          _this.activityModel.coupon_total === 0 ||
          _this.activityModel.coupon_total < 0
        ) {
          _this.$notify.error('总配额必须大于0')
          this.forbidden = false
          // _this.forbidden = false
          return
        }
      }
      if (_this.storeModel.maxType < 0) {
        if (
          _this.storeModel.remainingQuantity < _this.activityModel.coupon_total
        ) {
          _this.activityModel.coupon_total = 0
          _this.$notify.error('配额不能大于优惠券剩余数量')
        }
        this.forbidden = false
        return
      }
      // 判断优惠券是否超额 _this.storeModel.couponTotal = 0 代表不限量
      if (_this.storeModel.maxType > 0) {
        if (_this.storeModel.couponTotal < _this.activityModel.coupon_total) {
          _this.$notify.info('门店总配额不能超过优惠券总配额')
          _this.forbidden = false
          return
        }
      }
      _this.shopCouponList = []
      let total = 0
      _this.shopMap.forEach(function (value, key, map) {
        total += parseInt(value.shopCouponNumber)
        var shop = {}
        shop.shopId = value.id
        shop.shopCouponTotal = parseInt(value.shopCouponNumber)
        shop.shopName = value.shopName
        _this.shopCouponList.push(shop)
      })
      if (this.activityModel.type === 1) {
        if (total > _this.activityModel.coupon_total) {
          _this.$notify.info('门店配额总和合大于优惠券设置的配额')
          this.forbidden = false
          return
        }
        if (total < _this.activityModel.coupon_total) {
          const result = await this.changeTotal(total)
          if (!result) {
            this.forbidden = false
            return
          }
          _this.activityModel.coupon_total = result
        }
      }
      _this.$http
        .fetch(_this.$api.guide.activityCoupon.saveActiviCoupon, {
          sgActivityCoupon: _this.activityModel,
          couponShopList: _this.shopCouponList,
          apportionChannel: this.apportionChannel, // 分配渠道
          activityType: this.activityType // 分配活动
        })
        .then(resp => {
          if (resp.success) {
            _this.addCouponDialogVisible = false
            // _this.$refs.table.$reload()
            _this.$notify.success(resp.msg)
            _this.forbidden = false
            this.closeDialog()
          } else {
            _this.$notify.error(resp.msg)
            _this.forbidden = false
            // this.closeDialog()
          }
        })
        .catch(resp => {
          _this.$notify.error(getErrorMsg('保存失败', resp))
          _this.forbidden = false
        })
    },
    changeTotal (total) {
      return new Promise(resolve => {
        this.$msgbox({
          message: '门店配额总和小于优惠券设置的配额，是否更新优惠券设置的配额',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(action => {
            resolve(total)
          })
          .catch(() => {
            resolve(false)
          })
      })
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
      // _this.findOnlineShopList(_this.activityModel.coupon_code)
      _this.storeModel.couponCode = data.storeCouponCode
      // 渠道配置类型（0：不限，1：配置）
      if (data.channelConfigType === 0) {
        _this.storeModel.remainingQuantity =
          Number(data.maxIssueAmount) -
          Number(data.couponFreezeAmount) -
          Number(data.hadIssueAmount)
      } else {
        _this.storeModel.remainingQuantity =
          Number(data.limitAmount) - Number(data.channelFreezeAmount)
      }
      _this.storeModel.couponTitle = data.storeCouponTitle
      if (
        _this.storeModel.couponTitle !== null &&
        _this.storeModel.couponTitle.length > 20
      ) {
        _this.storeModel.couponTitle = data.title.substr(0, 19) + '...'
      }
      _this.storeModel.couponType = Number(data.storeCouponType)
      let temporaryCouponValue = data.storeCouponValue
      let temporaryIndex =
        temporaryCouponValue !== Math.floor(temporaryCouponValue)
          ? temporaryCouponValue.toString().split('.')[1].length
          : 0
      if (_this.storeModel.couponType === 2) {
        if (temporaryIndex > 1) {
          _this.storeModel.couponValue = (temporaryCouponValue * 10).toFixed(1)
        }
        if (temporaryIndex === 1) {
          _this.storeModel.couponValue = temporaryCouponValue * 10
        }
        if (temporaryIndex === 0) {
          _this.storeModel.couponValue = temporaryCouponValue
        }
      } else {
        _this.storeModel.couponValue = data.storeCouponValue
      }
      // console.log('优惠券value', _this.storeModel.couponValue)
      _this.storeModel.couponTotal = Number(data.maxIssueAmount)
      _this.storeModel.maxType = Number(data.maxIssueAmount)
      _this.storeModel.dateType = Number(data.dateValidType)
      _this.storeModel.startTime = data.startTime
      _this.storeModel.endTime = data.endTime
      // _this.storeModel.startTime = moment(Number(data.startTime)).format('YYYY-MM-DD HH:mm:ss')
      // _this.storeModel.endTime = moment(Number(data.endTime)).format('YYYY-MM-DD HH:mm:ss')
      _this.storeModel.after_get_valid_days = Number(data.afterGetValidDays)
      _this.storeModel.valid_days = Number(data.validDays)
      _this.storeModel.conditionJson = data.useConditionJson
      _this.storeModel.remark = data.remark
      _this.storeModel.useRemark = data.useRemark
      _this.storeModel.loginAccount = data.loginAccount
      _this.storeModel.channelConfigType = data.channelConfigType
      _this.storeModel.limitAmount = data.limitAmount
      _this.storeModel.channelFreezeAmount = data.channelFreezeAmount
      _this.storeModel.channelHadIssueAmount = data.channelHadIssueAmount
      this.reset()
    },
    reset () {
      this.activityModel.coupon_total = 0
      this.activityModel.type = 0
      this.distributionMode = 0
      this.shopList = []
    },
    /**
     * 查询所有的店铺店铺列表
     */
    findOnlineShopList: function (couponCode, shopIds) {
      var _this = this
      return new Promise(resolve => {
        _this.$http
          .fetch(_this.$api.guide.activityCoupon.findCouponShop, {
            length: 100000,
            start: 0,
            searchMap: {
              storeCouponCode: couponCode,
              isOnline: 0,
              shopIds
            }
          })
          .then(resp => {
            if (resp.success && resp.result != null) {
              if (resp.result.ext != null) {
                let isContains = resp.result.ext.isContain
                if (!isContains) {
                  this.$confirm(
                    '此优惠券也可以在其他门店购买，是否继续？',
                    '提示',
                    {
                      confirmButtonText: '是',
                      type: 'warning',
                      cancelButtonText: '否'
                    }
                  )
                    .then(() => {
                      // 将所有店铺存入map中
                      _this.shopMap = new Map()
                      _this.shopAllList = resp.result.data
                      for (let i = 0; i < _this.shopAllList.length; i++) {
                        _this.shopMap.set(
                          _this.shopAllList[i].id,
                          _this.shopAllList[i]
                        )
                      }
                    })
                    .catch(() => {
                      this.activityModel.coupon_id = ''
                    })
                }
              } else {
                // 将所有店铺存入map中
                _this.shopMap = new Map()
                _this.shopAllList = resp.result.data
                for (let i = 0; i < _this.shopAllList.length; i++) {
                  _this.shopMap.set(
                    _this.shopAllList[i].id,
                    _this.shopAllList[i]
                  )
                }
              }
            }
            resolve(resp)
          })
          .catch(resp => {
            _this.$notify.error(`查询店铺列表失败${resp}`)
          })
      })
    },
    // 修改分配方式
    onChangeDistributionMode (type) {
      this.distributionMode = type
      // if (type === 1) {
      //   this.$nextTick(() => {
      //     this.$refs.storeList.init(true)
      //   })
      // }
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

      if (!/^[0-9]*$/.test(_this.activityModel.coupon_total)) {
        _this.activityModel.coupon_total = 0
        _this.$notify.info('请输入正整数')
      }
      if (_this.storeModel.maxType > 0) {
        if (
          _this.storeModel.remainingQuantity < _this.activityModel.coupon_total
        ) {
          _this.activityModel.coupon_total = 0
          _this.$notify.info('配额不能大于优惠券剩余数量')
        }
      }
      const { type } = _this.activityModel
      const couponTotal = _this.activityModel.coupon_total
      if (type === 0 && this.$refs.storeList) {
        this.$refs.storeList.resetShopCouponNumber(couponTotal)
      }
    },
    changeShopMap (id, shop) {
      // this.activityModel.coupon_total = this.activityModel.coupon_total + shop.shopCouponNumber
      this.shopMap.set(id, shop)
    },
    //  type = 0 返回个位数  type= 1 返回小数
    splitCouponNumber (data, type) {
      const newData = typeof data === 'string' ? data : data.toString()
      var indexOf = newData.indexOf('.')
      if (type === 0) {
        if (indexOf === 0) {
          this.isShowCouponNumber = false
          return newData
        } else {
          this.isShowCouponNumber = true
          return newData.substr(0, indexOf)
        }
      } else {
        return newData.substr(indexOf, newData.length)
      }
    },
    async handleChangeShop (list) {
      this.shopList = list
      const res = await this.findOnlineShopList(
        this.activityModel.coupon_code,
        list.join(',')
      )
      this.$refs.storeList.init(false, res)
    }
  }
}
