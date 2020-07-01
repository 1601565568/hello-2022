import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
let vm
export default {
  name: 'NsEmployeeOrCustGroupDialog',
  mixins: [tableMixin],
  props: {
    value: {
      default: function () {
        return []
      }
    },
    url: {
      type: Object,
      default: function () {
        return this.$api.core.sysShop.queryShopList
      }
    },
    // 默认方案：1：企微 2：个号
    plan: {
      type: Number,
      default: 1
    },
    dialogTitle: {
      type: String,
      default: '选择适用门店'
    },
    btnTitle: {
      type: String,
      default: '+选择适用门店'
    },
    validNull: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      allListData: [],
      // 左边树的数据
      listData: [],
      // 右边已选择数据
      selectedData: [],
      // 复制勾选的数据
      selectCopyData: [],
      visible: false,
      tableLoading: false,
      // 搜索数据封装
      param: {
        // 搜索名称
        name: ''
      },
      // 接口数据的key值name
      recordId: 'shopId',
      // 页码
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * 打开弹窗时的初始化事件
     */
    onDialogOpen () {
      vm.visible = true
      vm.$nextTick(function () {
        this.getEmployeeList()
      })
    },
    /**
     * 重置搜索条件并搜索
     */
    resetSearch: function () {
      vm.param.name = ''
      vm.searchEmployee(1)
    },
    /**
     * 搜索列表数据
     */
    searchEmployee: function (pageNo) {
      let data = []
      let total = 0
      this.pagination4Emp.page = pageNo
      let param = { start: (pageNo - 1) * this.pagination4Emp.size, length: this.pagination4Emp.size, searchMap: { plan: vm.plan } }
      if (vm.param.name) {
        param.searchMap.shopName = vm.param.name
      }
      // 请求获取列表数据
      this.$http.fetch(this.url, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            data = resp.result.data
          }
          if (resp.result.recordsTotal) {
            total = parseInt(resp.result.recordsTotal)
          }
        }).catch(() => {
          vm.$notify.error('请求数据信息失败')
        }).finally(() => {
          // 列表数据
          vm.listData = data
          // 备份列表数据
          vm.allListData = data
          // 数据总数
          vm.pagination4Emp.total = total
          vm.$nextTick(function () {
            // 设置列表数据勾选状态
            vm.toggleRowSelection(vm.selectedData, vm.listData, vm.recordId)
            vm.tableLoading = false
          })
        })
    },
    /**
     * 设置列表数据勾选状态
     */
    toggleRowSelection (selectedData, allData, idKey) {
      vm.$nextTick(function () {
        for (let data of allData) {
          let index = selectedData.filter(index => data[idKey] === index[idKey])
          if (index.length > 0) {
            vm.$refs['employeeTable'].toggleRowSelection(data, true)
          } else {
            vm.$refs['employeeTable'].toggleRowSelection(data, false)
          }
        }
      })
    },
    /**
     * 列表点击选择
     */
    selectChange (select, scope) {
      if (this.selectedData.length > 0) {
        const index = this.selectedData.findIndex(d => d[vm.recordId] === scope[vm.recordId])
        if (index > -1) {
          this.selectedData.splice(index, 1)
        } else {
          this.selectedData.push(scope)
        }
      } else {
        this.selectedData = JSON.parse(JSON.stringify(this.$refs['employeeTable'].selection))
      }
      if (this.selectedData.length === 0) {
        this.$refs['employeeTable'].clearSelection()
      }
    },
    /**
     * 列表点击当页全部选择事件
     */
    selectAllChange (select) {
      if (select.length === 0) {
        for (let data of this.listData) {
          const index = this.selectedData.findIndex(d => d[vm.recordId] === data[vm.recordId])
          if (index > -1) {
            this.selectedData.splice(index, 1)
          }
        }
      } else {
        for (let data of select) {
          const index = this.selectedData.findIndex(d => d[vm.recordId] === data[vm.recordId])
          if (index === -1) {
            this.selectedData.push(data)
          }
        }
      }
    },
    /**
     * 右侧数据删除事件
     */
    removeEmp (scope) {
      this.selectedData.splice(scope.$index, 1)
      const index = this.$refs['employeeTable'].selection.findIndex(d => d[vm.recordId] === scope.row[vm.recordId])
      if (index > -1) {
        this.$refs['employeeTable'].selection.splice(index, 1)
      }
      if (this.$refs['employeeTable'].selection.length === 0) {
        this.$refs['employeeTable'].clearSelection()
      }
    },
    /**
     * 根据右边数据，勾选左边数据
     */
    resetInput () {
      if (vm.listData.length > 0) {
        vm.fileData()
      }
    },
    /**
     * 勾选处理逻辑
     */
    fileData () {
      if (vm.$refs['employeeTable']) {
        vm.$refs['employeeTable'].clearSelection()
      }
      vm.$nextTick(function () {
        for (let indexDat of vm.listData) {
          if (vm.selectedData.filter(d => d[vm.recordId] === indexDat[vm.recordId]).length > 0) {
            vm.$refs['employeeTable'].toggleRowSelection(indexDat, true)
          }
        }
      })
    },
    /**
     * 第一次打开组建，获取左侧列表，并联动右侧已选数据
     */
    getEmployeeList () {
      this.tableLoading = true
      let param = { start: (this.pagination4Emp.page - 1) * this.pagination4Emp.size, length: this.pagination4Emp.size, searchMap: { plan: vm.plan } }
      this.$http.fetch(this.url, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            vm.listData = JSON.parse(JSON.stringify(resp.result.data))
            vm.allListData = JSON.parse(JSON.stringify(resp.result.data))
          }
          if (resp.result.recordsTotal) {
            vm.pagination4Emp.total = parseInt(resp.result.recordsTotal)
          } else {
            vm.pagination4Emp.total = 0
          }
        }).catch(() => {
          vm.$notify.error('请求数据信息失败')
        }).finally(() => {
          // 勾选默认值
          if (vm.value && vm.value.length > 0) {
            var param = {}
            if (vm.value && vm.value.length > 0) {
              param.shopIds = vm.value.join(',')
            }
            vm.$http.fetch(this.$api.core.sysShop.findShopListByShopIds, param).then(resp => {
              if (resp.result && resp.result.length > 0) {
                vm.selectedData = resp.result
                vm.$nextTick(function () {
                  vm.toggleRowSelection(vm.selectedData, vm.listData, vm.recordId)
                  vm.tableLoading = false
                })
              }
            }).catch((ee) => {})
          } else {
            vm.selectedData = []
          }
          vm.$nextTick(function () {
            vm.resetInput()
          })
          vm.tableLoading = false
        })
    },
    /**
     * 关闭弹窗
     */
    onDialogClose () {
      vm.visible = false
    },
    /**
     * 点击保存按钮
     */
    onSave () {
      if (this.validNull && this.selectedData.length < 1) {
        this.$notify.warning('至少选择一个')
        return
      }
      this.callbackData(JSON.parse(JSON.stringify(this.selectedData)))
      vm.visible = false
    },
    /**
     * 返回组建数据到父组件
     */
    callbackData: function (data) {
      let transData = this.transformData(data)
      // 直接复制给父组件的input的v-model
      this.$emit('input', transData)
    },
    /**
     * 设置返回信息
     */
    transformData (data) {
      let result = []
      if (data && data.length > 0) {
        data.map(item => {
          result.push(item[vm.recordId])
        })
      }
      return result
    },
    /**
     * 点击页码数量时触发获取列表刷新事件
     */
    $sizeChange$: function (size) {
      this.pagination4Emp.size = size
      return this.searchEmployee(1)
    }
  },
  mounted: function () {
    vm = this
  },
  created: function () {
  }
}
