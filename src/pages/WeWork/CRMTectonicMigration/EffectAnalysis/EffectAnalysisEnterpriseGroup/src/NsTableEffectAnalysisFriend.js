import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import $ from 'jquery'
import { MARKETING_TYPE } from '../../../EnterpriseGroupMessage/src/common'
import PageTable from '@/components/NewUi/PageTablePro'

let vm
export default {
  name: 'NsTableEffectAnalysisGroup',
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
          this.getTotal()
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
        sendStatus: '',
        guideId: '',
        searchValue: ''
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
      },
      MARKETING_TYPE: MARKETING_TYPE
    }
  },

  mounted: function () {
    vm = this
    if (typeof this.$init === 'function') {
      this.$init(this, this.$generateParams$)
    } else {
      this.$reload()
    }
    vm.queryGroupRooms4ent()
    vm.getTotal()
  },
  components: {
    NsDatetime,
    PageTable
  },
  methods: {
    // 查询列表查询群主信息
    queryGroupRooms4ent () {
      const that = this
      const obj = {
        length: 9999,
        start: 0,
        searchMap: {
          messageId: parseInt(this.$route.query.id)
        }
      }
      this.$http.fetch(this.$api.marketing.weworkMarketing.targetWxActivity, obj)
        .then(resp => {
          if (resp && resp.result) {
            // that.employees = JSON.parse(JSON.stringify(resp.result))
            that.employees = resp.result.data.map(el => {
              return {
                name: el.guide.name,
                id: el.guide.id
              }
            })
          }
        }).catch(() => {
          that.$notify.error('群主信息获取失败！')
        })
    },
    // 获取发送状态信息
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
          // vm.statistics = resp.result
        }).catch((resp) => {
          vm.$notify.error(resp.msg)
        }).finally()
    },
    $searchAction$: function () {
      this._data._table.searchMap = $.extend(true, {}, this.model)
      // 页码变更会触发reload动作
      this._data._pagination.page = 1
      this.$reload()
      // this.getTotal()
      this.$formatTextToShow$()
    },
    $handleParams: function (param) {
      param.searchMap.messageId = this.$route.query.id
      delete param.searchMap.searchValue
      param.searchValue = this.model.searchValue
      // param.searchMap.planId = this.$route.query.id
      // Todo 此处类型要确认到时候接口需不需要
      // param.searchMap.markingType = MARKETING_TYPE.ENT_GROUP
      return param
    },
    // change () {
    //   this.$searchAction$()
    // },
    // onHandleSelectChange: function (val) {
    //   this.$set(this, 'selectRows', val)
    // },
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
