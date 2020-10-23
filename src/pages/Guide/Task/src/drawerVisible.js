import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
export default {
  props: {
    id: {
      type: String
    },
    shopId: {
      type: String
    }
  },
  mixins: [tableMixin, scrollHeight],
  components: {
  },
  data () {
    const pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        func: function () {},
        icon: '$.noop',
        name: '查看详情',
        auth: '',
        visible: ''
      }
    ]

    const model = Object.assign({},
      {
        taskType: '',
        state: '',
        taskName: ''
      },
      {})
    return {
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 0
      },
      model: model,
      rules: Object.assign({}, {}, {}),
      url: '',
      // eslint-disable-next-line vue/no-reserved-keys
      _pagination: pagination,
      // eslint-disable-next-line vue/no-reserved-keys
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      // eslint-disable-next-line vue/no-reserved-keys
      _queryConfig: {
        expand: false
      },
      form: {
        time: ''
      },
      totalNum: 0, // 任务分配导购总数
      finishedCount: 0, // 完成数量
      tableData: []
    }
  },
  methods: {
    onSearch () {
    },
    init () {
      this.queryShopTaskDetail()
    },
    queryShopTaskDetail () {
      const params = {}
      params.taskId = this.id
      params.shopId = this.shopId
      this.$http
        .fetch(this.$api.guide.queryShopTaskDetail, params)
        .then(resp => {
          if (resp.success) {
            this.tableData = resp.result
            this.totalNum = resp.result.length
            resp.result.forEach(obj => {
              if (obj.state < 3) {
                this.finishedCount++
              }
            })
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查看店铺任务详情失败', resp))
        })
    }
  },
  mounted: function () {
    this.init()
  }
}
