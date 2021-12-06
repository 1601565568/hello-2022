import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
// import ExchangeList from '../../exchangeList'
export default {
  mixins: [tableMixin],
  components: {
    // ExchangeList
  },
  data () {
    let couponTypeList = [
      {
        value: null,
        label: '全部'
      },
      {
        value: 1,
        label: '代金券'
      },
      {
        value: 2,
        label: '折扣券'
      },
      {
        value: 3,
        label: '兑换券'
      }
    ]
    return {
      model: {
        couponTitle: null,
        couponCode: null,
        couponType: null
      },
      url: this.$api.guide.customerCode.findActivityCouponList,
      chooseCouponDialogVisible: false,
      couponTypeList: couponTypeList,
      couponRadio: null,
      couponMessage: null // 优惠券信息
    }
  },
  methods: {
    init () {
      this.chooseCouponDialogVisible = true
      // this.couponRadio = null
      this.model.couponTitle = null
      this.model.couponCode = null
      this.couponRadio = null
      this.$searchAction$()
    },
    closeDialog () {
      this.chooseCouponDialogVisible = false
    },
    // 取消按钮
    cancelDialog () {
      this.couponRadio = null
      this.couponMessage = null
      this.closeDialog()
    },
    // 确认按钮
    confirmDialog () {
      if (!this.couponRadio && !this.couponMessage) {
        this.$notify.error('请选择优惠券')
        return false
      }
      this.$emit('onChangeCoupon', this.couponMessage)
      this.closeDialog()
    },
    // 单选按钮
    getCurrentRow (row) {
      this.couponRadio = row.activityCouponConfigId
      this.couponMessage = row
    },
    onChangeInput () {
      this.$searchAction$()
    },
    // getCommodityByCoupon (row) {
    //   this.$refs.exchange.init(row)
    // },
    getCouponValue (data) {
      let temporaryCouponValue = data
      let temporaryIndex = (temporaryCouponValue !== Math.floor(temporaryCouponValue)) ? (temporaryCouponValue.toString()).split('.')[1].length : 0
      if (temporaryIndex > 1) {
        return (temporaryCouponValue * 10).toFixed(1)
      }
      if (temporaryIndex === 1) {
        return temporaryCouponValue * 10
      }
      if (temporaryIndex === 0) {
        return temporaryCouponValue
      }
    }
  },
  mounted () {
    // this.$reload()
  }
}
