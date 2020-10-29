import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  props: {
    subgroupId: {
      type: String
    }
  },
  mixins: [tableMixin],
  data () {
    const pagination = {
      enable: true,
      length: 15,
      sizeOpts: [15, 25, 50, 100],
      start: 1,
      total: 0
    }
    return {
      model: {
        subgroupId: this.subgroupId
      },
      pagination: pagination,
      url: this.$api.guide.querySubgroupMsg
    }
  },
  methods: {},
  mounted: function () {
    this.$reload()
  }
}
