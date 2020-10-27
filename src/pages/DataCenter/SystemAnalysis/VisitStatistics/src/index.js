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
        startTime: '',
        endTime: '',
        guideId: [],
        pageForm: [''], // 页面路径
        systemFrom: '', // 终端
        orderType: '1', // 排序方式 1下载 2发送 3 转发
        isDesc: '0' // 是否倒叙  0正序，1倒序
      },
      time: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '昨天',
            onClick (picker) {
              let start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              ) // 当天0点
              let end = new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
              ) // 当天23:59
              let laststart = new Date(start.getTime() - 3600 * 1000 * 24)
              let lastend = new Date(end.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [laststart, lastend])
            }
          },
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
        ]
      },
      overviewdata: {
        avgtime: null,
        guideNum: null,
        visitNum: null
      },
      pageList: [
        {
          value: '',
          label: '不限'
        }
      ],
      systemFrom: [
        {
          value: '',
          label: '不限'
        },
        {
          value: '1',
          label: '小程序端'
        },
        {
          value: '2',
          label: '导购手机'
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
      // this.getPage()
      this.overview()
      this.findTrackPageBizTypeList()
      this.handleSearch()
    },
    systemFromSearch () {
      this.model.pageForm = ['']
      this.pageList = [
        {
          value: '',
          label: '不限'
        }
      ]
      this.findTrackPageBizTypeList()
      this.handleSearch()
    },
    handlepageFormSearch (data) {
      var lable
      if (data && data.length > 1) {
        lable = data[data.length - 1]
        var index = data.findIndex(item => {
          return item === ''
        })
        if (lable === '' || !lable) {
          this.model.pageForm = ['']
        } else {
          if (index >= 0) {
            this.model.pageForm.splice(index, 1)
          }
        }
      }
      this.handleSearch()
    },
    findTrackPageBizTypeList () {
      var params = {
        terminalTypes: this.model.systemFrom
      }
      this.$http
        .fetch(this.$api.dataCenter.userData.findTrackPageBizTypeList, params)
        .then(res => {
          this.pageList = this.pageList.concat(res.result)
        })
        .catch(() => {
          this.$notify.error('获取页面路径错误')
        })
    },
    overview () {
      let params = JSON.parse(JSON.stringify(this.model))
      delete params.orderType
      delete params.isDesc
      let param = {
        ...params,
        guideId: params.guideId.join(','),
        pageForm: params.pageForm.join(',')
      }
      this.$http
        .fetch(this.$api.dataCenter.userData.overview, param)
        .then(res => {
          if (res.success) {
            this.overviewdata = res.result
          } else {
            this.$notify.error('访问概括数据获取失败')
          }
        })
        .catch(err => {
          this.$notify.error('访问概括数据获取失败' + err)
        })
    },
    formatTime () {
      this.model = {
        ...this.model,
        startTime: this.time[0],
        endTime: this.time[1]
      }
      this.handleSearch()
    },
    NsGuideDialog () {
      this.handleSearch()
    },
    sortChange (data) {
      let order = data.order
      let prop = data.prop
      this.model.isDesc =
        order === 'descending' ? '1' : order === 'ascending' ? '2' : '1'
      this.model.orderType = prop === 'countNum' ? '1' : '2'
      this.handleSearch()
    },
    handleSearch () {
      let params = JSON.parse(JSON.stringify(this.model))
      let param = {
        ...params,
        guideId: params.guideId.join(','),
        pageForm: params.pageForm.join(',')
      }
      this.$search({ searchMap: { ...param } })
    },
    exportData (urlLink) {
      var url = API_ROOT + urlLink
      var form = document.createElement('form')
      form.appendChild(
        this.generateHideElement('startTime', this.model.startTime)
      )
      form.appendChild(this.generateHideElement('endTime', this.model.endTime))
      form.appendChild(
        this.generateHideElement('pageForm', this.model.pageForm)
      )
      form.appendChild(
        this.generateHideElement('systemFrom', this.model.systemFrom)
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
