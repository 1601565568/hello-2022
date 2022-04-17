import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import $ from 'jquery'
import PageTable from '@/components/NewUi/PageTablePro'

let vm
export default {
  name: 'NsTableEffectAnalysisFriend',
  mixins: [tableMixin],
  props: {
    types: Object,
    department: Array,
    role: Array
  },
  data: function () {
    const pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = []

    const operateButtons = [
      // {
      //   func: function () {
      //     this.$router.go(-1)
      //   },
      //   icon: '',
      //   type: 'default',
      //   name: '返回',
      //   visible: ''
      // },
      {
        func: function () {
          this.$searchAction$()
        },
        icon: '$.noop',
        name: '刷新',
        auth: '',
        visible: ''
      }
    ]

    const quickInput = []
    const quickSearchNames = quickInput.map(x => x.name)
    const quickSearchModel = {}
    const model = Object.assign({},
      {
        status: '',
        empId: '',
        nick: ''
      }, {})
    const that = this

    quickInput.map(item => {
      Object.defineProperty(quickSearchModel, item.name, {
        get: function () {
          return model[item.name]
        },
        set: function (val) {
          model[item.name] = val
          // TODO 由于特殊需求导致下列写法
          if (item.type === 'radio') {
            that._data._table.quickSearchMap[item.name] = val
            that.$quickSearch$()
          }
        },
        enumerable: true
      })
    })

    return {
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      model: model,
      statistics: {
        total: 0,
        successTotal: 0,
        failTotal: 0,
        unSendTotal: 0
      },
      employees: [],
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.marketing.weworkMarketing.receiverWxActivity,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchNames: quickSearchNames,
        operate_buttons: operateButtons,
        quickSearchMap: {}
      },
      _queryConfig: {
        expand: false
      }
    }
  },

  mounted: function () {
    vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    // vm.employeeList()
    vm.getTotal()
  },
  components: {
    NsDatetime,
    PageTable
  },
  methods: {
    employeeList () {
      this.$http.fetch(this.$api.marketing.weworkMarketing.queryEmployeeWechatInfoList, { queryType: 2 })
        .then(resp => {
          if (resp.result) {
            for (const index of resp.result) {
              vm.employees.push({
                label: index.name,
                value: index.employeeID
              })
            }
          }
        }).catch((resp) => {
          vm.$notify.error('查询员工信息失败！' || resp.msg)
        }).finally(() => {})
    },
    getTotal: function () {
      this.$http.fetch(this.$api.marketing.weworkMarketing.getMsgDetail, { messageId: this.$route.query.id })
        .then((resp) => {
          let countInfo = resp.result.formatReceiverStatusCount
          vm.statistics = {
            total: countInfo.success + countInfo.fail + countInfo.pending,
            successTotal: countInfo.success,
            failTotal: countInfo.fail,
            unSendTotal: countInfo.pending
          }
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        }).finally()
    },
    $searchAction$: function () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      this.$reload()
      this.getTotal()
      this.$formatTextToShow$()
    },
    $handleParams: function (param) {
      param.searchMap.messageId = this.$route.query.id
      // param.searchMap.markingType = 4
      return param
    },
    change () {
      this.$searchAction$()
    },
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    onSearch () {
      this.$searchAction$()
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    }
  }
}
