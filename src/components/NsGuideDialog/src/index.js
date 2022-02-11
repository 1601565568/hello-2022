import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import { Object } from 'core-js'
import store from 'store/dist/store.legacy.min.js'

export default {
  name: 'NsGuideDialog',
  mixins: [tableMixin],
  props: {
    value: {
      default () {
        return []
      }
    },
    // 判断是否需要门店回显
    echoStore: {
      default () {
        return false
      }
    },
    guideUrl: {
      type: Object,
      default () {
        return this.$api.core.sysUser.queryGuidePage
      }
    },
    guideFindUrl: {
      type: Object,
      default () {
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
      default () {
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
    }
  },
  data () {
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
        name: '',
        shopId: '',
        shopIds: '',
        // 门店区域
        shopArea: {},
        // 类型 0导购 1店长
        job: null,
        mobile: '',
        fileImportKey: '', // 文件导入
        manualInputKey: '', // 手动输入导入
        // 1启用 2离职 3全部
        status: 3
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
  watch: {
    'departData.shopArea' (o1, o2) {
      let shopOptions = []
      this.departData.shopId = ''
      this.departData.shopIds = ''
      if (!o1.value || o1.value !== o2.value) {
        if (o1.value === 0) {
          this.shopOptions = this.allShopOptions
          return
        }
        let areaIdStr = '/' + o1.value + '/'
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(areaIdStr) !== -1)) {
            shopOptions.push(item)
          }
        })
        this.shopOptions = shopOptions
      }
    }
  },
  methods: {
    /**
     * 打开弹窗时的初始化事件
     */
    onDialogOpen () {
      if (this.isOpenDialogAfterRequest && !this.requestLoaded) {
        return
      }
      this.visible = true
      this.isCheckAll = false
      this.$nextTick(() => {
        this.departData.name = ''
        this.departData.mobile = ''
        this.departData.job = null
        this.departData.status = 3
        this.departData.selectedDepart = {}
        if (this.echoStore) {
          let areaData = store.get('user_area')
          this.departData.shopArea = {
            text: areaData.name,
            value: areaData.id
          }
        } else {
          this.departData.shopArea = {}
        } // 选择的门店区域
        this.departData.shopId = '' // 选择的门店
        this.getEmployeeList()
      })
    },
    /**
     * 部门树点击事件(懒加载)
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
     * 门店区域树点击事件(懒加载)
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadShopAreaNode (node, resolve) {
      let shopAreaTree = this.shopAreaTree
      if (node.level === 0) { // 第一次调用
        return resolve(this.getRootTree(this.shopAreaTree, this.isNeedLink ? store.get('user_area').id : null))
      }
      if (node.level >= 1) {
        // 点击之后触发
        let filter = shopAreaTree.filter(data => {
          return parseInt(data.parentId) === parseInt(node.data.id)
        })
        if (filter && filter.length > 0) {
          resolve(filter)
        } else {
          resolve([])
        }
      }
    },
    getRootTree (shopAreaTree, areaId = null) {
      const rootTree = []
      for (let item of shopAreaTree) {
        let parentId = item.parentId // 每一项的父级id
        let flag = false
        for (let item of shopAreaTree) {
          if (parentId === item.id) {
            flag = true
            break
          }
        }
        if (!flag && !areaId) {
          rootTree.push(item)
        } else if (areaId && item.id === areaId) {
          rootTree.push(item)
        }
      }
      return rootTree
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
          this.$notify.error('查询部门树失败')
        })
    },
    /**
     * 获取门店区域，所有门店选项
     */
    getShopAreaAndShop () {
      let isId = ''
      if (this.echoStore) {
        isId = store.get('user_area').id
      }
      let that = this
      that.$http.fetch(that.$api.core.sysShop.getShopTree)
        .then((resp) => {
          that.loading = false
          that.shopAreaTree = resp.result.shopAreaTree
          that.allShopOptions = resp.result.shopOptions
          // that.shopOptions = resp.result.shopOptions
          if (this.echoStore) {
            that.shopOptions = resp.result.shopOptions.filter(item => item.ext && item.ext.indexOf(isId) > -1)
          } else {
            that.shopOptions = resp.result.shopOptions
          }
          this.$nextTick(() => {
            this.requestLoaded = true
          })
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    /**
     * 重置搜索条件并搜索
     */
    resetSearch: function () {
      this.departData.name = ''
      this.departData.mobile = ''
      this.departData.job = ''
      this.departData.status = 3
      this.departData.selectedDepart = {}
      this.departData.shopArea = {} // 选择的门店分类
      this.departData.shopId = '' // 选择的门店
      this.departData.fileImportKey = '' // 文件导入key
      this.departData.manualInputKey = '' // 手动输入key
      this.successCount = 0 // 已导入员工数量
      this.$refs.import.reset()
      this.searchEmployee(1)
    },
    // 接收导入员工参数
    acceptImport (val) {
      this.successCount = val.successCount
      if (val.manualInputKey) {
        this.departData.manualInputKey = val.manualInputKey
      }
      if (val.fileImportKey) {
        this.departData.fileImportKey = val.fileImportKey
      }
    },
    /**
     * 搜索员工
     */
    searchEmployee (pageNo) {
      let data = []
      let total = 0
      this.pagination4Emp.page = pageNo
      let param = { pageNo: pageNo, pageSize: this.pagination4Emp.size }
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
          this.isCheckAll = false
        }).catch(() => {
          this.$notify.error('查询用户信息失败')
        }).finally(() => {
          this.allSearchEmployeeData = []
          // 员工数据
          this.employeeData = this.handleEmployeeList(JSON.parse(JSON.stringify(data)), this.departData.allDepartments)
          // 所有员工数据
          this.allEmployeeData = this.handleEmployeeList(JSON.parse(JSON.stringify(data)), this.departData.allDepartments)
          // 数据总数
          this.pagination4Emp.total = total
          this.$nextTick(() => {
            // 设置员工勾选状态
            this.toggleRowSelection(this.selectedData, this.employeeData, this.recordId)
            this.tableLoading = false
          })
        })
    },
    /**
     * 搜索全部员工
     */
    async searchAllEmployee () {
      if (this.allSearchEmployeeData.length > 0) {
        return this.allSearchEmployeeData
      }
      let param = { pageNo: 1, pageSize: 9999999 }
      this.setParam(param)
      // 请求获取员工数据
      await this.$http.fetch(this.guideUrl, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            this.allSearchEmployeeData = JSON.parse(JSON.stringify(resp.result.data))
          }
        }).catch(() => {
          this.$notify.error('查询用户信息失败')
        })
      return this.allSearchEmployeeData
    },
    /**
     * 初始化搜索值
     * @param param
     */
    setParam (param) {
      param.auth = this.auth
      param.switchAreaFlag = this.switchAreaFlag
      if (this.departData.name) {
        param.empName = this.departData.name
      }
      if (this.departData.job !== null) {
        param.job = this.departData.job
      }
      if (this.departData.status !== null) {
        param.status = this.departData.status
      }
      if (this.departData.mobile) {
        param.mobile = this.departData.mobile
      }
      if (this.departData.selectedDepart.value && parseInt(this.departData.selectedDepart.value) > 0) {
        let jointString = this.jointDepartId(this.departData.selectedDepart.value, this.departData.allDepartments)
        param.empDepar = jointString.join(',')
      }
      if (this.departData.shopId) {
        param.shopId = this.departData.shopId
      } else {
        if (this.departData.shopArea && this.departData.shopArea.value) {
          param.areaId = '-' + this.departData.shopArea.value + '-'
        }
      }
      if (this.departData.manualInputKey) {
        param.manualInputKey = this.departData.manualInputKey // 手动输入导入文件
      }
      if (this.$refs.import.model.redisKey !== '' && this.$refs.import.model.redisKey !== null) {
        param.fileImportKey = this.departData.fileImportKey // 表格导入文件
      }
      // if (this.departData.fileImportKey) {
      //   param.fileImportKey = this.departData.fileImportKey
      // }
    },
    /**
     * 拼接部门的id,所有子部门
     */
    jointDepartId (departId, allDepart) {
      let _jointString = [departId]
      if (departId && allDepart && allDepart.length > 0) {
        allDepart.forEach(index => {
          if (index.parentId && index.id && parseInt(index.parentId) === parseInt(departId)) {
            _jointString = _jointString.concat(this.jointDepartId(index.id, allDepart))
          }
        })
      }
      return _jointString
    },
    /**
     * 设置员工勾选状态
     */
    toggleRowSelection (selectedData, allData, idKey) {
      this.$nextTick(() => {
        for (let data of allData) {
          let index = selectedData.filter(index => data[idKey] === index[idKey])
          if (index.length > 0) {
            this.$refs['employeeTable'].toggleRowSelection(data, true)
          } else {
            this.$refs['employeeTable'].toggleRowSelection(data, false)
          }
        }
      })
    },
    /**
     * 员工列表点击选择
     */
    selectChange (select, scope) {
      if (this.selectedData.length > 0) {
        const index = this.selectedData.findIndex(d => d[this.recordId] === scope[this.recordId])
        if (index > -1) {
          this.selectedData.splice(index, 1)
          this.isCheckAll = false
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
          const index = this.selectedData.findIndex(d => d[this.recordId] === data[this.recordId])
          if (index > -1) {
            this.selectedData.splice(index, 1)
          }
        }
        this.isCheckAll = false
      } else {
        for (let data of select) {
          const index = this.selectedData.findIndex(d => d[this.recordId] === data[this.recordId])
          if (index === -1) {
            this.selectedData.push(data)
          }
        }
      }
    },
    /**
     * 员工列表点击条件全部选择事件
     */
    onSelectAllData () {
      this.searchAllEmployee().then(allEmployee => {
        let selectedData2 = []
        let selectedData3 = []
        // 已选择的有权限的员工
        let authSelectedData = []
        let allEmployeeMap = {}
        allEmployee.forEach((item) => {
          allEmployeeMap[item.id] = item
        })
        // 区分该批搜索数据中的权限数据
        this.selectedData.forEach((item) => {
          if (this.auth && item.auth) {
            // 没有权限的员工
            selectedData2.push(item)
          } else {
            if (allEmployeeMap[item.id]) {
              // 有操作权限的员工
              authSelectedData.push(item)
            } else {
              // 已经选择的员工中，存在条件筛选员工外的员工，叠加保留。
              selectedData3.push(item)
            }
          }
        })
        this.selectedData = []
        if (this.isCheckAll) {
          // 清空左边列表
          // this.$refs.employeeTable.clearSelection()
          return
        } else {
          // 左边列表全部勾选
          this.employeeData.forEach((item) => {
            if (allEmployeeMap[item.id]) {
              this.$refs.employeeTable.toggleRowSelection(item, true)
            }
          })
          selectedData3.forEach((item) => {
            selectedData2.push(item)
          })
          // 右边员工数据添加
          allEmployee.forEach((item) => {
            selectedData2.push(item)
          })
        }
        this.selectedData = selectedData2
        // this.isCheckAll = !this.isCheckAll
      })
    },
    clearSelection () {
      this.$refs.employeeTable.clearSelection()
      this.selectedData = []
    },
    /**
     * 右侧员工删除事件
     */
    removeEmp (scope) {
      this.selectedData.splice(scope.$index, 1)
      // const index = this.$refs.employeeTable.selection.findIndex(d => d[this.recordId] === scope.row[this.recordId])
      const item = this.employeeData.find(d => d[this.recordId] === scope.row[this.recordId])
      if (item) {
        this.$refs.employeeTable.toggleRowSelection(item)
        this.isCheckAll = false
      }
    },
    /**
     * 根据右边数据，勾选左边员工
     */
    resetInput () {
      if (this.employeeData.length > 0) {
        this.fileData()
      }
    },
    /**
     * 勾选处理逻辑
     */
    fileData () {
      if (this.$refs['employeeTable']) {
        this.$refs['employeeTable'].clearSelection()
      }
      this.$nextTick(() => {
        for (let indexDat of this.employeeData) {
          if (this.selectedData.filter(d => d[this.recordId] === indexDat[this.recordId]).length > 0) {
            this.$refs['employeeTable'].toggleRowSelection(indexDat, true)
          }
        }
      })
    },
    /**
     * 第一次打开组建，获取左侧用户列表，并联动右侧已选数据
     */
    getEmployeeList () {
      this.tableLoading = true
      let param = { pageNo: this.pagination4Emp.page, pageSize: this.pagination4Emp.size, auth: this.auth, switchAreaFlag: this.switchAreaFlag, areaId: this.departData.shopArea.value, status: this.departData.status }
      this.$http.fetch(this.guideUrl, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            this.employeeData = this.handleEmployeeList(JSON.parse(JSON.stringify(resp.result.data)), this.departData.allDepartments)
            this.allEmployeeData = this.handleEmployeeList(JSON.parse(JSON.stringify(resp.result.data)), this.departData.allDepartments)
          }
          if (resp.result.recordsTotal) {
            this.pagination4Emp.total = parseInt(resp.result.recordsTotal)
          } else {
            this.pagination4Emp.total = 0
          }
        }).catch(() => {
          this.$notify.error('查询用户信息失败')
        }).finally(() => {
          // 勾选默认值
          if (this.value && this.value.length > 0) {
            var param = {}
            param.pageNo = 1
            param.pageSize = 1
            if (this.value && this.value.length > 0) {
              if (this.value[0] && typeof this.value[0] === 'object') {
                param.userIds = this.value.map(item => item.id).join(',')
              } else {
                param.userIds = this.value.join(',')
              }
            }
            this.$http.fetch(this.guideFindUrl, param).then(resp => {
              if (resp.result && resp.result.length > 0) {
                this.selectedData = this.handleEmployeeList(JSON.parse(JSON.stringify(resp.result)), this.departData.allDepartments)
                this.$nextTick(() => {
                  this.toggleRowSelection(this.selectedData, this.employeeData, this.recordId)
                  this.tableLoading = false
                })
              }
            })
          } else {
            this.selectedData = []
          }
          this.$nextTick(() => {
            this.resetInput()
          })
          this.tableLoading = false
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
      this.visible = false
      this.isCheckAll = false
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
      this.visible = false
    },
    /**
     * 返回组建数据到父组件
     */
    callbackData (data) {
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
          result.push(item[this.recordId])
        })
      }
      return result
    },
    /**
     * 点击页码数量时触发获取员工列表刷新事件
     */
    $sizeChange$ (size) {
      this.pagination4Emp.size = size
      return this.searchEmployee(1)
    }
  },
  mounted () {
    // 获取部门树
    this.getDepartmentTree()
    // 区域树
    this.getShopAreaAndShop()
  }
}
