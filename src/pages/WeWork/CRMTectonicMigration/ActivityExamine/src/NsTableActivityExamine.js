import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import { pickerOptions } from '../../EnterpriseGroupMessage/src/common'

let vm
export default {
  name: 'NsTableActivityExamine',
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
    const tableButtons = [
      {
        func: function (obj) {
          this.onShowAudit(obj.row.id)
        },
        icon: '$.noop',
        name: '审核',
        auth: '',
        visible: ''
      },
      {
        func: function (obj) {
          switch (obj.row.marketingType) {
            case 4: {
              vm.$router.push({
                path: '/Marketing/EnterpriseMessagePush',
                query: {
                  openType: 'view',
                  taskId: obj.row.id
                }
              })
              break
            }
            case 5: {
              vm.$router.push({
                path: '/Marketing/EnterpriseGroupMessagePush',
                query: {
                  openType: 'view',
                  taskId: obj.row.id
                }
              })
              break
            }
            default: {
              vm.$router.push({
                path: '/Marketing/EnterpriseMessagePush',
                query: {
                  taskId: obj.row.id
                }
              })
              break
            }
          }
        },
        icon: '$.noop',
        name: '查看活动',
        auth: '',
        visible: ''
      }
    ]

    const operateButtons = []

    const quickInput = [{
      template: '',
      inline: false,
      name: 'name',
      text: '活动名称',
      placeholder: '请输入活动名称',
      type: 'text',
      value: '',
      isConvenient: false
    }]
    const quickSearchNames = quickInput.map(x => x.name)
    const quickSearchModel = {}
    const model = Object.assign({},
      {
        creater: '',
        name: '',
        type: '',
        createTime: [],
        execTime: []
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
      pickerOptions: pickerOptions,
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.marketing.weworkMarketing.queryAuditTable,
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
  },
  watch: {
    '$route.path' () {
      this.$resetInputAction$()
    }
  },
  components: {
    NsDatetime
  },
  methods: {
    $handleParams: function (param) {
      if (param.searchMap && param.searchMap.createTime && param.searchMap.createTime.length > 0) {
        param.searchMap.createStartTime = param.searchMap.createTime[0]
        param.searchMap.createEndTime = param.searchMap.createTime[1]
      }
      let type = '1'
      switch (this.$route.path) {
        case '/GroupExamine': type = '2'; break
        case '/CircleExamine': type = '3'; break
        case '/EnterpriseExamine': type = '4'; break
        case '/EnterpriseGroupExamine': type = '5'; break
        default: break
      }
      param.searchMap.type = type
      delete param.searchMap.execTime
      delete param.searchMap.createTime
      param.searchMap.status = 2
      return param
    },
    onHandleSelectChange: function (val) {
      this.$set(this, 'selectRows', val)
    },
    onSearch () {
      this.$searchAction$()
    },
    onShowAudit (planId) {
      if (!planId) {
        return false
      }
      this.$emit('showAudit', planId)
    }
  }
}
