import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsPreview from '@/components/NsPreview'
import ElDrawer from '@nascent/nui/lib/drawer'
import drawerClient from '../drawerClient'
import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'
import moment from 'moment'
export default {
  props: {
    id: {
      type: String
    },
    shopId: {
      type: String
    },
    shopName: {
      type: String
    },
    runType: {
      type: Number
    },
    queryTime: {
      type: String
    },
    taskName: {
      type: String
    }
  },
  mixins: [tableMixin, scrollHeight],
  components: {
    NsPreview,
    ElDrawer,
    drawerClient
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
        func: function (data) {
          this.drawerVisible = true
          this.guideName = data.row.name
          this.guideId = data.row.guideId
        },
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
      guideId: null,
      guideName: null,
      drawerVisible: false,
      isHaveGroup: 0,
      // 页面滚动条内容高度配置
      scrollBarDeploy: {
        ref: 'fullScreen', // 页面滚动条ref的名称
        excludeHeight: 0
      },
      model: model,
      rules: Object.assign({}, {}, {}),
      url: '',
      // eslint-disable-next-line vue/no-reserved-keys
      pagination: pagination,
      // eslint-disable-next-line vue/no-reserved-keys
      table: {
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
      finishedCount: 0, // 完成数量
      tableData: [],
      name: null,
      type: null,
      extData: {}
    }
  },
  methods: {
    onSearch () {
    },
    init () {
      this.name = this.shopName
      this.type = this.runType
      if (this.runType === 1) {
        this.form.time = this.queryTime
      }
      this.queryShopTaskDetail()
    },
    $currentChange$ (data) {
      this.pagination.page = data
      this.queryShopTaskDetail()
    },
    $sizeChange$ (data) {
      this.pagination.size = data
      this.queryShopTaskDetail()
    },
    queryTimeChange () {
      if (this.form.time) {
        this.form.time = moment(this.form.time).format('YYYY-MM-DD')
      }
      this.queryShopTaskDetail()
    },
    queryShopTaskDetail () {
      const params = {
        searchMap: {}
      }
      params.searchMap.taskId = this.id
      params.searchMap.shopId = this.shopId
      params.searchMap.queryDate = this.form.time
      params.searchMap.pageStart = (this.pagination.page - 1) * this.pagination.size
      params.searchMap.pageSize = this.pagination.size
      this.$http
        .fetch(this.$api.guide.queryShopTaskDetail, params)
        .then(resp => {
          if (resp.success) {
            this.extData = resp.result.draw && resp.result.ext
            this.isHaveGroup = resp.result.draw
            this.tableData = resp.result.data
            this.pagination.total = parseInt(resp.result.recordsTotal)
            this.finishedCount = parseInt(resp.result.recordsFiltered)
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查看店铺任务详情失败', resp))
        })
    },
    exportData () {
      if (this.tableData.length === 0) {
        this.$notify.error('当前没有匹配的数据项')
        return
      }
      const sendParams = {
        taskId: this.id,
        exportType: 52,
        shopId: this.shopId,
        shopName: this.name,
        taskName: this.taskName,
        queryDate: this.queryTime
      }
      this.$http
        .fetch(this.$api.guide.task.exportExcel, sendParams)
        .then((resp) => {
          this.$notify.success('文件已导入下载中心')
        })
        .catch((resp) => {
          this.$notify.error(resp.msg || '导出报错，请联系管理员')
        })
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
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
