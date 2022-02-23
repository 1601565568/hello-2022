import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import PageTable from '@/components/NewUi/PageTable'

let vm
export default {
  name: 'NsTableFriendMessage',
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
          vm.$router.push({
            path: '/Marketing/EnterpriseMessagePush',
            query: {
              taskId: obj.row.id
            }
          })
        },
        icon: '$.noop',
        name: '编辑',
        auth: '',
        visible: 'scope.row.planStatus === 1 || scope.row.planStatus === 3'
      },
      {
        func: function (obj) {
          const title = '确定提交审核营销活动' + obj.row.planName
          // const vm = this
          apiRequestConfirm(title).then(function () {
            vm.$http.fetch(vm.$api.marketing.weworkMarketing.updateStatus
              , { id: obj.row.id, state: 2 })
              .then((resp) => {
                vm.$notify.success('提交成功')
                vm.$reload()
              })
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally(() => {})
        },
        icon: '$.noop',
        name: '提交审核',
        auth: '',
        visible: 'scope.row.planStatus === 1'
      },
      {
        func: function (obj) {
          const title = '确定撤回提交审核营销活动' + obj.row.planName
          // const vm = this
          apiRequestConfirm(title).then(function () {
            vm.$http.fetch(vm.$api.marketing.weworkMarketing.updateStatus
              , { id: obj.row.id, state: 1 })
              .then((resp) => {
                vm.$notify.success('撤回成功')
                vm.$reload()
              })
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally(() => {})
        },
        icon: '$.noop',
        name: '撤销提交',
        auth: '',
        visible: 'scope.row.planStatus === 2'
      },
      {
        func: function (obj) {
          vm.$router.push({
            path: '/Marketing/EnterpriseMessagePush',
            query: {
              taskId: obj.row.id,
              openType: 'view'
            }
          })
        },
        icon: '$.noop',
        name: '查看活动',
        auth: '',
        visible: 'scope.row.planStatus === 2 || scope.row.planStatus === 4 || scope.row.planStatus === 5 || scope.row.planStatus === 6'
      },
      {
        func: function (obj) {
          vm.$router.push({
            path: '/Marketing/EnterpriseMessagePush',
            query: {
              openType: 'copy',
              taskId: obj.row.id
            }
          })
        },
        icon: '$.noop',
        name: '复制',
        auth: '',
        visible: true
      },
      {
        func: function (obj) {
          vm.$router.push({
            path: '/Marketing/EffectAnalysisEnterprise',
            query: {
              id: obj.row.id
            }
          })
        },
        icon: '$.noop',
        name: '效果分析',
        auth: '',
        visible: 'scope.row.planStatus === 5 || scope.row.planStatus === 6'
      },
      {
        func: function (obj) {
          const title = '正在执行中的营销任务' + obj.row.planName + '将被终止'
          // const vm = this
          apiRequestConfirm(title).then(function () {
            vm.$http.fetch(vm.$api.marketing.weworkMarketing.updateStatus
              , { id: obj.row.id, state: 6 })
              .then((resp) => {
                vm.$notify.success('终止成功')
                vm.$reload()
              })
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally(() => {})
        },
        icon: '$.noop',
        name: '终止',
        auth: '',
        visible: 'scope.row.planStatus === 4 || scope.row.planStatus === 5'
      },
      {
        func: function (obj) {
          const title = '确定删除营销活动' + obj.row.planName
          // const vm = this
          apiRequestConfirm(title).then(function () {
            vm.$http.fetch(vm.$api.marketing.weworkMarketing.deleteWxActivity
              , { id: obj.row.id })
              .then((resp) => {
                vm.$notify.success(resp.msg)
                vm.$reload()
              })
          }).catch((resp) => {
            vm.$notify.error(resp.msg)
          }).finally(() => {})
        },
        icon: '$.noop',
        name: '删除',
        auth: '',
        visible: 'scope.row.planStatus === 1 || scope.row.planStatus === 3'
      }
    ]

    const operateButtons = [
      {
        func: function () {
          vm.$router.push({ path: '/Marketing/EnterpriseMessagePush' })
        },
        icon: '$.noop',
        name: '新增',
        auth: '',
        visible: ''
      }
    ]

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
        status: '',
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
      quickSearchModel: quickSearchModel,
      rules: Object.assign({}, {}, {}),
      state: {},
      typeOptions: [],
      sourceOptions: [],
      Options: {},
      url: this.$api.marketing.weworkMarketing.queryTable,
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
  components: {
    NsDatetime,
    PageTable
  },
  methods: {
    getCreateTime (value) {
      this.model.createStartTime = value[0]
      this.model.createEndTime = value[1]
      this.$searchAction$()
    },
    getExecTime (value) {
      this.model.execStartTime = value[0]
      this.model.execEndTime = value[1]
      this.$searchAction$()
    },
    changeSearchfrom (obj = {}) {
      this.model = Object.assign(this.model, obj)
      this.$searchAction$()
    },
    // $handleParams: function (param) {
    //   if (param.searchMap && param.searchMap.createTime && param.searchMap.createTime.length > 0) {
    //     param.searchMap.createStartTime = param.searchMap.createTime[0]
    //     param.searchMap.createEndTime = param.searchMap.createTime[1]
    //   }
    //   if (param.searchMap && param.searchMap.execTime && param.searchMap.execTime.length > 0) {
    //     param.searchMap.execStartTime = param.searchMap.execTime[0]
    //     param.searchMap.execEndTime = param.searchMap.execTime[1]
    //   }
    //   delete param.searchMap.execTime
    //   delete param.searchMap.createTime
    //   param.searchMap.type = 4
    //   return param
    // },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.activeIndex) {
        return { backgroundColor: '#D9EFFE' }
      }
      return ''
    },
    onSearch () {
      this.$searchAction$()
    }
  }
}
