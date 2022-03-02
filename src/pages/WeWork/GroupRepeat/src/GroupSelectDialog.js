import NsDroptree from '../../../../components/NsDroptree'
import ElSelectLoad from '@nascent/nui/lib/select-load'

var tableMixin = {
  methods: {
    // 表格页数条数改变
    onSizeChange: function (val) {
      this.$set(this.pagination, 'currSize', val)
      this.$set(this.pagination, 'currPage', 1)
      this.reload()
    },
    // 当前页改变
    onPageChange: function (val) {
      this.$set(this.pagination, 'currPage', val)
      this.reload()
    },
    /**
     *  加载表格数据
     */
    reload: function () {
      let searchParams = {
        'searchMap': this.table.searchMap
      }
      if (searchParams.searchMap === undefined) {
        searchParams.searchMap = {}
      }
      // 是否全部群
      if (!this.isAll) {
        searchParams.searchMap.status = this.model.status
      }
      if (this.notBrand) {
        searchParams.searchMap.notBrand = this.notBrand
      }
      if (this.env === 'kd') {
        searchParams.searchMap.chatId = this.model.ChatID
        searchParams.searchMap.owner = this.model.ownerName
      } else {
        searchParams.searchMap.name = this.model.ChatID
        searchParams.searchMap.ownerName = this.model.ownerName
      }
      let params = Object.assign({}, this.limit, this.table.order, searchParams)
      this.queryTable(params)
    },
    /**
     * 查询表格数据
     * @param params
     */
    queryTable: function (params) {
      var that = this
      // 加载中
      that.tableLoading = true
      that.$http.fetch(that.$api.weWork.groupManager.getGroupNameList, params).then(resp => {
        if (resp.result && resp.result.data && resp.result.data.length > 0) {
          that.$set(that.table, 'data', resp.result.data)
          that.$set(that.pagination, 'total', parseInt(resp.result.recordsTotal))
        } else {
          // that.$set(that.table, 'data', [
          //   { chat_id: 'wraQfGDQAADv073g', 'name': '111', 'owner_name': 'zhang', person_num: 3, workShopName: ['梁小姐线下店1', '梁小哥线下店1', '渠道推广'] },
          //   { chat_id: 'wraQfGDQAADv073gF3aX7LCq_y1snM-g', 'name': '222', 'owner_name': 'zhang1', person_num: 10, workShopName: ['梁小姐线下店', '梁小哥线下店', '渠道推广008'] }
          // ])
          that.$set(that.table, 'data', [])
          that.$set(that.pagination, 'total', 0)
        }
      }).catch(() => {
        that.$notify.error('网络异常，获取数据失败！')
      }).finally(() => {
        if (that.pagination.total > 0) {
          that.$set(that.pagination, 'enable', true)
        } else {
          that.$set(that.pagination, 'enable', false)
        }
        that.tableLoading = false
        that.$nextTick(function () {
          that.toggleSelection(that.selectedData, that.table.data)
        })
      })
    }
  }
}
export default {
  name: 'GroupSelectDialog',
  components: {
    NsDroptree,
    ElSelectLoad
  },
  mixins: [tableMixin],
  data () {
    return {
      visible: false,
      table: {
        // 表格数据
        data: [],
        // 排序
        order: {
          orderKey: '',
          orderDir: ''
        },
        searchMap: {}
      },
      // 分页对象
      pagination: {
        enable: true,
        total: 0,
        currPage: 1,
        currSize: 10,
        sizeOpt: [10, 20, 50]
      },
      // 区域
      areas: [],
      areaTree: [],
      shopAreaId: '',
      // 门店
      allShops: [],
      shops: [],
      // 部门
      allDepartments: [],
      departments: [],
      departmentId: '',
      // url: this.$api.guide.chatRoomConfig.chatRoomCanJoinList,
      model: {
        ChatID: '', // 群名称
        ownerName: '', // 群主
        title: '',
        outerId: '',
        workShopId: '',
        departmentId: '',
        shopAreaId: '',
        name: '',
        cate: {
          text: '',
          value: ''
        },
        minPrice: '',
        maxPrice: '',
        shopCode: '',
        status: 0
      },
      selectedData: [],
      // 确认选择的数据
      confirmData: this.value || [],
      custom: 'custom',
      tableLoading: false,
      goodsLibs: [],
      wechatCustomers: [],
      groupAllList: [],
      groupList: [],
      searchMode: 2,
      userList: [],
      tags: []
    }
  },
  props: {
    env: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default: function () {
        return {
          chat_id: 'chat_id',
          name: 'name'
        }
      }
    },
    transSelectedData: {
      type: Function,
      default (data) {
        let transData = {}
        transData.chat_id = data.chat_id
        transData.guide_id = data.guide_id
        transData.name = data.name
        transData.owner_name = data.owner_name
        // transData.owner_work_num = data.owner_work_num
        transData.person_num = data.person_num
        transData.shop_id = data.shop_id
        transData.workShopName = this.env === 'kd' ? '' : data.workShopName ? data.workShopName.toString() : ''
        return transData
      }
    },
    maxSelectCount: {
      type: Number,
      default: function () {
        return 100
      }
    },
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    shopIds: {},
    isAll: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    notBrand: Boolean,
    isEdit: Boolean
  },
  methods: {
    showTableColumn: function () {
      return this.isEdit
    },
    /**
     *  删除已选择
     */
    onDelSelected: function (dataName, index, unique) {
      // 删除
      this.$data[dataName].splice(index, 1)
      // 表格是否渲染
      if (this.$refs.table) {
        for (let elem of this.table.data) {
          if (unique[this.props.chat_id] === elem[this.props.chat_id] && unique[this.props.name] === elem[this.props.name]) {
            // 删除表格选中
            this.$refs.table.toggleRowSelection(elem, false)
            break
          }
        }
      }
    },
    // 数组去重
    uniqueArray: function (array) {
      let result = []
      let hash = {}
      for (let elem of array) {
        let uniqueKey = elem[this.props.chat_id] + '_' + elem[this.props.name]
        if (!hash[uniqueKey]) {
          result.push(elem)
          hash[uniqueKey] = true
        }
      }
      return result
    },
    /**
     * 重置数据
     */
    resetData: function () {
      let that = this
      this.$set(this, 'selectedData', JSON.parse(JSON.stringify(this.confirmData)))
      this.$set(this, 'table', this.$options.data().table)
      this.$set(this, 'model', this.$options.data().model)
    },
    /**
     * 勾选表格选中
     */
    toggleSelection: function (selects, rows) {
      for (let row of rows) {
        for (let select of selects) {
          if (row[this.props.chat_id] === select[this.props.chat_id] && row[this.props.name] === select[this.props.name]) {
            this.$refs.table.toggleRowSelection(row, true)
            break
          }
        }
      }
    },
    handleSelectionChange (val) {
      this.selectedData = val
    },
    // 选中某行
    onSelectRow: function (selects, row) {
      // console.log('选中某行', selects, row)
      var check = false
      for (let select of selects) {
        if (select.chat_id === row.chat_id && select.name === row.name) {
          check = true
          break
        }
      }
      this.setSelectedData(check, row)
    },
    /**
     * 设置选中的数据
     **/
    setSelectedData: function (check, row) {
      var showSelectedList = this.selectedData
      // 选中
      if (check) {
        // debugger
        showSelectedList.push(row)
      } else {
        // 删除未勾选商品数据
        for (var j = 0; j < showSelectedList.length; j++) {
          if (showSelectedList[j][this.props.chat_id] === row[this.props.chat_id] && showSelectedList[j][this.props.name] === row[this.props.name]) {
            this.onDelSelected('selectedData', j, showSelectedList[j])
            break
          }
        }
      }
    },
    /**
     * 表格勾选所有数据
     */
    onSelectAll: function (selects) {
      if (selects.length === 0) {
        for (var i = 0; i < this.table.data.length; i++) {
          // 选中表格某行
          this.setSelectedData(false, this.table.data[i])
        }
      } else {
        for (let select of selects) {
          this.selectedData.push(this.transSelectedData(select))
        }
        this.selectedData = this.uniqueArray(this.selectedData)
      }
    },
    /**
     * 显示弹窗
     */
    onShow: function () {
      // 设置选中
      this.$set(this, 'selectedData', JSON.parse(JSON.stringify(this.confirmData)))
      this.visible = true
      let that = this
      let params = {}
      this.visible = true
      // 读取表格信息
      that.reload()
    },
    /**
     * 关闭弹窗
     */
    onClose: function () {
      this.visible = false
      this.resetData()
    },
    /**
     * 搜索
     */
    onSearch: function () {
      let searchMap = null
      if (this.env === 'kd') {
        searchMap = {
          chatId: this.model.ownerName,
          owner: this.model.ChatID,
          searchMode: this.searchMode
        }
      } else {
        if (this.model.workShopId && this.model.workShopId.length !== 0) {
          searchMap = {
            ownerName: this.model.ownerName,
            name: this.model.ChatID,
            departmentId: this.model.departmentId,
            workShopId: this.model.workShopId.toString(),
            searchMode: this.searchMode
          }
        } else {
          searchMap = {
            ownerName: this.model.ownerName,
            name: this.model.ChatID,
            departmentId: this.model.departmentId,
            searchMode: this.searchMode,
            shopAreaId: this.model.shopAreaId
          }
        }
      }
      this.$set(this.table, 'searchMap', searchMap)
      this.pagination.currPage = 1
      this.reload()
    },
    /**
     * 重置搜索条件
     */
    onResetSearch: function () {
      this.$set(this, 'model', this.$options.data().model)
      this.$set(this.table, 'searchMap', {})
      this.pagination.currPage = 1
      // this.getCustomerCorpTag()
      this.reload()
    },
    /**
     * 确认选择
     */
    onConfirm: function () {
      // if (this.selectedData.length > this.maxSelectCount) {
      //   this.$notify.warning('最多选择' + this.maxSelectCount + '件商品')
      // } else {
      if (this.searchMode === 2 && this.selectedData.length < 2) {
        this.$notify.warning('至少选择2个群聊')
      } else {
        this.confirmData = JSON.parse(JSON.stringify(this.selectedData))
        this.visible = false
        this.callbackData()
        this.onResetSearch()
      }
      // }
    },
    ownerNameChange: function (value) {
      // this.model.ChatID = ''
      if (value === '') {
        this.model.ownerName = ''
      } else {
        this.model.ownerName = value
      }
      this.onSearch()
    },
    groupChange: function (value) {
      if (value === '') {
        this.model.ChatID = ''
      } else {
        this.model.ChatID = value
      }
      this.onSearch()
    },
    getAllUser: function () {
      let that = this
      // 群名称列表
      this.$http.fetch(that.$api.weWork.groupManager.getGroupList,
        {})
        .then((resp) => {
          if (resp.success && resp.result.length > 0) {
            that.groupList = resp.result
          }
        }).catch(() => {
          this.$notify.error('加载群名称列表失败')
        })
      // 群主列表
      this.$http.fetch(that.$api.weWork.groupManager.getOwnerList, {}).then((resp) => {
        if (resp.success && resp.result.length > 0) {
          that.userList = resp.result
        }
      }).catch(() => {
        this.$notify.error('加载群主列表失败')
      })
    },
    /**
     * 获取区域树和门店列表
     */
    getAreasAndShops () {
      this.$http.fetch(this.$api.core.sysShop.getShopTree)
        .then((resp) => {
          if (resp.result) {
            this.areas = resp.result.shopAreaTree
            this.allShops = resp.result.shopOptions
            this.shops = resp.result.shopOptions
          }
        }).catch(() => {
          this.$notify.error('加载下拉树、下拉框数据失败')
        })
    },
    /**
     * 获取部门树
     */
    getDepartmentTree () {
      this.$http.fetch(this.$api.core.department.queryDepartmentTreeByYun)
        .then((resp) => {
          if (resp.result && resp.result.length > 0) {
            this.allDepartments = resp.result
            this.departments = resp.result
          }
        }).catch(() => {
          vm.$notify.error('查询部门树失败')
        })
    },
    /**
     * 加载区域树数据
     */
    loadAreaTree (node, resolve) {
      // console.log(this.areas)
      if (node.level === 0) {
        // 初次加载
        const rootTree = []
        for (let item of this.areas) {
          let parentId = item.parentId // 每一项的父级id
          let flag = false
          for (let item of this.areas) {
            if (parentId === item.id) {
              flag = true
              break
            }
          }
          if (!flag) {
            rootTree.push(item)
          }
        }
        // console.log(rootTree)
        return resolve(rootTree)
      }

      if (node.level >= 1) {
        // 点击之后触发
        const filter = this.areas.filter(data => parseInt(data.parentId) === parseInt(node.data.id))
        return resolve(filter)
      }
    },
    /**
     * 加载部门
     */
    loadDepartments (node, resolve) {
      if (node.level === 0) { // 第一次调用
        return resolve([{ id: 0, parentId: -1, code: 0, label: '全部', checked: false, showAdd: true, showEdit: true, showDelete: true }])
      }
      if (node.level >= 1) {
        // 点击之后触发
        let filter = this.allDepartments.filter(data => parseInt(data.parentId) === parseInt(node.data.id))
        return resolve(filter)
      }
    },
    workShopChange (value) {
      this.onSearch()
    },
    /**
     * 返回数据
     */
    callbackData: function () {
      this.$emit('childChange', this.confirmData, this.searchMode)
    }
  },
  watch: {
    value: function (val) {
      this.confirmData = JSON.parse(JSON.stringify(val))
    },
    confirmData: function (val) {
      this.selectedData = JSON.parse(JSON.stringify(val))
    },
    shopAreaId: function (o1, o2) {
      let shopOptions = []
      this.shopId = ''
      // this.model.shopAreaId = o1.value
      if (!o1.value || o1.value !== o2.value) {
        if (o1.value === 0) {
          this.shops = this.allShops
          return
        }
        let areaIdStr = '/' + o1.value + '/'
        this.allShops.map(item => {
          if (!o1.value || (item.ext && item.ext.indexOf(areaIdStr) !== -1)) {
            shopOptions.push(item)
          }
        })
        this.shops = shopOptions
        this.model.workShopId = ''
      }
      if (o1.value !== this.model.shopAreaId) {
        this.model.shopAreaId = o1.value
        this.onSearch()
      }
    },
    departmentId: function (val) {
      if (val.value !== this.model.departmentId) {
        this.model.departmentId = val.value
        this.onSearch()
      }
    }
  },
  mounted: function () {
    if (this.env === 'kd') {
      this.getAllUser()
    } else {
      this.getAreasAndShops()
      this.getDepartmentTree()
      // this.$searchAction$()
    }
  },
  computed: {
    'limit': function () {
      return {
        start: (this.pagination.currPage - 1) * this.pagination.currSize,
        length: this.pagination.currSize
      }
    }
  }
}
