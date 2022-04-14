import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ElBreadcrumb from '@nascent/nui/lib/breadcrumb'
import NsPreview from '@/components/NsPreview'
import ElBreadcrumbItem from '@nascent/nui/lib/breadcrumb-item'
import ElDrawer from '@nascent/nui/lib/drawer'
import drawerTable from '../drawerTable'
import ShopSelectLoad from '@/components/ShopSelectLoad'
import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'
import moment from 'moment'
export default {
  mixins: [tableMixin],
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElDrawer,
    drawerTable,
    ShopSelectLoad,
    NsPreview
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
      completionProgress: '-',
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
      unfinishedTotal: 0,
      searchMap: {
        runType: null,
        taskId: null
      },
      drawerVisible: false,
      selectMaterial: {},
      id: null,
      shopId: null,
      shopName: null,
      runType: null,
      queryTime: null,
      createShopName: null
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
    onSearch () {
    },
    init () {
      // this.id = this.$route.params.id
      // this.queryTask()
      const { createShopName, runType, id, shopId } = this.$route.query
      this.searchMap = {
        runType,
        taskId: id,
        shopId
      }
      this.createShopName = createShopName
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
    },
    queryTask () {
      this.$http
        .fetch(this.$api.guide.queryTask, { taskId: this.searchMap.taskId, shopId: this.searchMap.shopId })
        .then(resp => {
          if (resp.success) {
            const obj = resp.result
            const taskMsg = {
              id: obj.id,
              type: obj.type,
              runType: obj.runType,
              remark: obj.remark,
              name: obj.name,
              startTime: obj.startTime,
              endTime: obj.endTime,
              viewId: obj.viewId,
              subgroupId: obj.subgroupId,
              state: obj.state,
              shopRangeType: obj.targetIds === '0' ? 0 : 1 // 指定门店
            }
            if (obj.runType === 1) {
              let start = new Date(new Date(new Date().toLocaleDateString()).getTime()) // 当天0点
              // let todatEnd = new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1) // 当天23:59
              // const start = new Date()
              if (new Date(obj.startTime) > start) {
                this.searchMap.queryTime = moment(obj.startTime).format('YYYY-MM-DD')
              } else if (new Date(obj.startTime) <= start && start <= new Date(obj.endTime)) {
                this.searchMap.queryTime = moment(start.getTime()).format('YYYY-MM-DD')
              } else {
                this.searchMap.queryTime = moment(obj.endTime).format('YYYY-MM-DD')
              }
            }
            // 素材任务时
            if (obj.materialId) {
              taskMsg.materialId = obj.materialId
              taskMsg.materialTitle = obj.materialTitle
              taskMsg.materialType = obj.materialType
              taskMsg.materialMsg = obj.materialMsg ? JSON.parse(obj.materialMsg) : null
            }
            this.taskMsg = taskMsg
          }
          this.queryTaskShopInfo()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查看完整任务失败', resp))
          this.$router.push('/Guide/Task/List')
        })
    },
    queryTaskShopInfo () {
      this.table.loadingtable = true
      let params = {
        searchMap: this.searchMap,
        length: this.pagination.length,
        start: (this.pagination.start - 1) * this.pagination.length
      }
      this.$http
        .fetch(this.$api.guide.queryShopTaskExecution, params)
        .then(resp => {
          if (resp.success) {
            const result = resp.result
            this.pagination.total = parseInt(result.recordsTotal)
            this.tableData = result.data
            this.unfinishedTotal = result.ext.unfinishedTotal
            this.completionProgress = result.ext.completionProgress
            this.table.loadingtable = false
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('进度统计列表查询失败', resp))
        })
    },
    // 导出csv文件
    exportShopCompleteData () {
      var url = API_ROOT + '/guide/task/shopCompleteDataExport'
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('taskId', this.searchMap.taskId))
      if (this.taskMsg.runType === 1) {
        form.appendChild(this.generateHideElement('queryTime', this.searchMap.queryTime))
      }
      form.appendChild(this.generateHideElement('shopId', this.searchMap.shopId))
      form.appendChild(this.generateHideElement('shopName', this.createShopName))
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
    compareState (task) {
      const date = task.completeTime
      const startTime = new Date(task.startTime).getTime()
      const endTime = new Date(task.endTime).getTime()
      const nowDate = new Date().getTime()
      if (nowDate < startTime) {
        return '未开始'
      }
      if (nowDate >= startTime && nowDate <= endTime) {
        if (date) {
          return '已完成'
        }
        return '执行中'
      }
      if (nowDate >= endTime) {
        if (date) {
          return '已完成'
        }
        return '未完成'
      }
    },
    formatUrlJson (urlJson) {
      let arr = urlJson.split(',')
      if (arr.length <= 5) {
        return arr
      } else {
        return arr.slice(0, 5)
      }
    },
    onShowPic (urlJson) {
      let arr = urlJson.split(',')
      this.$refs.NsPreview.toggleShow(0, arr)
    }
  },
  mounted: function () {
    this.init()
  }
}
