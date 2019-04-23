import formMixin from 'mixins/form'
import apiRequestConfirm from 'web-crm/src/utils/apiRequestConfirm'

export default {
  mixins: [formMixin],
  data: function () {
    let rules = {
      // 分类名称
      'name': [{ required: true, message: '请输入分类名称', trigger: ['blur'] },
        {
          min: 1,
          max: 20,
          message: '限1-20个字',
          trigger: ['blur']
        }]
    }
    return {
      loading: false,
      moveLoading: false,
      rules: rules,
      dialogVisible: false,
      width: null,
      categoryDialogVisible: false,
      categoryTitle: null,
      categoryData: {
        name: null,
        goods_cids: null,
        type: null,
        data: null
      },
      root: {
        id: null,
        label: '所有分类',
        code: 'root',
        parentId: 0,
        showAdd: true,
        disabled: true
      },
      treeData: []
    }
  },
  methods: {
    /**
     * 查询菜单树数据
     */
    getTreeData: function () {
      let that = this
      that.loading = true
      that.root.children = []
      this.$http.fetch(this.$api.guide.goods.findCategoryTreeList).then((resp) => {
        that.root.children = resp.result
        that.$set(that, 'treeData', [that.root])
      }).catch(() => {
        that.$notify.error('加载失败')
      }).finally(() => {
        that.loading = false
      })
    },
    onUpClick: function (data, node) {
      let cid2 = node.previousSibling ? node.previousSibling.data.id : null
      if (!cid2) { return }
      this.moveTreeNode(data, node, cid2, true)
    },
    onDownClick: function (data, node) {
      let cid2 = node.nextSibling ? node.nextSibling.data.id : null
      if (!cid2) { return }
      this.moveTreeNode(data, node, cid2, false)
    },
    moveTreeNode (data, node, cid2, up) {
      if (this.moveLoading) { return }
      this.moveLoading = true
      let that = this
      this.$http.fetch(this.$api.guide.goods.moveCategory, { cid: data.id, cid2: cid2 }).then((resp) => {
        if (resp.success) {
          that.resetMoveTreeNode(that, that.root.children, data.id, up)
          that.$set(that, 'treeData', [that.root])
        } else {
          that.$notify.error('服务器异常')
        }
      }).catch(() => {
        that.$notify.error('加载失败')
      }).finally(() => {
        console.info(that.treeData)
        that.moveLoading = false
      })
    },
    resetMoveTreeNode (that, treeData, id, up) {
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].id === id) {
          if (up) {
            if (i > 0) {
              let x = treeData[i]
              treeData[i] = treeData[i - 1]
              treeData[i - 1] = x
            }
          } else {
            if (i < treeData.length - 1) {
              let x = treeData[i]
              treeData[i] = treeData[i + 1]
              treeData[i + 1] = x
            }
          }
          return true
        } else if (treeData[i].children && that.resetMoveTreeNode(that, treeData[i].children, id, up)) {
          return true
        }
      }
      return false
    },
    /**
     * 添加分类
     * @param data
     * @param node
     */
    onAddClick: function (data, node) {
      let that = this
      that.categoryTitle = '新增分类'
      that.categoryData.name = null
      that.categoryData.goods_cids = data.ext1
      that.categoryData.type = 0
      that.categoryDialogVisible = true
    },
    /**
     * 编辑分类
     * @param data
     * @param node
     */
    onEditClick: function (data, node) {
      let that = this
      that.categoryTitle = '编辑分类'
      that.categoryData.goods_cids = data.ext1
      that.categoryData.name = data.label
      that.categoryData.type = 1
      that.categoryData.data = data
      that.categoryDialogVisible = true
    },
    /**
     * 删除分类
     * @param data
     * @param node
     */
    onDeleteClick: function (data, node) {
      let that = this
      if (data.children && data.children.length > 0) {
        that.$message.warning('该分类下存在子分类，无法删除')
        return
      }
      apiRequestConfirm('删除分类【' + data.label + '】').then(() => {
        that.$http.fetch(this.$api.guide.goods.deleteCategory,
          { goods_cids: data.ext1 }).then(() => {
          that.getTreeData()
          that.$notify.success('删除成功')
        }).catch((resp) => {
          that.$message.error(resp.msg || '删除失败，请稍后再试')
        })
      }).catch(() => {})
    },
    // 保存分类
    saveCategory: function () {
      let that = this
      let url
      if (that.categoryData.type === 0) {
        url = that.$api.guide.goods.saveCategory
      } else if (that.categoryData.type === 1) {
        url = that.$api.guide.goods.updateCategory
      }
      that.$refs.categoryForm.validate((valid) => {
        if (valid) {
          that.$http.fetch(url, that.categoryData).then(() => {
            that.dialogVisible = false
            that.$notify.success('保存成功')
            if (that.categoryData.type === 1) {
              that.categoryData.data.label = that.categoryData.name
            } else {
              that.getTreeData()
            }
            that.categoryDialogVisible = false
          }).catch((resp) => {
            that.$notify.error(resp.msg || '保存失败')
          })
        }
      })
    }
  },
  mounted: function () {
    // 查询树数据
    this.getTreeData()
  }
}
