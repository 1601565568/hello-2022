import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import $ from 'jquery'
import { MARKETING_TYPE } from '../../../EnterpriseGroupMessage/src/common'

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
      {
        func: function () {
          this.$router.go(-1)
        },
        icon: '',
        type: 'default',
        name: '返回',
        visible: ''
      },
      {
        func: function () {
          this.$parent.$searchAction$()
          // this.$parent.getTotal()
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
      url: this.$api.marketing.weworkMarketing.queryTableSendDataToGroup,
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
    // vm.getTotal()
  },
  components: {
    NsDatetime
  },
  methods: {
    // 查询群主
    queryGroupRooms4ent () {
      const that = this
      this.$http.fetch(this.$api.marketing.weworkMarketing.queryChatRoomLeadersByActivityId, { id: parseInt(this.$route.query.id) })
        .then(resp => {
          if (resp && resp.result) {
            that.employees = JSON.parse(JSON.stringify(resp.result))
          }
        }).catch(() => {
          that.$notify.error('微信群加载失败！')
        })
    },
    getTotal: function () {
      this.$http.fetch(this.$api.marketing.weworkMarketing.queryTotal, { id: this.$route.query.id })
        .then((resp) => {
          vm.statistics = resp.result
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
      param.searchMap.planId = this.$route.query.id
      param.searchMap.markingType = MARKETING_TYPE.ENT_GROUP
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
    }
  }
}
