import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
import NsGuideDialog from '@/components/NsGuideDialog'
import { API_ROOT } from '@/config/http.js'
import LocalStorage from 'store/dist/store.legacy.min.js'
export default {
  mixins: [tableMixin],
  components: { NsGuideDialog },
  data () {
    return {
      url: this.$api.guide.materialAnalysis.getListById,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
          // {
          //   text: '最近三个月',
          //   onClick (picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          //     picker.$emit('pick', [start, end])
          //   }
          // }
        ]
      },
      model: {
        startTime: '',
        endTime: '',
        materialId: this.$route.params.targetId,
        guideId: '',
        orderType: '1', // 排序方式 1下载 2发送 3 转发
        isDesc: '1' // 是否倒叙  2正序，1倒序
      },
      time: [],
      employeeIdShow: 1 // 1 企微  2个号
    }
  },
  mounted () {
    this.init()
  },
  beforeRouteLeave (to, from, next) {
    LocalStorage.remove('guideId')
    next()
  },
  destroyed () {
    LocalStorage.remove('guideId')
  },
  methods: {
    init () {
      this.model.guideId = LocalStorage.get('guideId')
      if (!this.model.guideId) {
        this.model.guideId = []
      }
      const end = new Date()
      const start = new Date()
      this.model.startTime = moment(
        start.getTime() - 3600 * 1000 * 24 * 7
      ).format('YYYY-MM-DD HH:mm:ss')
      this.model.endTime = moment(end.getTime()).format('YYYY-MM-DD HH:mm:ss')
      this.time = [this.model.startTime, this.model.endTime]
      this.getMemberManagePlan()
      this.handleSearch()
    },
    getMemberManagePlan () {
      this.$http
        .fetch(this.$api.guide.materialAnalysis.getMemberManagePlan)
        .then(res => {
          if (res.success) {
            this.employeeIdShow = res.result
          } else {
            this.$notify.error('获取系统方案失败')
          }
        })
        .catch(err => {
          this.$notify.error('获取系统方案失败' + err)
        })
    },
    handleSearch () {
      if (this.model.guideId) {
        let guideId = this.model.guideId.join(',')
        this.$search({ searchMap: { ...this.model, guideId: guideId } })
      } else {
        this.$search({ searchMap: { ...this.model } })
      }
    },
    formatTime () {
      this.model = {
        ...this.model,
        startTime: this.time[0],
        endTime: this.time[1]
      }
      this.handleSearch()
    },
    // table表格排序
    sortChange (data) {
      let order = data.order
      let prop = data.prop
      this.model.isDesc =
        order === 'descending' ? '1' : order === 'ascending' ? '2' : '1'
      this.model.orderType =
        prop === 'sendCount' ? '3' : prop === 'shareCount' ? '2' : '1'
      this.handleSearch()
    },
    NsGuideDialog () {
      this.handleSearch()
    },

    exportData (urlLink) {
      var url = API_ROOT + urlLink
      var form = document.createElement('form')
      form.appendChild(
        this.generateHideElement('startTime', this.model.startTime)
      )
      form.appendChild(this.generateHideElement('endTime', this.model.endTime))
      form.appendChild(
        this.generateHideElement('materialId', this.model.materialId)
      )
      form.appendChild(this.generateHideElement('guideId', this.model.guideId))
      form.appendChild(
        this.generateHideElement('orderType', this.model.orderType)
      )
      form.appendChild(this.generateHideElement('isDesc', this.model.isDesc))
      form.setAttribute('action', url)
      form.setAttribute('method', 'get')
      document.body.appendChild(form)
      form.submit()
    },
    generateHideElement (name, value) {
      var tempInput = document.createElement('input')
      tempInput.type = 'hidden'
      tempInput.name = name
      tempInput.value = value
      return tempInput
    }
  }
}
