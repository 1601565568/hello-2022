import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  props: {
    subgroupId: {
      type: String
    },
    formSource: { // 1 新增进入 2 报表进入
      default: 1
    },
    time: {
      type: String
    },
    runType: {
      type: String | Number
    },
    taskId: {
      type: String | Number
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
        subgroupId: this.subgroupId,
        runType: this.runType,
        time: this.time,
        taskId: this.taskId
      },
      pagination: pagination
    }
  },
  computed: {
    url () {
      return this.formSource === 2 ? this.$api.guide.queryDetailSubgroupMsg : this.$api.guide.querySubgroupMsg
    }
  },
  watch: {
    time (newVal) {
      this.model.time = newVal
      this.$searchAction$()
    }
  },
  methods: {},
  mounted: function () {
    this.$reload()
  }
}
