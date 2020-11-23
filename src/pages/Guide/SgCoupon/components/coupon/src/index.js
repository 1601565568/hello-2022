import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [tableMixin],
  data () {
    let couponList = [
      {
        value: '',
        label: '全部'
      },
      {
        value: '1',
        label: '现金券'
      },
      {
        value: '2',
        label: '折扣券'
      },
      {
        value: '3',
        label: '兑换券'
      }
    ]
    return {
      model: {},
      url: this.$api.guide.activityCoupon.mockCoupon,
      chooseCouponDialogVisible: false,
      couponList: couponList,
      couponRadio: null,
      couponMessage: null // 优惠券信息
    }
  },
  methods: {
    init () {
      this.chooseCouponDialogVisible = true
    },
    closeDialog () {
      this.chooseCouponDialogVisible = !this.chooseCouponDialogVisible
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
    onChangeCardType () {
      console.log('123123123')
      // 改变事件调用
      // this.$searchAction$()
    },
    // 单选按钮
    getCurrentRow (row, index) {
      this.couponRadio = index
      this.couponMessage = row
    },
    onChangeInput () {
      console.log('123123123')
      // 改变事件调用
      // this.$searchAction$()
    }
  },
  mounted () {
    this.$reload()
  }
}
