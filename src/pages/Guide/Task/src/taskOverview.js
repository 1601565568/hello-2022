import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElDrawer from '@nascent/nui/lib/drawer'
import drawerTable from '../drawerTable'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import { getErrorMsg } from '@/utils/toast'
// import { init } from '@sentry/browser'
export default {
  mixins: [tableMixin],
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElDrawer,
    drawerTable,
    ShopSelectLoad
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
        func: function () {
          this.drawerVisible = true
        },
        icon: '$.noop',
        name: '查看详情',
        auth: '',
        visible: ''
      }
    ]

    const model = Object.assign(
      {},
      {
        taskType: '',
        state: '',
        taskName: ''
      },
      {}
    )
    return {
      model: model,
      rules: Object.assign({}, {}, {}),
      url: '',
      pagination: pagination,
      table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      queryConfig: {
        expand: false
      },
      form: {
        store: '',
        time: '',
        executionTimes: 1,
        taskType: 1,
        executiveStore: 1,
        memberGroup: '1',
        taskBrief: ''
      },
      tableData: [],
      options: [
        {
          value: '1',
          label: '门店1'
        },
        {
          value: '2',
          label: '门店2'
        },
        {
          value: '3',
          label: '门店3'
        },
        {
          value: '4',
          label: '门店4'
        },
        {
          value: '5',
          label: '门店5'
        }
      ],
      taskMsg: {
        name: '',
        type: 0,
        startTime: '',
        endTime: '',
        remark: '',
        shopRangeType: 0,
        runType: 0,
        viewId: '',
        viewName: '',
        subgroupId: '',
        subgroupName: '',
        shopNum: 0,
        guideNum: 0,
        completion: 0
      },
      drawerVisible: false,
      selectMaterial: {},
      id: null
    }
  },
  methods: {
    onSearch () {
      // console.log('搜索响应')
    },
    init () {
      this.id = this.$route.params.id
      this.queryTask()
      this.queryProgressStatistics()
      this.queryTaskShopInfo()
    },
    // 分页
    pageChange (data) {
      this.pagination.page = data
      this.queryTaskShopInfo()
    },
    sizeChange (data) {
      this.pagination.size = data
      this.queryTaskShopInfo()
    },
    queryTask () {
      this.$http
        .fetch(this.$api.guide.queryTask, { taskId: parseInt(this.id) })
        .then(resp => {
          if (resp.success) {
            var obj = resp.result
            this.taskMsg.id = obj.id
            this.taskMsg.type = obj.type
            this.taskMsg.runType = obj.runType
            this.taskMsg.remark = obj.remark
            this.taskMsg.name = obj.name
            this.taskMsg.startTime = obj.startTime
            this.taskMsg.endTime = obj.endTime
            this.taskMsg.viewId = obj.viewId
            this.taskMsg.subgroupId = obj.subgroupId
            this.taskMsg.state = obj.state
            // 指定门店
            if (obj.targetIds === '0') {
              this.taskMsg.shopRangeType = 0
            } else {
              this.taskMsg.shopRangeType = 1
            }
            // 素材任务时
            if (obj.materialId) {
              this.taskMsg.materialId = obj.materialId
              this.taskMsg.materialTitle = obj.materialTitle
            }
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查看完整任务失败', resp))
          this.$router.push('/Guide/Task/List')
        })
    },
    queryProgressStatistics () {
      this.$http
        .fetch(this.$api.guide.queryProgressStatistics, {
          taskId: parseInt(this.id)
        })
        .then(resp => {
          console.log(resp)
          if (resp.success) {
            var result = resp.result
            this.taskMsg.shopNum = result.shopNum
            this.taskMsg.guideNum = result.guideNum
            this.taskMsg.completion = result.completion
          }
        })
        .catch(resp => {
          console.log(resp)
          this.$notify.error(getErrorMsg('进度统计查询失败', resp))
        })
    },
    queryTaskShopInfo () {
      let params = {
        searchMap: {
          taskId: this.id
        },
        size: this.pagination.size,
        page: this.pagination.page
      }
      this.$http
        .fetch(this.$api.guide.taskQueryTaskShopInfo, params)
        .then(resp => {
          if (resp.success) {
            var result = resp.result
            this.pagination.total = parseInt(result.recordsTotal)
            this.tableData = result.data
          }
        })
        .catch(resp => {
          console.log(resp)
          this.$notify.error(getErrorMsg('进度统计列表查询失败', resp))
        })
    }
  },
  mounted: function () {
    this.init()
  }
}
