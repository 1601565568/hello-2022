import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import moment from 'moment'
import LocalStorage from 'store/dist/store.legacy.min.js'
import { getErrorMsg } from '@/utils/toast'

export default {
  mixins: [tableMixin],
  data: function () {
    let that = this
    let pagination = {
      enable: true,
      size: 15,
      sizeOpts: [15, 25, 50, 100],
      page: 1,
      total: 0
    }
    const tableButtons = [
      {
        'func': function () {
          that.showWordDetailDlg({})
        },
        'name': '新增敏感词'
      },
      {
        'func': function () {
          this.$router.push({ path: '/ContentMange/SensitiveWord/monitor' })
        },
        'name': '敏感词监控'
      }
    ]
    return {
      // 过滤树节点值
      filterTreeText: '',
      // 当前鼠标移动到的分组
      currentNodeId: 0,
      // 是否显示树编辑面板
      isShowAddTreeNodePanel: false,
      // 分组名称
      groupName: '',
      // 删除分组窗口
      removeGroupDialogVisible: false,
      // 删除分组窗口提示信息
      removeGroupText: '',
      // 删除分组窗口选择器
      removeGroupSelectVisible: false,
      // 树加载
      treeLoading: false,
      // 分组列表，可能过滤
      groupList: [],
      // 所有分组列表
      dbGroupList: [],
      // 删除分组下拉框选项
      groupOptionsInRemoveGroupDlg: [],
      // 删除分组下拉框值
      groupInRemoveGroupDlg: null,
      loading: false,
      // 全部分组
      allGroupArr: { id: null, pId: null, label: '全部敏感词' },
      // 表格
      model: { wordGroupId: null, name: null },
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      url: this.$api.guide.sensitiveWord.findWordList,
      isShowSelecntInRemoveGroup: false,
      searchGroupIds: null,
      removeGroupModel: {
        oriGroupId: null,
        targetGroupId: null
      },
      wordDetailDlgVisible: false,
      // 新增敏感词分组下拉框选项
      groupOptionsInWordDlg: [],
      wordDetailForm: { name: null, wordGroupId: null },
      wordDetailRules: {
        name: [
          { required: true, message: '请输入敏感词', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        wordGroupId: [
          { required: true, message: '请选择分组', trigger: 'change' }
        ]
      },
      saveWordDisabled: false,
      groupDetailForm: { id: null, name: null, parentGroupId: null },
      groupDetailDlgVisible: false,
      groupDetailRules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      saveGroupDisabled: false,
      addGroupTitle: null,
      addGroupNameLabel: null,
      removeGroupDlgWidth: '400px',
      removeGroupDlgHeight: '300px',
      clickGroupId: null
    }
  },
  methods: {
    // 树初始化
    loadGroupList () {
      this.treeLoading = true
      this.$http.fetch(this.$api.guide.sensitiveWord.getGroupTree).then(resp => {
        if (resp.success && resp.result != null) {
          this.groupList = resp.result
          this.dbGroupList = resp.result
          this.groupList.unshift(this.allGroupArr)
          // 数据放在名称后面
          let count = 0
          for (const node of resp.result) {
            if (node.ext1 != null) {
              count += parseInt(node.ext1)
            }
          }
          this.allGroupArr.label = '全部敏感词(' + count + ')'
          // 刷新下拉框
          this.groupOptionsInRemoveGroupDlg = this.getGroupOptions(this.removeGroupModel.oriGroupId)
          this.groupOptionsInWordDlg = this.getGroupOptions(null)
        }
        this.treeLoading = false
      })
    },
    // 显示添加分组面板
    setAddTreeNodePanelDisplay (isShow) {
      if (!isShow) {
        this.groupName = ''
      }
      this.isShowAddTreeNodePanel = isShow
    },
    // 删除分组
    showRemoveGroupDlg (data) {
      this.removeGroupModel.oriGroupId = data.id
      this.removeGroupModel.targetGroupId = null
      let _this = this
      let params = { id: data.id }
      _this.$http.fetch(_this.$api.guide.sensitiveWord.hasWordInGroup, params).then(resp => {
        _this.removeGroupText = '<font size=\'5\' color="#E6A23C"><Icon type=\'exclamation-circle\' theme=\'outlined\' /></font>&nbsp;&nbsp;确认要删除 <font class="text-danger">' + _this.getGroupNameFromTreeNode(data) + ' </font>分组吗?'
        _this.removeGroupSelectVisible = resp.result
        _this.removeGroupDialogVisible = true
        _this.groupInRemoveGroupDlg = null
        _this.isShowSelecntInRemoveGroup = resp.result
        if (resp.result) {
          // 加载分组options
          _this.groupOptionsInRemoveGroupDlg = _this.getGroupOptions(this.removeGroupModel.oriGroupId)
          _this.removeGroupDlgWidth = '500px'
          _this.removeGroupDlgHeight = '240px'
        } else {
          _this.removeGroupDlgWidth = '500px'
          _this.removeGroupDlgHeight = '155px'
        }
      })
    },
    // 加载迁移分组下拉框
    getGroupOptions (exceptGroupId) {
      let options = []
      for (const row of this.dbGroupList) {
        if (row.id !== null && row.id > 0) {
          if (exceptGroupId == null || row.id !== exceptGroupId) {
            this.addOption(options, row, '', exceptGroupId)
          }
        }
      }
      return options
    },
    addOption (options, row, prefix, exceptGroupId) {
      // 自身
      const label = this.getGroupNameFromTreeNode(row)
      options.push({ value: row.id, label: label, prefix: prefix })
      // 子节点
      if (row.children != null && row.children.length > 0) {
        for (const childRow of row.children) {
          const childPrefix = prefix + label
          if (childRow.id !== exceptGroupId) {
            this.addOption(options, childRow, childPrefix)
          }
        }
      }
    },
    // 删除分组
    submitRemoveGroup () {
      this.$refs.removeGroupForm.validate((valid) => {
        if (valid) {
          let _this = this
          _this.$http.fetch(_this.$api.guide.sensitiveWord.removeGroup, this.removeGroupModel).then(resp => {
            _this.removeGroupDialogVisible = false
            _this.loadGroupList()
          })
        } else {
          return false
        }
      })
    },
    // 删除分组
    removeWord (row) {
      this.$confirm('请确认是否删除敏感词?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _this = this
        let params = { id: row.id }
        _this.$http.fetch(_this.$api.guide.sensitiveWord.removeWord, params).then(resp => {
          _this.$message({
            type: 'success',
            message: '删除成功!'
          })
          _this.loadGroupList()
          _this.$reload()
        })
      })
    },
    // 是否显示树节点的编辑面板
    isShowTreeNodePlus (nodeId) {
      return this.currentNodeId === nodeId
    },
    // 设置鼠标移到树节点
    setCurrentNodeId (nodeId) {
      this.currentNodeId = nodeId
    },
    // 新增二级分组/修改分组
    showEditGroupDlg (nodeData, isAdd) {
      this.groupDetailDlgVisible = true
      this.addGroupTitle = isAdd ? '新增' : '修改'
      this.saveGroupDisabled = false

      this.groupDetailForm.id = null
      this.groupDetailForm.name = isAdd ? null : this.getGroupNameFromTreeNode(nodeData)
      this.addGroupNameLabel = '一级分组名称'
      this.groupDetailForm.parentGroupId = 0
      if (nodeData != null) {
        this.groupDetailForm.id = isAdd ? null : nodeData.id
        this.groupDetailForm.parentGroupId = isAdd ? nodeData.id : nodeData.parentGroupId
        if (isAdd || nodeData.parentId !== '0') {
          this.addGroupNameLabel = '二级分组名称'
        }
      }
    },
    // 添加分组
    saveGroup () {
      this.$refs.groupDetailForm.validate((valid) => {
        if (valid) {
          let _this = this
          this.saveGroupDisabled = true
          _this.$http.fetch(_this.$api.guide.sensitiveWord.saveGroup, this.groupDetailForm).then(resp => {
            _this.groupDetailDlgVisible = false
            _this.treeLoading = true
            _this.$reload().then(rep => {
              _this.treeLoading = false
            })
            this.loadGroupList()
            _this.$notify.success('保存分组成功')
          }).catch(resp => {
            _this.$notify.error(resp.msg)
            this.saveGroupDisabled = false
          })
        } else {
          return false
        }
      })
    },
    renderHeaderGuideCount (h, data) {
      return h('div', {
        attrs: {
          class: 'cell',
          style: 'margin-top:7px'
        }
      }, [h('span', ['导购发送次数']), h('icon', {
        attrs: {
          type: 'question-circle',
          theme: 'filled',
          class: 'bg-white',
          effect: 'light',
          content: '敏感词在导购所发送的消息中出现的次数',
          placement: 'bottom'
        }
      }, [h('i', { 'type': 'question-circle', 'theme': 'filled', style: 'color:rgb(153, 153, 153)' })])])
    },
    renderHeaderCustomerCount (h, data) {
      return h('div', {
        attrs: {
          class: 'cell',
          style: 'margin-top:7px'
        }
      }, [h('span', ['会员发送次数']), h('el-tooltip', {
        attrs: {
          type: 'question-circle',
          theme: 'filled',
          class: 'bg-white',
          effect: 'light',
          content: '敏感词在会员所发送的消息中出现的次数',
          placement: 'bottom'
        }
      }, [h('i', { 'type': 'question-circle', 'theme': 'filled', style: 'color:rgb(153, 153, 153)' })])])
    },
    // 从树节点label获取名称
    getGroupNameFromTreeNode (nodeData) {
      let name = nodeData.label
      let index = name.lastIndexOf('(')
      if (index !== -1) {
        name = name.substring(0, index).trim()
      }
      return name
    },
    // 树节点过滤,去掉数量
    onFilterNode (value, data) {
      return this.getGroupNameFromTreeNode(data).indexOf(value) !== -1
    },
    // 点击分组
    onClickNode (data) {
      let _this = this
      this.clickGroupId = data.id
      this.searchGroupIds = this.getAccessibleGroup(data)
      _this.loading = true
      _this.$reload().then(rep => {
        _this.loading = _this._data._loading
      })
    },
    // 获取所有可访问的分组，包含子节点
    getAccessibleGroup (data) {
      if (data.id === null) {
        return null
      }
      let ret = ',' + data.id
      // 子节点
      if (data.children !== null) {
        for (const children of data.children) {
          ret += ',' + this.getAccessibleGroup(children)
        }
      }
      return ret.substr(1)
    },
    // 点击数量
    clickCount (row, memberSend) {
      this.$router.push({ name: 'SensitiveWord_monitor', params: { name: row.name, memberSend: memberSend } })
    },
    moment (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    '$handleParams': function (params) {
      params.searchMap.wordGroupId = this.searchGroupIds
      return params
    },
    // 新增/修改敏感词
    showWordDetailDlg () {
      this.saveWordDisabled = false
      this.wordDetailForm.name = null
      this.wordDetailForm.wordGroupId = this.clickGroupId
      this.wordDetailForm.creatorName = LocalStorage.get('remumber_login_info').name
      this.wordDetailDlgVisible = true
      this.groupOptionsInWordDlg = this.getGroupOptions(null)
    },
    // 保存敏感词
    saveWord () {
      this.$refs.wordDetailForm.validate((valid) => {
        if (valid) {
          let _this = this
          this.saveWordDisabled = true
          _this.$http.fetch(_this.$api.guide.sensitiveWord.saveWord, this.wordDetailForm).then(resp => {
            _this.wordDetailDlgVisible = false
            _this.loading = true
            _this.$reload().then(rep => {
              _this.loading = _this._data._loading
            })
            this.loadGroupList()
            _this.$notify.success('保存成功')
          }).catch(resp => {
            _this.$notify.error(resp.msg)
            this.saveWordDisabled = false
          })
        } else {
          return false
        }
      })
    }
  },
  // 初始化
  mounted: function () {
    let _this = this
    this.loadGroupList()
    if (typeof _this.$init !== 'function') {
      _this.$reload()
    }
  },
  watch: {
    // 导购树过滤
    filterTreeText (val) {
      this.$refs.groupTree.filter(val)
    }
  }
}
