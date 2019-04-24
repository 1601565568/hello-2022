import formMixin from 'mixins/form'
import treeMixin from '@/mixins/tree'
import ErrorCode from '@/config/errorCode'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

var vm
export default {
  mixins: [formMixin, treeMixin],
  data () {
    // 校验规则
    let rules = {
      'menu_name': [{
        required: true,
        message: '请输入菜单名称',
        trigger: ['blur', 'change']
      }, {
        min: 0,
        max: 50,
        message: '已超过可输入长度',
        trigger: 'blur'
      }, {
        validator: (rule, value, callback) => {
          var params = {
            id: vm.model.id ? vm.model.id : 0,
            name: value,
            parentId: vm.model.parent_id
          }
          vm.$http.fetch(vm.$api.core.menu.hasNameInBrotherExist, params).then((resp) => {
            if (resp.code === ErrorCode.TITLE_REPEAT) {
              callback(new Error('此菜单名称已存在,请重新输入'))
            } else {
              callback()
            }
          }).catch(() => {
            vm.$notify.error('远程校验失败')
          })
        },
        trigger: 'blur'
      }],
      'menu_code': [{
        required: true,
        message: '请输入编码',
        trigger: 'blur'
      }, {
        validator: (rule, value, callback) => {
          var params = {
            id: vm.model.id ? vm.model.id : 0,
            code: value
          }
          vm.$http.fetch(vm.$api.core.menu.hasCodeExist, params).then((resp) => {
            if (resp.code === ErrorCode.UNIQUE_REPEAT) {
              callback(new Error('此菜单编码已存在,请重新输入'))
            } else {
              callback()
            }
          }).catch(() => {
            vm.$notify.error('远程校验失败')
          })
        },
        trigger: 'blur'
      },
      {
        min: 0,
        max: 50,
        message: '已超过可输入长度',
        trigger: 'blur'
      }],
      'menu_type': [{
        required: true,
        message: '请选择所属类型',
        trigger: 'change'
      }],
      'menu_url': [{
        required: true,
        message: '请输入菜单URL',
        trigger: 'blur'
      }, {
        min: 0,
        max: 255,
        message: '已超过可输入长度',
        trigger: ['blur', 'change']
      }],
      'menu_icon_css': [{
        min: 0,
        max: 50,
        message: '已超过可输入长度',
        trigger: 'blur'
      }],
      'menu_sort': [{
        required: true,
        message: '请输入序号'
      }, {
        type: 'integer',
        message: '请输入正确的序号'
      }, {
        validator: (rule, value, callback) => {
          if (isNaN(value) || value <= 0 || !(/^\d+$/.test(value))) {
            callback(new Error('请输入有效正整数'))
          } else {
            callback()
          }
        }
      }],
      'remark': {
        min: 0,
        max: 250,
        message: '已超过可输入长度',
        trigger: ['blur', 'change']
      }
    }
    return {
      emptyText: '',
      treeData: [],
      loading: false,
      pathNames: '',
      filterText: '',
      model: {
        menu_type: 1,
        menu_name: '',
        menu_code: '',
        menu_url: '',
        menu_sort: 1,
        menu_icon_css: '',
        menu_status: 1,
        id: 0,
        remark: '',
        is_special: 0,
        menu_path: '',
        parent_id: 0
      },
      rules: rules,
      root: {
        id: '0',
        label: '菜单管理',
        code: 'root',
        parentId: '0',
        children: [],
        showAdd: true,
        disabled: true
      },
      currOperationNode: {},
      defaultExpandedKeys: ['0'],
      saveBtnLoading: false
    }
  },
  methods: {
    // 查询菜单树数据
    getTreeData: function () {
      vm.loading = true
      vm.root.children = []
      return vm.$http.fetch(vm.$api.core.menu.queryMenuTree).then((resp) => {
        vm.root.children = resp.result
        vm.$set(vm, 'treeData', [vm.root])
      }).catch(() => {
        vm.emptyText = vm.$t('prompt.noData')
        vm.$notify.error('加载失败')
      }).finally(() => {
        vm.loading = false
      })
    },
    onReset: function () {
      this.resetForm()
    },
    // 保存
    onSaveMenu: function () {
      vm.validAndSubmit({
        loading: 'saveBtnLoading',
        api: vm.$api.core.menu.saveOrUpdate,
        success: function (resp) {
          // 处理保存之后响应
          vm.handleSaveResponse(resp)
        },
        error: function () {
          vm.$notify.error(vm.savePromptMsg + '失败')
        }
      })
    },
    /**
     * 处理保存之后的响应
     * @param resp
     */
    handleSaveResponse: function (resp) {
      // 重新获取数据
      vm.$notify.success(resp.msg)
      if (resp.result) {
        if (vm.saveType === 'add') {
          if (vm.pathNames === '根节点') {
            vm.pathNames = ''
          }
          vm.pathNames += (resp.result.parent_id === '0' ? '' : '/') + resp.result.menu_name
          vm.$refs.tree.append({
            children: [],
            label: resp.result.menu_name,
            id: resp.result.id,
            parentId: resp.result.parent_id,
            showAdd: true,
            showDelete: true,
            showEdit: true,
            code: resp.result.menu_code,
            ext1: resp.result.menu_url
          }, vm.currOperationNode)
          vm.saveType = 'edit'
        }
        vm.$nextTick(() => {
          vm.$refs.tree.setCurrentKey(resp.result.id)
          vm.defaultExpandedKeys = [resp.result.id]
        })
        vm.model.id = resp.result.id
      }
    },
    // 点击添加按钮
    onAddClick: function (data, node) {
      vm.currOperationNode = data
      vm.resetForm()
      vm.saveType = 'add'
      if (data.id === '0') {
        vm.pathNames = '根节点'
        vm.model.parent_id = '0'
        vm.menu_path = data.id + '/'
        return
      }
      this.model.menu_level = node.level
      // 获取菜单路径
      let paths = this.getTreeParentPath(data, node)
      vm.model.menu_path = (paths.pathIds.join('/') + '/').replace('/0/', '')
      vm.pathNames = paths.pathNames.join('/')
      vm.model.parent_id = data.id
    },
    // 点击修改按钮
    onEditClick: function (data, node) {
      vm.currOperationNode = data
      vm.resetForm()
      if (data.id === '0') {
        vm.pathNames = '根节点'
        vm.model.parent_id = '0'
        return
      }
      // 设置为选中状态
      vm.$refs.tree.setCurrentKey(data.id)
      vm.saveType = 'edit'
      // 获取菜单路径
      let paths = this.getTreeParentPath(data, node)
      vm.pathNames = paths.pathNames.join('/')
      vm.$http.fetch(vm.$api.core.menu.queryMenuById, {
        id: data.id
      }).then(resp => {
        let data = resp.result
        let model = {
          menu_name: data.menu_name,
          menu_code: data.menu_code,
          menu_type: data.menu_type,
          menu_icon_css: data.menu_icon_css,
          menu_sort: data.menu_sort,
          id: data.id,
          menu_url: data.menu_url,
          parent_id: data.parent_id,
          menu_status: data.menu_status,
          menu_level: data.menu_level,
          remark: data.remark,
          is_special: data.is_special,
          menu_path: data.menu_path
        }
        // 回显数据
        vm.setModel(model)
      }).catch(() => {
        vm.$notify.error('查询失败')
      })
    },
    // 点击删除按钮
    onDeleteClick: function (data, node) {
      var url = vm.$api.core.menu.deleteById
      var params = { id: data.id, menuName: data.label }
      // 是否批量删除
      var batchDel = false
      if (!node.isLeaf) {
        // url = vm.$api.core.menu.deleteBatch
        // info = '将同时删除“' + data.label + '”下的子节点，是否确定删除？'
        // batchDel = true
        vm.$notify.warning('当前节点下有子节点，无法删除')
        return
      }
      if (batchDel) {
        params = {
          idList: vm.getTreeChildIds(data, node)
        }
      }
      apiRequestConfirm('删除“' + data.label + '”节点').then(() => {
        vm.loading = true
        vm.$http.fetch(url, params).then(resp => {
          vm.$notify.success(resp.msg)
          vm.resetForm()
          vm.$refs.tree.remove(data)
          // 设置为选中状态
          vm.$refs.tree.setCurrentKey('0')
          vm.pathNames = '根节点'
        }).catch(() => {
          vm.$notify.error('删除失败')
        }).finally(() => {
          vm.loading = false
        })
      }).catch(() => {
      })
    },
    /**
     * 节点拖拽结束
     * @param draggingNode
     * @param dropNode
     * @param position
     */
    onNodeDragEnd: function (draggingNode, dropNode, position) {
      // 拖拽结束处理
      let data = this.nodeDragEndDeal(draggingNode, dropNode, position)
      if (data) {
        let params = {
          id: data.id,
          menu_path: data.path.replace('/0/', ''),
          parent_id: data.parentId,
          menu_level: data.level
        }
        // 更新菜单路径
        this.updateMenuPath(params, draggingNode)
      }
    },
    /**
     * 更新菜单路径
     * @param param
     */
    updateMenuPath (params, node) {
      let that = this
      this.$http.fetch(this.$api.core.menu.updateMenuPath, params).then((resp) => {
        that.$set(node, 'data', Object.assign({}, node.data,
          { id: params.id, parentId: params.parent_id }))
        that.$notify.success(resp.msg)
      }).catch(() => {
        that.$refs.tree.refresh()
        that.$notify.error('修改失败')
      })
    },
    /**
     * 过滤树
     * @param val
     */
    filterNode (value, data) {
      if (!value) { return true }
      return data.label.indexOf(value) !== -1
    },
    onCloseNode () {
      setTimeout(function () {
        vm.$nextTick(() => {
          if (vm.$refs.pageLeft.$el.children[0].children[0].style.width === '99%') {
            vm.$refs.pageLeft.$el.children[0].children[0].style.width = '100%'
          } else {
            vm.$refs.pageLeft.$el.children[0].children[0].style.width = '99%'
          }
        })
      }, 450)
    }
  },
  created: function () {
    vm = this
  },
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted: function () {
    // 查询树数据
    this.getTreeData()
    vm.$nextTick(() => {
      // 设置为选中状态
      vm.$refs.tree.setCurrentKey('0')
      vm.pathNames = '根节点'
      vm.$refs.pageLeft.$el.children[0].style.maxHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 91 + 'px'
    })
  }
}
