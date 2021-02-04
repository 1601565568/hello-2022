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
      activeType: 'shop', // 选中的数据 shop: 门店  employee：成员
      // 时间筛选
      dateList: [
        {
          label: '昨天',
          value: '1day'
        }, {
          label: '近7天',
          value: '7day'
        }, {
          label: '近30天',
          value: '30day'
        }
      ],
      // 时间选择的值
      dateValue: 'all'
    }
  },
  mixins: [tableMixin],
  methods: {
    // 返回上一页
    handleBack () {
      this.$router.go(-1)
    },
    handleChangeType (activeType) {
      this.activeType = activeType
    }
  }
}
