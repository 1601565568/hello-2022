import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import { API_ROOT } from '@/config/http.js'
import $ from 'jquery'
import moment from 'moment'
export default {
  name: 'NsTableGuide',
  mixins: [tableMixin],
  props: {
    url: Object
  },
  data: function () {
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const operateButtons = []
    let quickSearchModel = {}

    let searchModel = {
      operateId: null,
      operateName: null,
      shopId: null,
      accountType: null,
      validTime: null
    }
    return {
      model: searchModel,
      quickSearchModel: quickSearchModel,
      _pagination: pagination,
      _table: {
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      staffFindLists: [],
      shopFindList: [],
      select: true,
      operator: [
        { label: '员工', value: 1 },
        { label: '品牌方', value: 0 },
        { label: '操作人ID', value: 2 }
      ],
      pickerOptions: {
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
      }
    }
  },
  watch: {
    'model.accountType': {
      handler: function (newVal, oldVal) {
        if (newVal === 0 || newVal === 1) {
          this.model.operateId = null
          this.model.operateName = null
        }
        if (newVal === 2) {
          this.model.operateName = null
        }
      }
    }
  },
  mounted: function () {
    var vm = this
    vm.staffFindList()
    if (typeof this.$init === 'function') {
    } else {
      const end = new Date()
      const start = new Date()
      let startTime = moment(
        start.getTime() - 3600 * 1000 * 24 * 90
      ).format('YYYY-MM-DD HH:mm:ss')
      let endTime = moment(end.getTime()).format('YYYY-MM-DD HH:mm:ss')
      this.model.validTime = [startTime, endTime]
      this.$reload()
    }
  },
  computed: {},
  methods: {
    staffFindList () {
      let _this = this
      _this.$http.fetch(_this.$api.guide.guide.getGuideList, {}).then(resp => {
        if (resp.success && resp.result != null) {
          _this.staffFindLists = resp.result
        }
      }).catch((resp) => {
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    handleClose () {
    },
    logList () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      let _this = this
      _this.$http.fetch(_this.$api.guide.guide.loginLogFindList, _this.$generateParams$()).then(resp => {
        // let time = this._data._table.searchMap.validTime
        const that = this
        const tableConfig = this._data._table
        tableConfig.loadingtable = true
        that._data._table.data = resp.result.data
        that._data._pagination.total = parseInt(resp.result.recordsTotal)
        if (that._data._pagination.total > 0) {
          that._data._table.key = 1
        } else if (that._data._pagination.total === 0) {
          that._data._table.key = 2
        }
      }).catch((err) => {
        if (err && err.msg) {
          that.$notify.error(err.msg)
        } else {
          that.$notify.error('网络异常，获取数据失败！')
        }
      }).finally(() => {
        this._data._table.loadingtable = false
      })
    },
    // 导出日志
    excel () {
      var url = API_ROOT + '/test'
      var form = document.createElement('form')
      form.appendChild(
        this.generateHideElement('validTime', this._data._table.searchMap.validTime)
      )
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
    }
  }
}
