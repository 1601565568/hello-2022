import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElDrawer from '@nascent/nui/lib/drawer'
import drawerTable from '../drawerTable'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'
import lookCardList from '../lookCardList'
import Preview from '@/components/NsPreview'
import moment from 'moment'
import AddMaterial from '../addMaterial'
import materialDialog from '../materialDialog'
// import { init } from '@sentry/browser'
export default {
  mixins: [tableMixin],
  components: {
    Preview,
    ElBreadcrumb,
    materialDialog,
    AddMaterial,
    ElBreadcrumbItem,
    ElDrawer,
    drawerTable,
    ShopSelectLoad,
    lookCardList
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
          this.shopName = data.row.shopName
          this.runType = this.taskMsg.runType
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
      dialogFlag: false,
      listMap: {},
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
        shopId: null,
        queryTime: null
      },
      drawerVisible: false,
      selectMaterial: {},
      id: null,
      shopId: null,
      shopName: null,
      runType: null,
      queryTime: null,
      dialogVisible: false,
      taskTime: '',
      isCrm: false
    }
  },
  computed: {
    pickerOptions () {
      const { startTime, endTime } = this.taskMsg
      return {
        disabledDate (time) {
          if (!startTime || !endTime) {
            return true
          } else {
            return new Date(startTime).getTime() > time.getTime() || new Date(endTime).getTime() < time.getTime()
          }
        }
      }
    }
  },
  methods: {
    togglePreview (current, list, type) {
      this.$refs.preview.toggleShow(current, list, type, true)
    },
    subNumber (type, data) {
      if (type === 0) {
        return data && data.some(item => item.type === 0 || item.type === 1)
      } else {
        return data && data.some(item => item.type === type)
      }
    },
    onSearch () {
    },
    dialogClick (row) {
      this.dialogFlag = true
      this.listMap = row
    },
    init () {
      this.id = this.$route.params.id
      this.queryTask()
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
      this.pagination.start = 1
      this.queryTaskShopInfo()
    },
    queryTimeChange () {
      if (!this.searchMap.queryTime) {
        this.$notify.error('请选择日期')
        return
      }
      this.queryTaskShopInfo()
      this.queryProgressStatistics()
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
            this.taskMsg.subGroupName = obj.subGroupName
            this.taskMsg.subGroupId = obj.subgroupId
            // 指定门店
            if (obj.targetIds === '0') {
              this.taskMsg.shopRangeType = 0
            } else {
              this.taskMsg.shopRangeType = 1
            }
            // 1 循环任务  0 一次性任务
            if (this.taskMsg.runType === 1) {
              let start = new Date(new Date(new Date().toLocaleDateString()).getTime()) // 当天0点
              // let todatEnd = new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1) // 当天23:59
              // const start = new Date()
              if (new Date(obj.startTime) >= start) {
                this.searchMap.queryTime = moment(obj.startTime).format('YYYY-MM-DD')
                this.taskTime = moment(obj.startTime).format('YYYY-MM-DD HH:mm:ss')
              } else if (new Date(obj.startTime) < start && start < new Date(obj.endTime)) {
                this.searchMap.queryTime = moment(start.getTime() - 3600 * 1000 * 24).format('YYYY-MM-DD')
                this.taskTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
              } else {
                this.searchMap.queryTime = moment(obj.endTime).format('YYYY-MM-DD')
                this.taskTime = moment(obj.endTime).format('YYYY-MM-DD HH:mm:ss')
              }
            }
            // 素材任务时
            if (obj.materialId) {
              this.taskMsg.materialId = obj.materialId
              this.taskMsg.materialTitle = obj.materialTitle
              this.taskMsg.materialContent = obj.materialContent
              this.taskMsg.materialType = obj.materialType
              this.taskMsg.materialMsg = obj.materialMsg ? JSON.parse(obj.materialMsg) : null
            }
            this.queryProgressStatistics()
          }
          this.queryTaskShopInfo()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查看完整任务失败', resp))
          this.$router.push('/Guide/Task/List')
        })
    },
    queryProgressStatistics () {
      var queryTime = this.searchMap.queryTime
      this.$http
        .fetch(this.$api.guide.queryProgressStatistics, {
          taskId: parseInt(this.id),
          queryDate: queryTime
        })
        .then(resp => {
          if (resp.success) {
            var result = resp.result
            this.taskMsg.shopNum = result.shopNum
            this.taskMsg.guideNum = result.guideNum
            this.taskMsg.completion = result.completion
          }
        })
        .catch(resp => {
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
        start: (this.pagination.start - 1) * this.pagination.length
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
    },
    // 导出导购完成明细csv文件
    exportGuideCompleteData () {
      var url = API_ROOT + '/guide/task/guideCompleteDataExport'
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('taskId', this.id))
      form.appendChild(this.generateHideElement('queryTime', this.searchMap.queryTime))
      form.setAttribute('action', url)
      form.setAttribute('method', 'post')
      document.body.appendChild(form)
      form.submit()
    },
    // 导出csv文件
    exportShopCompleteData () {
      var url = API_ROOT + '/guide/task/exportShopCompleteData'
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('taskId', this.id))
      form.appendChild(this.generateHideElement('queryTime', this.searchMap.queryTime))
      form.appendChild(this.generateHideElement('shopId', this.searchMap.shopId))
      form.setAttribute('action', url)
      form.setAttribute('method', 'post')
      document.body.appendChild(form)
      form.submit()
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    },
    // 查看分组名称弹框
    showSubgroupMsg () {
      this.dialogVisible = true
    }
  },
  mounted: function () {
    const crm = localStorage.getItem('USER_LOCAL_COMPANY_PLAN')
    this.isCrm = crm === '1'
    this.init()
  }
}
