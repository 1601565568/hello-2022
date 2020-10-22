import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
import NsGuideDialog from '@/components/NsGuideDialog'
import { API_ROOT } from '@/config/http.js'
export default {
  mixins: [tableMixin],
  components: { NsGuideDialog },
  data () {
    return {
      url: this.$api.dataCenter.userData.list,
      model: {
        startTime: '2020-10-15 18:01:02',
        endTime: '2020-10-21 20:38:02',
        guideId: null,
        pageForm: null, // 页面路径
        systemFrom: null, // 终端
        orderType: 1, // 排序方式 1下载 2发送 3 转发
        isDesc: 0 // 是否倒叙  0正序，1倒序
      },
      time: [],
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
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      overviewdata: {
        avgtime: null,
        guideNum: null,
        visitNum: null
      },
      pageList: [],
      systemFrom: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '小程序'
        },
        {
          value: '2',
          label: '手机端'
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const end = new Date()
      const start = new Date()
      this.model.startTime = moment(
        start.getTime() - 3600 * 1000 * 24 * 7
      ).format('YYYY-MM-DD HH:mm:ss')
      this.model.endTime = moment(end.getTime()).format('YYYY-MM-DD HH:mm:ss')
      this.time = [this.model.startTime, this.model.endTime]
      this.getPage()
      this.overview()
      this.$reload()
    },
    // 页面路径
    getPage () {
      this.$http
        .fetch(this.$api.dataCenter.userData.getPageJSON)
        .then(res => {
          if (res.success) {
            let obj = JSON.parse(res.result)
            var arr = [{
              value: '',
              label: '全部'
            }]
            for (let key in obj) {
              let pageObj = {
                value: key,
                label: obj[key]
              }
              arr.push(pageObj)
            }
            this.pageList = arr
          } else {
            this.$notify.error('访问页面数据获取失败')
          }
        })
        .catch(err => {
          this.$notify.error('访问页面数据获取失败' + err)
        })
    },
    overview () {
      let params = JSON.parse(JSON.stringify(this.model))
      delete params.orderType
      delete params.isDesc
      this.$http.fetch(this.$api.dataCenter.userData.overview, params).then((res) => {
        if (res.success) {
          this.overviewdata = res.result
        } else {
          this.$notify.error('访问概括数据获取失败')
        }
      }).catch((err) => {
        this.$notify.error('访问概括数据获取失败' + err)
      })
    },
    formatTime () {
      this.searchform = {
        ...this.searchform,
        startTime: this.time[0],
        endTime: this.time[1]
      }
      this.handleSearch()
    },
    NsGuideDialog () {
      this.model.guideId = this.model.guideId.join(',')
      this.handleSearch()
    },
    sortChange (data) {
      let order = data.order
      let prop = data.prop
      this.model.isDesc = order === 'descending' ? 0 : order === 'ascending' ? 1 : 0
      this.model.orderType =
        prop === 'countNum' ? 1 : 2
      this.handleSearch()
    },
    handleSearch () {
      this.$search({ searchMap: { ...this.model } })
    },
    exportData (urlLink) {
      var url = API_ROOT + urlLink
      var form = document.createElement('form')
      form.appendChild(this.generateHideElement('startTime', this.model.startTime))
      form.appendChild(this.generateHideElement('endTime', this.model.endTime))
      form.appendChild(this.generateHideElement('pageForm', this.model.pageForm))
      form.appendChild(this.generateHideElement('systemFrom', this.model.systemFrom))
      form.appendChild(this.generateHideElement('guideId', this.model.guideId))
      form.appendChild(this.generateHideElement('orderType', this.model.orderType))
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
