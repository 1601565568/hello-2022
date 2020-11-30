import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [tableMixin],
  props: {
    giftJson: {
      type: String
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      exchangeListDialogVisible: false,
      model: {
        giftJson: null
      },
      url: this.$api.guide.activityCoupon.getCommodityByCoupon
    }
  },
  // created() {
  //   console.log(this.$api.guide.activityCoupon.getCouponListByParam)
  // },
  mounted () {
    this.$reload()
  },
  methods: {
    init (data) {
      // 调用查看商品的init()方法
      window.console.log('gift: ', data)
      // this.model = this.form
      this.model.giftJson = data.giftJson
      this.exchangeListDialogVisible = true
      this.$searchAction$()
    },
    closeDialog () {
      this.model.giftJson = null
      this.exchangeListDialogVisible = false
    }
  }
}
