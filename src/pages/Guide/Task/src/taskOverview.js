import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElDrawer from '@nascent/nui/lib/drawer'
import drawerTable from '../drawerTable'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import { getErrorMsg } from '@/utils/toast'
import moment from 'moment'
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
      length: 15,
      sizeOpts: [15, 25, 50, 100],
      start: 1,
      total: 0
    }
    const tableButtons = [
      {
        func: function (data) {
          this.drawerVisible = true
          this.shopId = data.row.shopId
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
        loadingtable: true,
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      queryConfig: {
        expand: false
      },
      tableData: [],
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
      searchMap: {
        shopId: null
      },
      drawerVisible: false,
      selectMaterial: {},
      id: null,
      shopId: null
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
    },
    // 分页
    pageChange (data) {
      this.pagination.start = data
      this.queryTaskShopInfo()
    },
    sizeChange (data) {
      this.pagination.length = data
      this.queryTaskShopInfo()
    },
    handleVisibleChange () {
      this.pagination.start = 0
      this.queryTaskShopInfo()
    },
    queryTimeChange () {
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
            if (this.taskMsg.runType === 1) {
              const start = new Date()
              this.searchMap.queryTime = moment(start.getTime() - 3600 * 1000 * 24).format('YYYY-MM-DD')
            }
            // 素材任务时
            if (obj.materialId) {
              this.taskMsg.materialId = obj.materialId
              this.taskMsg.materialTitle = obj.materialTitle
              this.taskMsg.materialType = obj.materialType
              this.taskMsg.materialMsg = obj.materialMsg ? JSON.parse(obj.materialMsg) : null
            }
          }
          this.queryTaskShopInfo()
        })
        .catch(resp => {
          console.log('查看完整任务失败', resp)
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
      this.table.loadingtable = true
      let params = {
        searchMap: {
          ...this.searchMap,
          taskId: this.id
        },
        length: this.pagination.length,
        start: this.pagination.start
      }
      this.$http
        .fetch(this.$api.guide.taskQueryTaskShopInfo, params)
        .then(resp => {
          if (resp.success) {
            var result = resp.result
            this.pagination.total = parseInt(result.recordsTotal)
            this.tableData = result.data
            this.table.loadingtable = false
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('进度统计列表查询失败', resp))
        })
    }
  },
  mounted: function () {
    this.init()
  }
}
