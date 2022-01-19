import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'

export default {
  name: 'NsShopDialog',
  mixins: [tableMixin],
  props: {
    value: {
      default () {
        return []
      }
    },
    url: {
      type: Object,
      default () {
        return this.$api.core.sysShop.queryShopList
      }
    },
    // 默认方案：1：企微 2：个号
    plan: {
      type: Number,
      default: 1
    },
    // 是否添加登录账号店铺数据权限
    auth: {
      type: Boolean,
      default: true
    },
    dialogTitle: {
      type: String,
      default: '选择使用门店'
    },
    btnTitle: {
      type: String,
      default: '+选择使用门店'
    },
    type: {
      type: String,
      default: 'text'
    },
    validNull: {
      type: Boolean,
      default: false
    },
    // 是否修复全选bug 暂时只在优惠券使用
    isFix: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      allListData: [],
      allSearchEmployeeData: [],
      // 左边树的数据
      listData: [],
      // 右边已选择数据
      selectedData: [],
      // 复制勾选的数据
      selectCopyData: [],
      visible: false,
      isCheckAll: false,
      tableLoading: false,
      // 搜索数据封装
      param: {
        // 搜索名称
        name: '',
        shopId: '',
        shopIds: '',
        // 门店区域
        shopArea: {}
      },
      // 接口数据的key值name
      recordId: 'shop_id',
      // 页码
      pagination4Emp: {
        enable: true,
        size: 15,
        sizeOpts: [15, 25, 50, 100],
        page: 1,
        total: 0
      },
      // 门店区域树
      shopAreaTree: [],
      // 门店选择option
      shopOptions: [],
      allShopOptions: [],
      t: null // 全选防止重复点击
    }
  },
  computed: {},
  watch: {
    'param.shopArea' (o1, o2) {
      let shopOptions = []
      this.param.shopId = ''
      this.param.shopIds = ''
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
      this.visible = true
      this.isCheckAll = false
      this.$nextTick(() => {
        this.param.name = ''
        this.param.shopArea = {} // 选择的门店区域
        this.param.shopId = '' // 选择的门店
        this.getEmployeeList()
      })
    },
    /**
     * 重置搜索条件并搜索
     */
    resetSearch () {
      this.param.name = ''
      this.param.shopArea = {} // 选择的门店区域
      this.param.shopId = '' // 选择的门店
      this.searchEmployee(1)
    },
    /**
     * 搜索列表数据
     */
    searchEmployee (pageNo) {
      let data = []
      let total = 0
      this.pagination4Emp.page = pageNo
      let param = { start: (pageNo - 1) * this.pagination4Emp.size, length: this.pagination4Emp.size, searchMap: { plan: this.plan, auth: this.auth } }
      if (this.param.name) {
        param.searchMap.shopName = this.param.name
      }
      if (this.param.shopId) {
        param.searchMap.shopId = this.param.shopId
      } else {
        if (this.param.shopArea && this.param.shopArea.value) {
          param.searchMap.areaId = '-' + this.param.shopArea.value + '-'
        }
      }
      // 请求获取列表数据
      this.$http.fetch(this.url, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            data = JSON.parse(JSON.stringify(resp.result.data))
          }
          if (resp.result.recordsTotal) {
            total = parseInt(resp.result.recordsTotal)
          }
          this.isCheckAll = false
        }).catch(() => {
          this.$notify.error('请求数据信息失败')
        }).finally(() => {
          this.allSearchEmployeeData = []
          // 列表数据
          this.listData = JSON.parse(JSON.stringify(data))
          // 备份列表数据
          this.allListData = JSON.parse(JSON.stringify(data))
          // 数据总数
          this.pagination4Emp.total = total
          this.$nextTick(() => {
            // 设置列表数据勾选状态
            this.toggleRowSelection(this.selectedData, this.listData, this.recordId)
            this.tableLoading = false
          })
        })
    },
    /**
     * 获取全部列表数据
     */
    async searchAllEmployee () {
      if (this.allSearchEmployeeData.length > 0) {
        return this.allSearchEmployeeData
      }
      let param = { start: 0, length: 999999, searchMap: { plan: this.plan, auth: this.auth } }
      if (this.param.name) {
        param.searchMap.shopName = this.param.name
      }
      if (this.param.shopId) {
        param.searchMap.shopId = this.param.shopId
      } else {
        if (this.param.shopArea && this.param.shopArea.value) {
          param.searchMap.areaId = '-' + this.param.shopArea.value + '-'
        }
      }
      // 请求获取列表数据
      await this.$http.fetch(this.url, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            this.allSearchEmployeeData = JSON.parse(JSON.stringify(resp.result.data))
          }
        }).catch(() => {
          this.$notify.error('请求数据信息失败')
        })
      return this.allSearchEmployeeData
    },
    /**
     * 设置列表数据勾选状态
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
     * 列表点击选择
     */
    selectChange (select, scope) {
      if (this.selectedData.length > 0) {
        const index = this.selectedData.findIndex(d => d[this.recordId] === scope[this.recordId])
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
          const index = this.selectedData.findIndex(d => d[this.recordId] === data[this.recordId])
          if (index > -1) {
            this.selectedData.splice(index, 1)
          }
        }
      } else {
        for (let data of select) {
          const index = this.selectedData.findIndex(d => d[this.recordId] === data[this.recordId])
          if (index === -1) {
            this.selectedData.push(data)
          }
        }
      }
    },
    // 全选先触发防抖
    handleSelectAll () {
      clearTimeout(this.t)
      this.t = setTimeout(() => {
        this.onSelectAllData()
      }, 500)
    },
    /**
     * 员工列表点击条件全部选择事件
     */
    onSelectAllData () {
      this.searchAllEmployee().then(allEmployee => {
        let selectedData2 = []
        let selectedData3 = []
        let authSelectedData = []
        let allEmployeeMap = {}
        allEmployee.forEach((item) => {
          allEmployeeMap[item.id] = item
        })
        this.selectedData.forEach((item) => {
          if (this.auth && item.auth) {
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
          this.$refs.employeeTable.clearSelection()
        } else {
          this.listData.forEach((item) => {
            this.$refs.employeeTable.toggleRowSelection(item, true)
          })
          if (!this.isFix) {
            selectedData3.forEach((item) => {
              selectedData2.push(item)
            })
          }
          allEmployee.forEach((item) => {
            if (!selectedData3.find(items => items.shop_id === item.shop_id)) {
              selectedData2.push(item)
            }
          })
        }
        this.selectedData = selectedData2
        if (this.isFix) {
          this.isCheckAll = false
        } else {
          this.isCheckAll = !this.isCheckAll
        }
      })
    },
    // 删除所有人员
    removeAll () {
      this.$refs.employeeTable.clearSelection()
      this.selectedData = []
    },
    /**
     * 右侧数据删除事件
     */
    removeEmp (scope) {
      this.selectedData.splice(scope.$index, 1)
      const index = this.$refs['employeeTable'].selection.findIndex(d => d[this.recordId] === scope.row[this.recordId])
      if (index > -1) {
        this.$refs['employeeTable'].selection.splice(index, 1)
        this.isCheckAll = false
      }
      if (this.$refs['employeeTable'].selection.length === 0) {
        this.$refs['employeeTable'].clearSelection()
      }
    },
    /**
     * 根据右边数据，勾选左边数据
     */
    resetInput () {
      if (this.listData.length > 0) {
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
        for (let indexDat of this.listData) {
          if (this.selectedData.filter(d => d[this.recordId] === indexDat[this.recordId]).length > 0) {
            this.$refs['employeeTable'].toggleRowSelection(indexDat, true)
          }
        }
      })
    },
    /**
     * 第一次打开组建，获取左侧列表，并联动右侧已选数据
     */
    getEmployeeList () {
      this.tableLoading = true
      let param = { start: (this.pagination4Emp.page - 1) * this.pagination4Emp.size, length: this.pagination4Emp.size, searchMap: { plan: this.plan, auth: this.auth } }
      this.$http.fetch(this.url, param)
        .then(resp => {
          if (resp.result && resp.result.data && resp.result.data.length > 0) {
            this.listData = JSON.parse(JSON.stringify(resp.result.data))
            this.allListData = JSON.parse(JSON.stringify(resp.result.data))
          }
          if (resp.result.recordsTotal) {
            this.pagination4Emp.total = parseInt(resp.result.recordsTotal)
          } else {
            this.pagination4Emp.total = 0
          }
        }).catch(() => {
          this.$notify.error('请求数据信息失败')
        }).finally(() => {
          // 勾选默认值
          if (this.value && this.value.length > 0) {
            var param = {}
            if (this.value && this.value.length > 0) {
              param.shopIds = this.value.join(',')
            }
            this.$http.fetch(this.$api.core.sysShop.getShopListByShopIds, param).then(resp => {
              if (resp.result && resp.result.length > 0) {
                this.selectedData = JSON.parse(JSON.stringify(resp.result))
                this.$nextTick(() => {
                  this.toggleRowSelection(this.selectedData, this.listData, this.recordId)
                  this.tableLoading = false
                })
              }
            }).catch((ee) => {})
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
     * 关闭弹窗
     */
    onDialogClose () {
      this.visible = false
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
      this.visible = false
    },
    /**
     * 返回组建数据到父组件
     */
    callbackData (data) {
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
          result.push(item[this.recordId])
        })
      }
      return result
    },
    /**
     * 点击页码数量时触发获取列表刷新事件
     */
    $sizeChange$ (size) {
      this.pagination4Emp.size = size
      return this.searchEmployee(1)
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
        return resolve(this.getRootTree(this.shopAreaTree))
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
    getRootTree (shopAreaTree) {
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
        if (!flag) {
          rootTree.push(item)
        }
      }
      return rootTree
    },
    /**
     * 获取门店区域，所有门店选项
     */
    getShopAreaAndShop () {
      let that = this
      that.$http.fetch(that.$api.core.sysShop.getShopTree)
        .then((resp) => {
          that.shopAreaTree = resp.result.shopAreaTree
          that.allShopOptions = resp.result.shopOptions
          that.shopOptions = resp.result.shopOptions
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
    }
  },
  mounted () {
    // 分类树
    this.getShopAreaAndShop()
  }
}
