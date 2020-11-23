import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [tableMixin],
  data () {
    return {
      model: {
        input: '12312313'
      },
      url: this.$api.guide.activityCoupon.mockCoupon
    }
  },
  mounted () {
    this.$reload()
  }
}
