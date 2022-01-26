
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
      searchParams.searchMap.chatId = this.model.ChatID
      searchParams.searchMap.ownerName = this.model.ownerName
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
          that.$set(that.table, 'data', [
            { 'ChatID': 'wrbyPeBgAAgIbJ9mOTboM2O-YqLvqZ7Q', 'Name': '111', 'OwnerName': 'zhang' },
            { 'ChatID': 'wrbyPeBgAAg', 'Name': '222', 'OwnerName': 'zhang1' }
          ])
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
  mixins: [tableMixin],
  data () {
    return {
      visible: false,
      table1: {
        data: [
          { 'ChatID': 'wrbyPeBgAAgIbJ9mOTboM2O-YqLvqZ7Q', 'Name': '111', 'OwnerName': 'zhang' },
          { 'ChatID': 'wrbyPeBgAAg', 'Name': '222', 'OwnerName': 'zhang1' }
        ]
      },
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
        currSize: 10
      },
      model: {
        ChatID: '',
        ownerName: '',
        title: '',
        outerId: '',
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
      searchMode: 1,
      userList: [{ UserID: 'all', Name: '不限' }],
      tags: []
    }
  },
  props: {
    props: {
      type: Object,
      default: function () {
        return {
          ChatID: 'ChatID',
          Name: 'Name'
        }
      }
    },
    transSelectedData: {
      type: Function,
      default (data) {
        let transData = {}
        transData.ChatID = data.ChatID
        transData.Name = data.Name
        transData.OwnerName = data.OwnerName
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
          if (unique[this.props.ChatID] === elem[this.props.ChatID] && unique[this.props.Name] === elem[this.props.Name]) {
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
        let uniqueKey = elem[this.props.ChatID] + '_' + elem[this.props.Name]
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
          if (row[this.props.ChatID] === select[this.props.ChatID] && row[this.props.Name] === select[this.props.Name]) {
            this.$refs.table.toggleRowSelection(row, true)
            break
          }
        }
      }
    },
    // 选中某行
    onSelectRow: function (selects, row) {
      var check = false
      for (let select of selects) {
        if (select.ChatID === row.ChatID && select.Name === row.Name) {
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
          if (showSelectedList[j][this.props.ChatID] === row[this.props.ChatID] && showSelectedList[j][this.props.Name] === row[this.props.Name]) {
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
      let searchMap = {
        ownerName: this.model.ownerName,
        chatID: this.model.ChatID,
        outerId: this.model.outerId,
        minPrice: this.model.minPrice,
        maxPrice: this.model.maxPrice,
        cid: this.model.cate.value,
        status: this.model.status
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
      if (this.selectedData.length > this.maxSelectCount) {
        this.$notify.warning('最多选择' + this.maxSelectCount + '件商品')
      } else {
        this.confirmData = JSON.parse(JSON.stringify(this.selectedData))
        this.visible = false
        this.callbackData()
        this.onResetSearch()
      }
    },
    ownerNameChange: function (value) {
      this.model.ChatID = ''
      if (value === '不限') {
        this.groupList = this.groupAllList
        return
      }
      for (var i = 0; i < this.userList.length; i++) {
        if (value === this.userList[i].Name) {
          this.groupList = this.userList[i].groupList
          return
        }
      }
    },
    groupChange: function (value) {
      if (value === '') {
        this.model.ownerName = '不限'
        this.model.ChatID = ''
        return
      } else {
        this.model.ChatID = value
      }
      for (var j = 0; j < this.groupList.length; j++) {
        if (value === this.groupList[j].ChatID) {
          for (var i = 0; i < this.userList.length; i++) {
            if (this.groupList[j].OwnerID === this.userList[i].UserID) {
              this.model.ownerName = this.userList[i].Name
              return
            }
          }
        }
      }
    },
    getAllUser: function () {
      let that = this
      this.$http.fetch(that.$api.weWork.groupManager.getAllUser,
        {})
        .then((resp) => {
          if (resp.success) {
            resp.result.length > 0 && resp.result.map((item) => {
              that._data.userList.push(item)
              that.groupAllList = that.groupAllList.concat(item.groupList)
              that.groupList = that.groupAllList
            })
          }
        }).catch(() => {
        })
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
    }
  },
  mounted: function () {
    this.getAllUser()
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
