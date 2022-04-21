import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import NsDatetime from '@nascent/ecrp-ecrm/src/components/NsDatetime'
import apiRequestConfirm from '@nascent/ecrp-ecrm/src/utils/apiRequestConfirm'
import PageTable from '@/components/NewUi/PageTablePro'

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
              messageId: obj.row.id,
              openType: 'edit'
            }
          })
        },
        icon: '$.noop',
        name: '编辑',
        auth: '',
        visible: 'scope.row.status === 1 || scope.row.status === 3'
      },
      {
        func: function (obj) {
          // const title = '确定提交审核营销活动' + obj.row.planName
          // const vm = this
          this.handleItem(obj.row, 'check', '确定提交？', '此操作将确定提交审核营销活动，是否继续？', 2)
          // apiRequestConfirm(title).then(function () {
          //   vm.$http.fetch(vm.$api.marketing.weworkMarketing.updateStatus
          //     , { id: obj.row.id, state: 2 })
          //     .then((resp) => {
          //       vm.$notify.success('提交成功')
          //       vm.$reload()
          //     })
          // }).catch((resp) => {
          //   vm.$notify.error(resp.msg)
          // }).finally(() => {})
        },
        icon: '$.noop',
        name: '提交审核',
        auth: '',
        visible: 'scope.row.status === 1'
      },
      {
        func: function (obj) {
          this.handleItem(obj.row, 'checkBack', '确定撤销提交？', '此操作将确定撤销提交营销审核活动，是否继续？', 1)
          // const title = '确定撤回提交审核营销活动' + obj.row.planName
          // // const vm = this
          // apiRequestConfirm(title).then(function () {
          //   vm.$http.fetch(vm.$api.marketing.weworkMarketing.updateStatus
          //     , { id: obj.row.id, state: 1 })
          //     .then((resp) => {
          //       vm.$notify.success('撤回成功')
          //       vm.$reload()
          //     })
          // }).catch((resp) => {
          //   vm.$notify.error(resp.msg)
          // }).finally(() => {})
        },
        icon: '$.noop',
        name: '撤销提交',
        auth: '',
        visible: 'scope.row.status === 2'
      },
      {
        func: function (obj) {
          vm.$router.push({
            path: '/Marketing/EnterpriseMessagePush',
            query: {
              messageId: obj.row.id,
              openType: 'look'
            }
          })
        },
        icon: '$.noop',
        name: '查看活动',
        auth: '',
        visible: 'scope.row.status === 2 || scope.row.status === 4 || scope.row.status === 5 || scope.row.status === 6 || scope.row.status === 7'
      },
      {
        func: function (obj) {
          vm.$router.push({
            path: '/Marketing/EnterpriseMessagePush',
            query: {
              messageId: obj.row.id,
              openType: 'copy'
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
              id: obj.row.id,
              name: obj.row.name
            }
          })
        },
        icon: '$.noop',
        name: '效果分析',
        auth: '',
        visible: 'scope.row.status === 6 || scope.row.status === 7'
      },
      {
        func: function (obj) {
          this.handleItem(obj.row, 'termination', '确定终止？', '此操作将会终止营销活动，是否继续？', 6)
          // const title = '正在执行中的营销任务' + obj.row.planName + '将被终止'
          // // const vm = this
          // apiRequestConfirm(title).then(function () {
          //   vm.$http.fetch(vm.$api.marketing.weworkMarketing.updateStatus
          //     , { id: obj.row.id, state: 6 })
          //     .then((resp) => {
          //       vm.$notify.success('终止成功')
          //       vm.$reload()
          //     })
          // }).catch((resp) => {
          //   vm.$notify.error(resp.msg)
          // }).finally(() => {})
        },
        icon: '$.noop',
        name: '终止',
        auth: '',
        visible: 'scope.row.status === 4 || scope.row.status === 5'
      },
      {
        func: function (obj) {
          this.handleItem(obj.row, 'delete', '确定删除？', '此操作将确定删除营销活动，是否继续？')
          // const title = '确定删除营销活动' + obj.row.planName
          // // const vm = this
          // apiRequestConfirm(title).then(function () {
          //   vm.$http.fetch(vm.$api.marketing.weworkMarketing.deleteWxActivity
          //     , { id: obj.row.id })
          //     .then((resp) => {
          //       vm.$notify.success(resp.msg)
          //       vm.$reload()
          //     })
          // }).catch((resp) => {
          //   vm.$notify.error(resp.msg)
          // }).finally(() => {})
        },
        icon: '$.noop',
        name: '删除',
        auth: '',
        visible: 'scope.row.status === 1 || scope.row.status === 3'
      }
    ]

    const operateButtons = [
      {
        func: function () {
          vm.$router.push({
            path: '/Marketing/EnterpriseMessagePush',
            query: {
              messageId: '',
              openType: 'add'
            }
          })
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
        employeeId: '',
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
      // 环境判断
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType,
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
      },
      showDialog: false, // 显示二次确认弹框
      dialogTitle: '', // 弹框标题
      handleItemType: '', // 弹框处理类型
      dialogContent: '', // 弹框显示内容
      handleStatus: '', // 弹框处理的状态
      handleObj: {}, // 处理行内容
      showTableDialog: false, // 显示营销对象弹框
      showStaff: false, // 区别员工/群
      staffName: '', // 表格搜索员工名称
      groupName: '', // 表格搜索群名称
      messageListId: '', // 此行记录id
      tableDialogData: [], // 表格数据
      tableDialogLoading: false, // 加载标识
      paginationDialog: { // 表格翻页
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      // 状态列表
      statusData: [
        { label: '未提交', value: 1 },
        { label: '待审核', value: 2 },
        { label: '审核失败', value: 3 },
        { label: '待执行', value: 4 },
        { label: '执行中', value: 5 },
        { label: '已执行', value: 6 },
        { label: '已终止', value: 7 }
      ],
      // 状态枚举
      statusName: {
        1: '未提交',
        2: '待审核',
        3: '审核失败',
        4: '待执行',
        5: '执行中',
        6: '已执行',
        7: '已终止',
        8: '执行失败'
      },
      // 创建人客道环境下拉
      selectProps: {
        label: 'name',
        value: 'id',
        disabled: 'disabled'
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
    // 获取状态名
    getStatusName (value) {
      return this.statusName[value]
    },
    getEmployeeId (value) {
      this.$searchAction$()
    },
    getStatus (value) {
      this.$searchAction$()
    },
    // 打开接收人弹框
    lookReceiver (val, id) {
      if (val === 1) {
        this.showStaff = true
        this.staffName = ''
      } else {
        this.groupName = ''
        this.showStaff = false
      }
      this.messageListId = id
      this.paginationDialog.size = 15
      this.paginationDialog.page = 1
      this.getTableList()
      this.showTableDialog = true
    },
    // 弹窗表格事件 start
    dialogSizeChange (size) {
      this.paginationDialog.size = size
      this.paginationDialog.page = 1
      this.getTableList()
    },
    dialogPageChange (page) {
      this.paginationDialog.page = page
      this.getTableList()
    },
    getTableList () {
      let params = {
        searchValue: this.showStaff ? this.staffName : this.groupName,
        start: (this.paginationDialog.page - 1) * this.paginationDialog.size,
        length: this.paginationDialog.size,
        searchMap: {
          messageId: this.messageListId
        }
      }
      this.tableDialogLoading = true
      this.$http.fetch(this.$api.marketing.weworkMarketing.targetWxActivity, params).then((resp) => {
        this.tableDialogData = resp.result.data
        this.paginationDialog.total = parseInt(resp.result.recordsTotal)
      }).catch((err) => {
        if (err && err.msg) {
          this.$notify.error(err.msg)
        } else {
          this.$notify.error('网络异常，获取数据失败！')
        }
      }).finally(() => {
        this.tableDialogLoading = false
      })
    },
    // 弹窗表格 end
    // 弹框事件处理 start
    onEscCancel () {
      this.showDialog = false
    },
    onEscConfirm () {
      this.showDialog = false
      this.handleApi()
    },
    handleItem (obj, type, name, text, status) {
      this.handleItemType = type
      this.dialogTitle = name
      this.dialogContent = text
      this.handleObj = obj
      this.handleStatus = status
      this.showDialog = true
    },
    // 列表处理接口
    handleApi () {
      let url = ''
      if (this.handleItemType === 'check') {
        // 提交审核
        url = this.$api.marketing.weworkMarketing.commitWxActivity
      } else if (this.handleItemType === 'checkBack') {
        // 撤销提交审核
        url = this.$api.marketing.weworkMarketing.revokeWxActivity
      } else if (this.handleItemType === 'termination') {
        // 终止活动
        url = this.$api.marketing.weworkMarketing.abortWxActivity
      } else if (this.handleItemType === 'delete') {
        // 删除活动
        url = this.$api.marketing.weworkMarketing.deleteWxActivity
      }
      this.$http
        .fetch(url, { messageId: this.handleObj.id })
        .then(resp => {
          this.$notify.success('操作成功')
          this.$searchAction$()
        })
        .catch(resp => {
          this.$notify.error(getErrorMsg('操作失败', resp))
        })
        .finally(() => {
          this.loading = false
        })
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
    getExecTime (value) {
      if (!value) {
        this.model.sendTimeStart = ''
        this.model.sendTimeEnd = ''
      } else {
        this.model.sendTimeStart = value[0]
        this.model.sendTimeEnd = value[1]
      }
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
