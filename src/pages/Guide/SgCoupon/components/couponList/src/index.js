import Coupon from '../../coupon'
import StoreList from '../../storeList'
export default {
  components: {
    Coupon,
    StoreList
  },
  data () {
    let bgCoupon = 'https://hb3-shopguide.oss-cn-zhangjiakou.aliyuncs.com/ECRP-SG-APP-WEB/img/no-coupon.png'
    let activityModel = {
      type: 0,
      coupon_id: null,
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
      remainingQuantity: null // 优惠券剩余数量
    }
    return {
      forbidden: false, // 默认保存
      addCouponDialogVisible: true,
      activityModel: activityModel,
      storeModel: storeModel,
      storeCouponList: null, // 店铺优惠券列表
      storeCouponListLength: 0,
      bgcoupon: bgCoupon
    }
  },
  methods: {
    // 关闭新增弹窗
    closeDialog () {
      this.addCouponDialogVisible = !this.addCouponDialogVisible
    },
    onSaveActivityCoupon () {
      this.closeDialog()
    },
    // 打开优惠券弹窗
    onOpenCoupon () {
      this.$refs.Coupon.init()
    },
    // 获取优惠券信息
    getCouponMessage (data) {
      console.log(data)
    },
    // 修改分配方式
    onChangeDistributionMode (data) {
      console.log(data)
    }
  }
}
