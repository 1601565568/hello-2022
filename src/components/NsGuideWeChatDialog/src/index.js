/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { Object } from 'core-js'
import store from 'store/dist/store.legacy.min.js'
let vm
export default {
  name: 'NsGuideDialog',
  mixins: [tableMixin],
  props: {
    value: {
      default: function () {
        return []
      }
    },
    // 判断是否需要门店回显
    echoStore: {
      default: function () {
        return false
      }
    },
    guideUrl: {
      type: Object,
      default: function () {
        return this.$api.core.sysUser.queryGuidePage
      }
    },
    guideFindUrl: {
      type: Object,
      default: function () {
        return this.$api.core.sysUser.findByGuideIds
      }
    },
    // 是否添加登录账号店铺数据权限
    auth: {
      type: Boolean,
      default: true
    },
    // 是否支持按区域选中0 - 不支持， 1-支持
    switchAreaFlag: {
      type: Number,
      default: function () {
        return 0
      }
    },
    dialogTitle: {
      type: String,
      default: '选择员工'
    },
    btnTitle: {
      type: String,
      default: '+选择员工'
    },
    type: {
      type: String,
      default: 'text'
    },
    validNull: {
      type: Boolean,
      default: false
    },
    isButton: {
      type: Boolean,
      default: true
    },
    selfBtn: {
      type: Boolean,
      default: false
    },
    // 是否直接绑定到body下
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 是否需要和右上角区域联动
    isNeedLink: {
      type: Boolean,
      default: false
    },
    // 是否展示title上的tip
    showTitleTip: {
      type: Boolean,
      default: false
    },
    // 裂变大师临时修改,匹克数据太大导致接口回来之前弹框卡死 design by mzm
    // 是否需要等待接口返回后才展示弹框
    isOpenDialogAfterRequest: {
      type: Boolean,
      default: false
    },
    // 是否需要返回群主类型员工，true 是，false 否，在群分析页面中使用
    onlyOwner: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      allEmployeeData: [],
      // 左边树的数据
      employeeData: [],
      allSearchEmployeeData: [],
      // 右边已选择数据
      selectedData: [],
      // 复制勾选的数据
      selectCopyData: [],
      visible: false,
      tableLoading: false,
      successCount: 0, // 导入员工数量
      // 搜索数据封装
      departData: {
        name: ''
      },
      // 门店区域树
      shopAreaTree: [],
      // 门店选择option
      shopOptions: [],
      allShopOptions: [],
      // 接口员工idkey
      recordId: 'id',
      // 页码
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      isCheckAll: false,
      loading: true,
      requestLoaded: false // 区域树是否加载完成
    }
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * 打开弹窗时的初始化事件
     */
    onDialogOpen () {
      if (this.isOpenDialogAfterRequest && !this.requestLoaded) {
        return
      }
      vm.visible = true
      vm.isCheckAll = false
      vm.$nextTick(function () {
        this.departData.name = ''
        this.getEmployeeList()
      })
    },
    /**
     * 搜索员工
     */
    searchEmployee: function (pageNo) {
	   // eslint-disable-next-line no-mixed-spaces-and-tabs
      let data = []
      let total = 0
      this.pagination4Emp.page = pageNo
      let param = { pageNo: pageNo, pageSize: this.pagination4Emp.size, onlyOwner: this.onlyOwner }
      this.setParam(param)
      // 请求获取员工数据

      this.$http.fetch(this.guideUrl, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            data = JSON.parse(JSON.stringify(resp.result.data))
          }
          if (resp.result.recordsTotal) {
            total = parseInt(resp.result.recordsTotal)
          }
          vm.isCheckAll = false
        }).catch(() => {
          vm.$notify.error('查询用户信息失败')
        }).finally(() => {
          vm.allSearchEmployeeData = []
          // 员工数据
          vm.employeeData = JSON.parse(JSON.stringify(data))
          // 所有员工数据
          vm.allEmployeeData = JSON.parse(JSON.stringify(data))
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
     * 搜索全部员工
     */
    async searchAllEmployee () {
      if (vm.allSearchEmployeeData.length > 0) {
        return vm.allSearchEmployeeData
      }
      let param = { pageNo: 1, pageSize: 9999999, onlyOwner: this.onlyOwner }
      this.setParam(param)
      // 请求获取员工数据
      await this.$http.fetch(this.guideUrl, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            vm.allSearchEmployeeData = JSON.parse(JSON.stringify(resp.result.data))
          }
        }).catch(() => {
          vm.$notify.error('查询用户信息失败')
        })
      return vm.allSearchEmployeeData
    },
    /**
     * 初始化搜索值
     * @param param
     */
    setParam (param) {
      param.auth = vm.auth
      param.switchAreaFlag = vm.switchAreaFlag
      if (vm.departData.name) {
        param.empName = vm.departData.name
      }
      // if (vm.departData.fileImportKey) {
      //   param.fileImportKey = vm.departData.fileImportKey
      // }
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
          vm.isCheckAll = false
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
        vm.isCheckAll = false
      } else {
        for (let data of select) {
          const index = this.selectedData.findIndex(d => d[vm.recordId] === data[vm.recordId])
          if (index === -1) {
            this.selectedData.push(data)
          }
        }
      }
    },
    clearSelection () {
      vm.$refs.employeeTable.clearSelection()
      this.selectedData = []
    },
    /**
     * 右侧员工删除事件
     */
    removeEmp (scope) {
      this.selectedData.splice(scope.$index, 1)
      // const index = this.$refs.employeeTable.selection.findIndex(d => d[vm.recordId] === scope.row[vm.recordId])
      const item = this.employeeData.find(d => d[vm.recordId] === scope.row[vm.recordId])
      if (item) {
        this.$refs.employeeTable.toggleRowSelection(item)
        vm.isCheckAll = false
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
      let param = { pageNo: this.pagination4Emp.page, pageSize: this.pagination4Emp.size, auth: vm.auth, switchAreaFlag: vm.switchAreaFlag, areaId: '', onlyOwner: this.onlyOwner }
      this.$http.fetch(this.guideUrl, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            vm.employeeData = JSON.parse(JSON.stringify(resp.result.data))
            vm.allEmployeeData = JSON.parse(JSON.stringify(resp.result.data))
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
              if (vm.value[0] && typeof vm.value[0] === 'object') {
                param.userIds = vm.value.map(item => item.id).join(',')
              } else {
                param.userIds = vm.value.join(',')
              }
            }
            vm.$http.fetch(this.guideFindUrl, param).then(resp => {
              if (resp.result && resp.result.length > 0) {
                vm.selectedData = JSON.parse(JSON.stringify(resp.result))
                vm.$nextTick(function () {
                  vm.toggleRowSelection(vm.selectedData, vm.employeeData, vm.recordId)
                  vm.tableLoading = false
                })
              }
            })
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
      vm.isCheckAll = false
    },
    /**
     * 点击保存按钮
     */
    onSave () {
      if (this.validNull && this.selectedData.length < 1) {
        this.$notify.warning('请至少选择一个员工')
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
      this.$emit('inputAllData', data)
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
  },
  created: function () {
  }
}
