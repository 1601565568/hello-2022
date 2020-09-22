import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
let vm
export default {
  name: 'NsChatRoomDialog',
  mixins: [tableMixin],
  props: {
    value: {
      default: function () {
        return []
      }
    },
    selectedDataParent: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 是否添加登录账号店铺数据权限
    auth: {
      type: Boolean,
      default: true
    },
    dialogTitle: {
      type: String,
      default: '选择群聊'
    },
    btnTitle: {
      type: String,
      default: '+选择群聊'
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data: function () {
    return {
      // 左边树的数据
      employeeData: [],
      // 右边已选择数据
      selectedData: [],
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
        name: '',
        shopId: '',
        shopIds: '',
        // 门店分类
        shopCate: {},
        ownerName: ''
      },
      // 门店分类树
      shopCateTree: [],
      // 门店选择option
      shopOptions: [],
      allShopOptions: [],
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
  watch: {
    'departData.shopCate': function (o1, o2) {
      let shopOptions = []
      this.departData.shopId = ''
      this.departData.shopIds = ''
      if (!o1.value || o1.value !== o2.value) {
        if (o1.value === 0) {
          this.shopOptions = this.allShopOptions
          return
        }
        this.allShopOptions.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(o1.value) !== -1)) {
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
      vm.visible = true
      // 编辑使用.
      if (this.selectedDataParent.length > 0) {
        // ps: 这样会创建一个新的临时数据. 不会引用.
        let seledctDateReady = JSON.parse(JSON.stringify(this.selectedDataParent))
        this.selectedData = seledctDateReady
      }
      this.resetSearch()
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
     * 门店分类树点击事件(懒加载)
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadShopCateNode (node, resolve) {
      let shopCateTree = this.shopCateTree
      if (node.level === 0) { // 第一次调用
        return resolve([{
          id: 0,
          parentId: -1,
          code: 0,
          label: '全部'
        }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        let filter = shopCateTree.filter(data => {
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
     * 获取门店分类，所有门店选项
     */
    getShopCateAndShop: function () {
      let that = this
      that.$http.fetch(that.$api.core.sysShop.getShopTree)
        .then((resp) => {
          that.shopCateTree = resp.result.shopCateTree
          that.allShopOptions = resp.result.shopOptions
          that.shopOptions = resp.result.shopOptions
        }).catch(() => {
          that.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    /**
     * 重置搜索条件并搜索
     */
    resetSearch: function () {
      this.departData.name = ''
      this.departData.selectedDepart = {}
      this.departData.shopCate = {} // 选择的门店分类
      this.departData.shopId = '' // 选择的门店
      this.departData.ownerName = '' // 选择的门店
      this.getChatRoomList(1)
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
     * 群列表点击选择
     */
    selectChange (select, row) {
      // console.log(select)
      // console.log(row)
      if (this.selectedData.length >= 100) {
        this.$notify.error('群上限不允许超过100')
        this.$refs.employeeTable.toggleRowSelection(row, false)
        return
      }
      if (this.selectedData.length === 0 && row) {
        this.selectedData.push(row)
      } else {
        // 单选
        let index = this.selectedData.findIndex((value, index, array) => {
          return value.chatId === row.chatId
        })
        if (index > -1) {
          this.selectedData.splice(index, 1)
        } else {
          this.selectedData.push(row)
        }
      }
    },
    // 全选.
    selectAll (select) {
      if (select.length === 0) {
        for (let data of this.employeeData) {
          const index = this.selectedData.findIndex(d => d.chatId === data.chatId)
          if (index > -1) {
            this.selectedData.splice(index, 1)
          }
        }
      } else {
        for (let data of select) {
          const index = this.selectedData.findIndex(d => d.chatId === data.chatId)
          if (index === -1) {
            this.selectedData.push(data)
          }
        }
      }
    },
    /**
     * 右侧群删除事件,
     * ps: 必须使用自带得数据去 取消选中!!,  使用别的是不可以得.即使数据一样.
     */
    removeSelect (scope) {
      this.selectedData.splice(scope.$index, 1)
      this.employeeData.map(item => {
        if (item.chatId === scope.row.chatId) {
          this.$refs.employeeTable.toggleRowSelection(item, false)
        }
      })
    },
    /**
     * 第一次打开组建，获取左侧用户列表，并联动右侧已选数据
     */
    getChatRoomList (pageNo) {
      this.tableLoading = true
      let searchMap = {}
      searchMap.workShop = this.departData.shopId
      searchMap.departmentId = this.departData.selectedDepart.value
      searchMap.name = this.departData.name
      searchMap.ownerName = this.departData.ownerName
      if (pageNo) {
        this.pagination4Emp.page = pageNo
      }
      let param = { start: (this.pagination4Emp.page - 1) * this.pagination4Emp.size, length: this.pagination4Emp.size, searchMap: searchMap }
      this.$http.fetch(this.$api.guide.chatRoomConfig.chatRoomCanJoinList, param)
        .then(resp => {
          if (resp.result) {
            if (resp.result.data && resp.result.data.length > 0) {
              resp.result.data.forEach(item => {
                item.workShopName = item.workShopName.join(',')
                // 如果还有其他 需要转换写这里
                item.ownerWorkNum = item.owner_work_num
                item.personNum = item.person_num
                item.chatId = item.chat_id
                item.ownerName = item.owner_name
              })
            }
            this.employeeData = resp.result.data
            if (resp.result.recordsTotal) {
              this.pagination4Emp.total = parseInt(resp.result.recordsTotal)
            } else {
              this.pagination4Emp.total = 0
            }
          }
        }).catch(() => {
          this.$notify.error('查询群信息失败')
        }).finally(() => {
          // 勾选默认值
          this.employeeData.forEach(item => {
            this.selectedData.forEach(selectedItem => {
              if (selectedItem.chatId === item.chatId) {
                this.$refs.employeeTable.toggleRowSelection(item, true)
              }
            })
          })
          this.tableLoading = false
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
      if (this.selectedData.length < 1) {
        this.$notify.warning('请选择群组')
        return
      }
      if (this.selectedData.length > 100) {
        this.$notify.warning('群组上限100')
        return
      }
      let selectData = this.selectedData
      this.$emit('getChatRoomData', selectData)
      vm.visible = false
    },
    /**
     * 点击页码数量时触发获取员工列表刷新事件
     */
    $sizeChange$: function (size) {
      this.pagination4Emp.size = size
      return this.getChatRoomList(1)
    }
  },
  mounted: function () {
    vm = this
    // 获取部门树
    vm.getDepartmentTree()
    // 分类树
    vm.getShopCateAndShop()
  },
  created: function () {
  }
}
