import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [tableMixin],
  data () {
    return {
      model: {
        // length: _data._pagination.sizeOpts,
        // start: _data.paginations.sizeOpts * (_data.paginations.page - 1),
        storeCouponCode: null,
        isOnline: 0
      },
      url: this.$api.guide.activityCoupon.findCouponShop
    }
  },
  props: {
    couponCode: {
      type: String
    }
  },
  methods: {
    init () {
      this.model.storeCouponCode = this.couponCode
      this.$searchAction$()
    }
    // this.$reload()
  }
}
