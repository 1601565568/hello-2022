import moment from 'moment'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { getErrorMsg } from '@/utils/toast'
import { head } from 'lodash'
export default {
  name: 'NsTableSgCustomer',
  mixins: [tableMixin],
  props: {
    types: Object
  },
  data: function () {
    var pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var paginations = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    var tableButtons = [
      {
        'func': function (obj) {},
        'icon': '$.noop',
        'name': '\u8be6\u60c5',
        'auth': ``,
        'visible': ``
      },
      {
        'func': function (obj) {
          this.$parent.trackVisible = true
          this.$parent.model.customerName = obj.row.black_type
        },
        'icon': '$.noop',
        'name': '\u8ddf\u8e2a',
        'auth': ``,
        'visible': ``
      }
    ]
    var operateButtons = [
    ]
    var quickInput = [{
      'template': '',
      'inline': false,
      'name': 'customerName',
      'text': '姓名',
      'placeholder': '请输入姓名',
      'type': 'text',
      'value': '',
      'isConvenient': false
    }]
    var quickSearchNames = quickInput.map(x => x.name)
    var quickSearchModel = {}
    // 默认時間为一周
    let endTime = new Date()
    let startTime = new Date()
    startTime.setDate(endTime.getDate() - 7)
    var model = Object.assign({},
      {
        // 高级搜索字段
        operatorName: null,
        intoGuideName: null,
        outGuideName: null,
        transferType: '',
        operationType: null
      },
      {
        timeRange: [startTime, endTime]
      })
    var that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法1
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      // 弹框标题
      title: null,
      // 客户详情列表数据
      customerData: [],
      // 查看详情弹框可见
      showCustomerDialogVisible: false,
      // 客户详情列表loading
      detailLoadingTable: false,
      // 转移记录ID
      transferId: null,
      model: model,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      tableData: null,
      url: this.$api.guide.guide.findTransRecordList,
      _pagination: pagination,
      paginations: paginations,
      _table: {
        table_buttons: tableButtons,
        operate_buttons: operateButtons,
        quickSearchNames: quickSearchNames,
        quickSearchMap: {},
        data: null
      },
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
        ],
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      _queryConfig: {
        expand: false
      }
    }
  },
  /**
   * @msg: 页面挂载初始化
   */
  mounted: function () {
    var _this = this
    _this.$reload()
  },
  components: {},
  methods: {
    /**
     * @msg: 打开弹框
     */
    showListDialog (id) {
      const route = this.$router.resolve({
        name: 'TRANS_CUSTOMER_DETAIL',
        query: {
          taskId: id
        }
      })
      window.open(route.href, '_blank')
      // var _this = this
      // _this.title = '转移会员'
      // _this.showCustomerDialogVisible = true
      // _this.findCustomerDetail(id)
    },
    /**
     * @msg: 查询转移记录转移会员详情
     * @param {long} transferId 转移记录ID
     */
    findCustomerDetail (transferId) {
      var _this = this
      if (transferId) {
        _this.transferId = transferId
      }
      _this.detailLoadingTable = true
      _this.$http.fetch(_this.$api.guide.guide.findCustomerTransRecordList, {
        searchMap: {
          transferId: _this.transferId,
          pageNo: _this.paginations.page,
          pageSize: _this.paginations.size
        }
      }).then(resp => {
        if (resp.success === true && resp.result.data != null) {
          _this.customerData = resp.result.data
          _this._data.paginations.total = parseInt(resp.result.recordsTotal)
          _this.detailLoadingTable = false
        }
      }).catch((resp) => {
        _this.detailLoadingTable = false
        _this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    detailPageChange: function (page) {
      // var _pagination = this._data._pagination
      this.paginations.page = page
      this.findCustomerDetail()
    },
    detailSizeChange: function (size) {
      this.paginations.page = 1
      this.paginations.size = size
      this.findCustomerDetail()
    },
    /**
     * @msg: 关闭自定义转移弹窗
     */
    onCancelDialog () {
      var _this = this
      _this.paginations = {
        enable: true,
        size: 10,
        sizeOpts: [10, 20, 50],
        page: 1,
        total: 0
      }
      _this.customerData = []
      _this.showCustomerDialogVisible = false
    },
    /**
     * @msg: 時間变更
     */
    changeTime (e) {
      // this.model.startTime = moment(e[0]).format('YYYY-MM-DD HH:mm:ss')
      // this.model.endTime = moment(e[1]).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
