import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import { pickerOptions } from '../../EnterpriseGroupMessage/src/common'
import PageTable from '@/components/NewUi/PageTablePro'

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
      }
    ]

    const operateButtons = []

    const model = Object.assign({},
      {
        employeeLoginName: '',
        name: '',
        status: '2',
        createTime: []
      }, {})
    const that = this

    return {
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
      model: model,
      pickerOptions: pickerOptions,
      rules: Object.assign({}, {}, {}),
      state: {},
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.marketing.weworkMarketing.queryTable,
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        // quickSearchNames: quickSearchNames,
        operate_buttons: operateButtons
        // quickSearchMap: {}
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
    NsDatetime,
    PageTable
  },
  methods: {
    getCreater (value) {
      this.$searchAction$()
    },
    // 弹框事件处理 end
    getCreateTime (value) {
      if (!value) {
        this.model.createTimeStart = ''
        this.model.createTimeEnd = ''
      } else {
        this.model.createTimeStart = value[0]
        this.model.createTimeEnd = value[1]
      }
      this.$searchAction$()
    },
    // $handleParams: function (param) {
    //   if (param.searchMap && param.searchMap.createTime && param.searchMap.createTime.length > 0) {
    //     param.searchMap.createStartTime = param.searchMap.createTime[0]
    //     param.searchMap.createEndTime = param.searchMap.createTime[1]
    //   }
    //   let type = '1'
    //   switch (this.$route.path) {
    //     case '/GroupExamine': type = '2'; break
    //     case '/CircleExamine': type = '3'; break
    //     case '/EnterpriseExamine': type = '4'; break
    //     case '/EnterpriseGroupExamine': type = '5'; break
    //     default: break
    //   }
    //   param.searchMap.type = type
    //   delete param.searchMap.execTime
    //   delete param.searchMap.createTime
    //   param.searchMap.status = 2
    //   return param
    // },
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
    },
    onShowAudit (messageId) {
      if (!messageId) {
        return false
      }
      this.$emit('showAudit', messageId)
    }
  }
}
