import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      url: this.$api.guide.lbs.findGroupList,
      model: {
        shopIds: []
      },
      activeType: 'shop' // 选中的数据 shop: 门店  employee：成员
    }
  },
  mixins: [tableMixin],
  methods: {
    handleChangeType (activeType) {
      this.activeType = activeType
      console.log(this.activeType)
    }
  }
}
