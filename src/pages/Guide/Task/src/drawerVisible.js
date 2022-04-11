import scrollHeight from '@nascent/ecrp-ecrm/src/mixins/scrollHeight'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsPreview from '@/components/NsPreview'
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
    }
  },
  mixins: [tableMixin, scrollHeight],
  components: {
    NsPreview
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
          console.log(data, 'data')
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
      totalNum: 0, // 任务分配导购总数
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
            this.totalNum = parseInt(resp.result.recordsTotal)
          }
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('查看店铺任务详情失败', resp))
        })
    },
    exportData () {
      var url = API_ROOT + '/guide/task/exportGuideCompleteData'
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('type', 1))
      form.appendChild(this.generateHideElement('taskId', this.id))
      form.appendChild(this.generateHideElement('shopId', this.shopId))
      form.appendChild(this.generateHideElement('queryTime', this.form.time))
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
