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
    guideUrl: {
      type: Object,
      default: function () {
        return this.$api.core.sysUser.queryGuidePage
      }
    },
    dialogTitle: {
      type: String,
      default: '选择营销人群'
    },
    btnTitle: {
      type: String,
      default: '+选择营销人群'
    },
    validNull: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      allEmployeeData: [],
      // 左边树的数据
      employeeData: [],
      // 右边已选择数据
      selectedData: [],
      // 复制勾选的数据
      selectCopyData: [],
      visible: false,
      tableLoading: false,
      // 搜索数据封装
      departData: {
        // 所有部门值
        departmentTree: [],
        // 所有部门值
        allDepartments: [],
        // 部门搜索值
        selectedDepart: {
          value: '',
          text: ''
        },
        // 搜索的员工名称
        name: ''
      },
      // 接口员工idkey
      recordId: 'id',
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
        this.departData.name = ''
        this.departData.selectedDepart.value = ''
        this.departData.selectedDepart.text = ''
        this.$refs.employeeDepartTree.cleanClickHandle()
        this.getEmployeeList()
      })
    },
    /**
     * 部门树点击事件
     */
    loadNode (node, resolve) {
      let allDepar = this.departData.departmentTree
      if (node.level === 0) { // 第一次调用
        return resolve([{ id: 0, parentId: -1, code: 0, label: '全部', checked: false, showAdd: true, showEdit: true, showDelete: true }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        let filter = allDepar.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          resolve(filter)
        } else {
          resolve([])
        }
      }
    },
    /**
     * 初始化部门树数据
     */
    getDepartmentTree () {
      let that = this
      that.$http.fetch(that.$api.core.department.queryDepartmentTreeByYun)
        .then((resp) => {
          that.departData.departmentTree = resp.result
          that.departData.allDepartments = resp.result
        }).catch(() => {
          vm.$notify.error('查询部门树失败')
        })
    },
    /**
     * 重置搜索条件并搜索
     */
    resetSearch: function () {
      vm.departData.name = ''
      vm.departData.selectedDepart.value = ''
      vm.departData.selectedDepart.text = ''
      vm.$refs.employeeDepartTree.cleanClickHandle()
      vm.searchEmployee(1)
    },
    /**
     * 搜索员工
     */
    searchEmployee: function (pageNo) {
      let data = []
      let total = 0
      this.pagination4Emp.page = pageNo
      let param = { pageNo: pageNo, pageSize: this.pagination4Emp.size }
      if (vm.departData.name) {
        param.empName = vm.departData.name
      }
      if (vm.departData.selectedDepart.value && parseInt(vm.departData.selectedDepart.value) > 0) {
        let jointString = vm.jointDepartId(vm.departData.selectedDepart.value, vm.departData.allDepartments)
        param.empDepar = jointString.join(',')
      }
      // 请求获取员工数据
      this.$http.fetch(this.guideUrl, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            data = JSON.parse(JSON.stringify(resp.result.data))
          }
          if (resp.result.recordsTotal) {
            total = parseInt(resp.result.recordsTotal)
          }
        }).catch(() => {
          vm.$notify.error('查询用户信息失败')
        }).finally(() => {
          // 员工数据
          vm.employeeData = vm.handleEmployeeList(JSON.parse(JSON.stringify(data)), vm.departData.allDepartments)
          // 所有员工数据
          vm.allEmployeeData = vm.handleEmployeeList(JSON.parse(JSON.stringify(data)), vm.departData.allDepartments)
          // 数据总数
          vm.pagination4Emp.total = total
          vm.$nextTick(function () {
            // 设置员工勾选状态
            vm.toggleRowSelection(vm.selectedData, vm.employeeData, vm.recordId)
            vm.tableLoading = false
          })
        })
    },
    /**
     * 拼接部门的id,所有子部门
     */
    jointDepartId (departId, allDepart) {
      let _jointString = [departId]
      if (departId && allDepart && allDepart.length > 0) {
        allDepart.forEach(index => {
          if (index.parentId && index.id && parseInt(index.parentId) === parseInt(departId)) {
            _jointString = _jointString.concat(vm.jointDepartId(index.id, allDepart))
          }
        })
      }
      return _jointString
    },
    /**
     * 设置员工勾选状态
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
     * 员工列表点击选择
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
     * 员工列表点击当页全部选择事件
     */
    selectAllChange (select) {
      if (select.length === 0) {
        for (let data of this.employeeData) {
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
     * 右侧员工删除事件
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
     * 根据右边数据，勾选左边员工
     */
    resetInput () {
      if (vm.employeeData.length > 0) {
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
        for (let indexDat of vm.employeeData) {
          if (vm.selectedData.filter(d => d[vm.recordId] === indexDat[vm.recordId]).length > 0) {
            vm.$refs['employeeTable'].toggleRowSelection(indexDat, true)
          }
        }
      })
    },
    /**
     * 第一次打开组建，获取左侧用户列表，并联动右侧已选数据
     */
    getEmployeeList () {
      this.tableLoading = true
      let param = { pageNo: this.pagination4Emp.page, pageSize: this.pagination4Emp.size }
      this.$http.fetch(this.guideUrl, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            vm.employeeData = vm.handleEmployeeList(JSON.parse(JSON.stringify(resp.result.data)), vm.departData.allDepartments)
            vm.allEmployeeData = vm.handleEmployeeList(JSON.parse(JSON.stringify(resp.result.data)), vm.departData.allDepartments)
          }
          if (resp.result.recordsTotal) {
            vm.pagination4Emp.total = parseInt(resp.result.recordsTotal)
          } else {
            vm.pagination4Emp.total = 0
          }
        }).catch(() => {
          vm.$notify.error('查询用户信息失败')
        }).finally(() => {
          // 勾选默认值
          if (vm.value && vm.value.length > 0) {
            var param = {}
            param.pageNo = 1
            param.pageSize = 1
            if (vm.value && vm.value.length > 0) {
              param.userIds = vm.value.join(',')
            }
            vm.$http.fetch(this.$api.core.sysUser.findByGuideIds, param).then(resp => {
              if (resp.result && resp.result.length > 0) {
                vm.selectedData = vm.handleEmployeeList(JSON.parse(JSON.stringify(resp.result)), vm.departData.allDepartments)
                vm.$nextTick(function () {
                  vm.toggleRowSelection(vm.selectedData, vm.employeeData, vm.recordId)
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
     * 处理左侧员工数据，给其赋值部门名称
     */
    handleEmployeeList (employeeData, departData) {
      if (employeeData && employeeData.length > 0) {
        // 设置部门名称
        if (departData) {
          employeeData.map(data => {
            let filterList = departData.filter(data2 => parseInt(data2.id) === parseInt(data.department_id))
            if (filterList && filterList.length > 0) {
              Object.assign(data, { departName: filterList[0].label })
            }
          })
        }
      }
      return employeeData
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
        this.$notify.warning('请选择员工')
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
     * 点击页码数量时触发获取员工列表刷新事件
     */
    $sizeChange$: function (size) {
      this.pagination4Emp.size = size
      return this.searchEmployee(1)
    }
  },
  mounted: function () {
    vm = this
    // 获取部门树
    vm.getDepartmentTree()
  },
  created: function () {
  }
}
