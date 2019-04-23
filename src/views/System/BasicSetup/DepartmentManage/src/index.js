import formMixin from 'mixins/form'
import treeMixin from 'mixins/tree'
import ErrorCode from '@/config/errorCode'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

var vm
export default {
  mixins: [formMixin, treeMixin],
  data () {
    // 校验规则
    let rules = {
      'departmentName': [{
        required: true,
        message: '请输入部门名称',
        trigger: ['blur', 'change']
      }, {
        min: 0,
        max: 30,
        message: '已超过可输入长度',
        trigger: ['blur', 'change']
      }, {
        validator: (rule, value, callback) => {
          var params = {
            id: vm.model.id ? vm.model.id : 0,
            name: value,
            parentId: vm.model.parentId
          }
          vm.$http.fetch(vm.$api.core.department.hasNameInBrotherExist, params).then((resp) => {
            if (resp.code === ErrorCode.TITLE_REPEAT) {
              callback(new Error('此部门名称已存在,请重新输入'))
            } else {
              callback()
            }
          }).catch(() => {
            vm.$notify.error('远程校验失败')
          })
        },
        trigger: 'blur'
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
        departmentName: '',
        departmentCode: '',
        id: 0,
        remark: '',
        parentId: 0,
        departmentPath: ''
      },
      rules: rules,
      root: {
        id: '0',
        label: '组织架构管理',
        code: 'root',
        parentId: '0',
        children: [],
        showAdd: true,
        disabled: true
      },
      defaultExpandedKeys: ['0'],
      currOperationNode: {},
      saveBtnLoading: false
    }
  },
  methods: {
    // 查询菜单树数据
    getTreeData: function () {
      vm.loading = true
      vm.root.children = []
      return vm.$http.fetch(vm.$api.core.department.queryDepartmentTree).then((resp) => {
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
    onSave: function () {
      vm.validAndSubmit({
        loading: 'saveBtnLoading',
        api: vm.$api.core.department.saveOrUpdate,
        handleParams: vm.handleSubmitParams,
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
          vm.pathNames += (resp.result.parent_id === '0' ? '' : '/') + resp.result.department_name
          vm.saveType = 'edit'
          vm.$refs.tree.append({
            children: [],
            label: resp.result.department_name,
            id: resp.result.id,
            parentId: resp.result.parent_id,
            showAdd: true,
            showDelete: true,
            showEdit: true
          }, vm.currOperationNode)
        }
        vm.$nextTick(() => {
          vm.$refs.tree.setCurrentKey(resp.result.id)
          vm.defaultExpandedKeys = [resp.result.id]
        })
        vm.model.id = resp.result.id
      }
    },
    /**
     * 处理提交参数
     * @param params
     * @returns {*}
     */
    handleSubmitParams: function (params) {
      return this.transObjProp2Underline(params)
    },
    // 点击添加按钮
    onAddClick: function (data, node) {
      vm.currOperationNode = data
      vm.resetForm()
      vm.saveType = 'add'
      // 判断是否虚拟根节点
      if (data.id === '0') {
        vm.pathNames = '根节点'
        vm.model.parentId = '0'
        vm.model.departmentPath = ''
        return
      }
      // 获取菜单路径
      let paths = this.getTreeParentPath(data, node)
      vm.model.departmentPath = (paths.pathIds.join('/') + '/').replace('/0/', '')
      vm.pathNames = paths.pathNames.join('/')
      vm.model.parentId = data.id
    },
    // 点击修改按钮
    onEditClick: function (data, node) {
      vm.currOperationNode = data
      vm.resetForm()
      if (data.id === '0') {
        vm.pathNames = '根节点'
        vm.model.parentId = '0'
        vm.model.departmentPath = ''
        return
      }
      // 设置为选中状态
      vm.$refs.tree.setCurrentKey(data.id)
      vm.saveType = 'edit'
      // 获取菜单路径
      let paths = this.getTreeParentPath(data, node)
      vm.pathNames = paths.pathNames.join('/')
      vm.$http.fetch(vm.$api.core.department.queryById, {
        id: data.id
      }).then(resp => {
        let model = vm.transObjProp2CamelCase(resp.result)
        delete model.updateTime
        delete model.createTime
        // 回显数据
        vm.setModel(model)
      }).catch(() => {
        vm.$notify.error('查询失败')
      })
    },
    // 点击删除按钮
    onDeleteClick: function (data, node) {
      if (!node.isLeaf) {
        vm.$notify.warning('当前节点下有子节点，无法删除')
        return
      }
      var url = vm.$api.core.department.deleteById
      var params = { id: data.id }
      apiRequestConfirm('删除“' + data.label + '”节点').then(() => {
        vm.loading = true
        vm.$http.fetch(url, params).then(resp => {
          vm.$notify.success(resp.msg)
          // 重置表单数据
          vm.resetForm()
          vm.$refs.tree.remove(data)
          // 设置为选中状态
          vm.$refs.tree.setCurrentKey('0')
          vm.pathNames = '根节点'
        }).catch((resp) => {
          if (resp.code === ErrorCode.DATA_USING) {
            vm.$notify.error('删除失败，该部门下还有用户')
          } else {
            vm.$notify.error('删除失败')
          }
        }).finally(() => {
          vm.loading = false
        })
      }).catch(reject => {
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
          departmentPath: data.path.replace('/0/', ''),
          parentId: data.parentId
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
      this.$http.fetch(this.$api.core.department.updateDepartmentPath, params).then((resp) => {
        that.$set(node, 'data', Object.assign({}, node.data,
          { id: params.id, parentId: params.parentId }))
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
    },
    'model.departmentName': function (val) {
      if (val.trim) {
      }
    }
  },
  mounted: function () {
    // 查询树数据
    this.getTreeData()
    vm.$nextTick(() => {
      // 设置为选中状态
      vm.$refs.tree.setCurrentKey(0)
      vm.pathNames = '根节点'
      vm.$refs.pageLeft.$el.children[0].style.maxHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 91 + 'px'
    })
  }
}
