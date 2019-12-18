import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  name: 'NsTableCouponDetail',
  mixins: [tableMixin],
  props: {
    types: Object,
    department: Array,
    role: Array
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    return {
      shopId: '',
      couponId: '',
      model: { coupon_state: '',
        send_status: '',
        out_nick: '',
        shop_id: '',
        coupon_id: '' },
      url: this.$api.marketing.coupon.queryCouponDetail,
      _pagination: pagination,
      _table: {
        quickSearchMap: {}
      },
      _queryConfig: {
        expand: false
      }
    }
  },

  mounted: function () {},
  components: {},
  methods: {}
}
