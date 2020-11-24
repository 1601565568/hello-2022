import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  mixins: [tableMixin],
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      exchangeListDialogVisible: true,
      model: {},
      url: this.$api.guide.activityCoupon.mockCoupon
    }
  },
  mounted () {
    this.$reload()
  },
  methods: {
    init () {
      // 调用查看商品的init()方法
      this.model = this.form
      this.$searchAction$()
    }
  }
}
