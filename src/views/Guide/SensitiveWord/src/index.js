import tableMixin from 'web-crm/src/mixins/table'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  data: function () {
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
          this.$emit('add')
        },
        'name': '新增敏感词'
      },
      {
        'func': function () {
          this.$emit('add')
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
      // 树加载
      treeLoading: false,
      // 分组列表，可能过滤
      groupList: [],
      // 所有分组列表
      dbGroupList: [],
      loading: false,
      // 全部分组
      allGroupArr: { id: null, pId: null, label: '全部敏感词' },
      // 表格
      model: { groupId: null, name: null },
      _pagination: pagination,
      _table: {
        table_buttons: tableButtons,
        quickSearchMap: {}
      },
      _queryConfig: { expand: false },
      multipleSelection: [],
      url: this.$api.guide.sensitiveWord.findWordList,
      currGroupId: null
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
    // 添加分组
    addGroup (name, parentGroupId, callback) {
      let _this = this
      _this.treeLoading = true
      let params = { name: name, parentGroupId: parentGroupId }
      this.$http.fetch(_this.$api.guide.sensitiveWord.saveGroup, params).then(resp => {
        if (resp.success) {
          if (callback != null) {
            callback()
          }
          _this.$notify.info('添加分组成功')
        } else {
          _this.$notify.error(resp.message)
        }
        _this.loadGroupList()
      })
    },
    // 修改分组
    updateGroup (name, id) {
      let _this = this
      _this.treeLoading = true
      let params = { name: name, id: id }
      this.$http.fetch(this.$api.guide.sensitiveWord.updateGroup, params).then(resp => {
        if (resp.success) {
          _this.setAddTreeNodePanelDisplay(false)
          _this.$notify.info('修改分组成功')
        } else {
          _this.$notify.error(resp.message)
        }
        _this.loadGroupList()
      })
    },
    // 删除分组
    removeGroup (oriGroupId, targetGroupId) {
      let _this = this
      let params = { oriGroupId: oriGroupId, targetGroupId: targetGroupId }
      _this.$http.fetch(_this.$api.guide.sensitiveWord.removeGroup, params).then(resp => {
        _this.loadGroupList()
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
    showEditGroupMsgBox (nodeData, isAdd) {
      let _this = this
      let title = isAdd ? '新增分组' : '修改分组'
      _this.$prompt('请输入分组', title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: isAdd ? '' : _this.getGroupNameFromTreeNode(nodeData)
      }).then(({ value }) => {
        if (isAdd) {
          // 新增
          _this.addGroup(value, nodeData.id, null)
        } else {
          // 修改
          _this.updateGroup(value, nodeData.id)
        }
      })
    },
    // 添加一级分组
    addRootGroup () {
      let _this = this
      _this.addGroup(_this.groupName, 0, () => {
        _this.setAddTreeNodePanelDisplay(false)
      })
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
      this.currGroupId = data.id
      _this.loading = true
      _this.$reload().then(rep => {
        _this.loading = _this._data._loading
      })
    },
    moment (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    '$handleParams': function (params) {
      let _this = this
      params.searchMap.groupId = this.currGroupId
      return params
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
