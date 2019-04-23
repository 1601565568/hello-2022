import formMixin from 'mixins/form'
import ErrorCode from '@/config/errorCode'
import $ from 'jquery'

var vm
export default {
  mixins: [formMixin],
  data: function () {
    return {
      emptyText: '',
      treeData: [],
      loading: false,
      pathNames: '渠道管理',
      filterText: '',
      model: {
        id: 0,
        tag_type: 2,
        tag_name: '',
        parent_id: 0,
        remark: ''
      },
      rules: {
        'remark': [{
          validator: (rule, value, callback) => {
            if (value !== null) {
              if (value.length > 0) {
                if (value.length <= 200) {
                  callback()
                } else {
                  callback(new Error('输入字符超过限制'))
                }
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        'tag_name': [{
          required: true,
          message: '请输入渠道名称',
          trigger: 'blur'
        }, {
          min: 0,
          max: 30,
          message: '已超过可输入长度',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            var params = {
              id: vm.model.id ? vm.model.id : 0,
              name: value,
              parentId: vm.model.parent_id
            }
            if ($.trim(value).length === 0) {
              callback(new Error('请输入正确渠道名称'))
            } else {
              vm.$http.fetch(vm.$api.core.menu.hasNameInBrotherExist, params)
              .then((resp) => {
                if (resp.code === ErrorCode.TITLE_REPEAT) {
                  callback(new Error('此渠道名称已存在,请重新输入'))
                } else {
                  callback()
                }
              }).catch(() => {
                vm.$notify.error('远程校验失败')
              })
            }
          },
          trigger: 'blur'
        }]
      },
      root: {
        id: 0,
        label: '渠道管理',
        code: 'root',
        parentId: 0,
        children: [],
        showAdd: true,
        disabled: true
      }
    }
  },
  methods: {
    // 查询菜单树数据
    getTreeData: function () {
      vm.loading = true
      vm.root.children = []
      vm.$http.fetch(vm.$api.core.channel.queryChannelTree)
      .then((resp) => {
        vm.root.children = resp.result
        vm.$set(vm, 'treeData', [vm.root])
      }).catch(() => {
        vm.emptyText = vm.$t('prompt.noData')
        vm.$notify.error('加载失败')
      }).finally(() => {
        vm.loading = false
      })
    },
    // 保存
    onSaveMenu: function () {
      vm.model.tag_name = $.trim(vm.model.tag_name)
      vm.validAndSubmit({
        api: vm.$api.core.channel.saveOrUpdate,
        success: function (resp) {
          // 重新获取数据
          vm.getTreeData()
          vm.$notify.success(resp.msg)
          if (resp.result) {
            vm.$refs.tree.setChecked(resp.result.id, true)
            vm.pathNames += '/' + resp.result.menu_name
            vm.model.id = resp.result.id
          }
        },
        error: function () {
          vm.$notify.error(vm.savePromptMsg + '失败')
        }
      })
    },
    // 获取树节点
    getTreeChildIds: function (data, node) {
      let ids = [data.id]
      if (!node.isLeaf) {
        for (var i = 0; i < data.children.length; i++) {
          ids = ids.concat(this.getTreeChildIds(data.children[i], node.childNodes[i]))
        }
      }
      return ids
    },
    // 获取树父节点指定字段的数组
    getTreeParentIds: function (data, node) {
      let paths = {
        pathIds: [data.id],
        pathNames: [data.label]
      }
      if (node.parent && node.parent.data.id !== 0) {
        let path = this.getTreeParentIds(node.parent.data, node.parent)
        paths.pathIds = path.pathIds.concat(paths.pathIds)
        paths.pathNames = path.pathNames.concat(paths.pathNames)
      }
      return paths
    },
    // 点击添加按钮
    onAddClick: function (data, node) {
      vm.resetForm()
      vm.saveType = 'add'
      if (data.id === 0) {
        vm.pathNames = '渠道管理'
        vm.model.parent_id = 0
        vm.model.id = 0
        return
      }
      // 获取菜单路径
      let paths = this.getTreeParentIds(data, node)
      vm.model.tag_path = paths.pathIds.join('/')
      vm.pathNames = paths.pathNames.join('/')
      vm.model.parent_id = data.id
    },
    // 点击修改按钮
    onEditClick: function (data, node) {
      vm.resetForm()
      if (data.id === 0) {
        vm.pathNames = '渠道管理'
        vm.model.parent_id = 0
        return
      }
      // 设置为选中状态
      vm.$refs.tree.setChecked(data.id, true)
      vm.saveType = 'edit'
      // 获取菜单路径
      let paths = this.getTreeParentIds(data, node)
      vm.pathNames = paths.pathNames.join('/')
      vm.model.tag_name = data.label
      vm.model.parent_id = data.parentId
      vm.model.id = data.id
      vm.model.remark = data.ext1
    },
    // 点击删除按钮
    onDeleteClick: function (data, node) {
      var info = '是否确定删除“' + data.label + '”节点？'
      var url = vm.$api.core.channel.deleteById
      var params = {id: data.id}
      vm.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: function (action) {
          if (action === 'confirm') {
            vm.loading = true
            vm.$http.fetch(url, params).then(resp => {
              if (resp.code === ErrorCode.DATA_EDIT_FAIL) {
                vm.getTreeData()
                vm.$notify.warning(resp.msg)
              } else {
                vm.getTreeData()
                vm.$notify.success(resp.msg)
              }
            }).catch(() => {
              vm.$notify.error('删除失败')
            }).finally(() => {
              vm.loading = false
            })
          }
        }
      })
    },
    /**
     * 过滤树
     * @param val
     */
    filterNode (value, data) {
      if (!value) return true
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
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val)
    }
  },
  created: function () {
    vm = this
  },
  mounted: function () {
    // 查询树数据
    this.getTreeData()
    vm.$nextTick(() => {
      vm.$refs.pageLeft.$el.children[0].style.maxHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 91 + 'px'
    })
  }
}
