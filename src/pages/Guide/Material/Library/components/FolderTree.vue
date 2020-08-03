<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="hide"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    customClass="folder-tree"
  >
    <div class="folder-tree__wrapper">
      <el-tree
        ref="folderTree"
        node-key="id"
        :data="list"
        :props="treeProps"
        :expand-on-click-node="false"
        :default-expanded-keys="expandKeys"
        :render-content="renderNode"
        :check-strictly="true"
        @node-click="onSelect"
        @node-expand="onExpand"
        @node-collapse="onCollapse"
      >
      </el-tree>
    </div>
    <div slot="footer" class="clearfix">
      <ns-button @click="onAddFolder" class="folder-tree__btn">新建文件夹</ns-button>
      <ns-button @click="hide">取 消</ns-button>
      <ns-button type="primary" :disabled="!selected" :loading="loading" @click="handleSave">确 定</ns-button>
    </div>
    <new-folder ref="newFolder" @refresh="loadList"></new-folder>
  </el-dialog>
</template>
<script>
import NewFolder from './NewFolder'

export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  data: function () {
    return {
      title: '移动到',
      visible: false,
      loading: false,
      list: [],
      expandKeys: ['0'],
      treeProps: {
        label: 'label',
        children: 'children'
      },
      catalogue: [],
      selected: null
    }
  },
  components: { NewFolder },
  computed: {},
  methods: {
    show () {
      this.visible = true
      this.loadList()
    },
    hide () {
      this.visible = false
      this.catalogue = []
      this.selected = null
      this.$refs.folderTree.setCheckedKeys([])
    },
    onExpand (data) {
      let index = this.expandKeys.findIndex(key => data.id === key)
      if (index < 0) {
        this.expandKeys.push(data.id)
      }
    },
    onCollapse (data) {
      let index = this.expandKeys.findIndex(key => data.id === key)
      if (index < 0) {
        this.expandKeys.splice(index, 1)
      }
    },
    onSelect (data, node) {
      if (data.disabled) {
        return
      }
      this.$refs.folderTree.setCheckedKeys([data.id])
      this.selected = data
      const catalogue = [data]
      if (data.id !== '0') {
        while (node.parent) {
          node = node.parent
          catalogue.unshift(node.data)
          if (node.data && node.data.id === '0') {
            node.parent = null
          }
        }
      }
      this.catalogue = catalogue
    },
    renderNode (h, { node, data, store }) {
      return (
        <span class={`folder-tree__item ${data.disabled ? 'folder-tree__disabled' : ''}`}>
          {data.id !== -1 ? <Icon type="wenjianjia-new"/> : null}
          <span style={`font-size: ${data.id === -1 ? 14 : 12}px`}>{node.label}</span>
        </span>
      )
    },
    onAddFolder () {
      this.$refs.newFolder.show({ parent: this.selected })
    },
    // 获取文件列表
    async loadList (expandData) {
      this.$http.fetch(this.$api.guide.getDirectoryTree).then(resp => {
        this.list = [{ id: '0', label: '素材库', children: resp.result }]
        expandData ? this.onExpand(expandData) : this.expandKeys = ['0']
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      })
    },
    handleSave () {
      // todo 1、移动到某个文件夹； 2、选择文件目录
      this.$emit('change', { selected: this.selected, catalogue: this.catalogue })
      this.hide()
    }
  }
}
</script>
<style scoped>
@component-namespace folder {
  @b tree {
    @e wrapper {
      min-height: 270px;
      padding: 0 20px 20px;
      >>> .el-tree {
        overflow: hidden;
      }
    }
    @e btn {
      float: left;
    }
  }
  >>> .folder-tree {
    width: 500px;
    .el-dialog__header {
      padding: 20px 30px !important;
    }
    .el-dialog__headerbtn {
      top: 20px !important;
      right: 30px !important;
    }
    .el-dialog__footer {
      padding: 10px 30px 20px !important;
    }
  }
  >>> .is-checked > .el-tree-node__content {
    background-color: #f5fbff !important;
    border-color: #0392fb;
  }
  >>> .el-tree-node__content {
    padding: 5px 10px;
    border: solid 1px transparent;
    border-radius: 4px;
    > .el-tree-node__expand-icon {
      padding: 0;
      margin-left: 10px;
      font-size: 16px;
      color: #8c8c8c;
      vertical-align: middle;
      &.is-leaf {
        color: transparent;
        background: transparent;
      }
    }
    .folder-tree__item {
      margin-left: 5px;
      line-height: 20px;
      svg {
        font-size: 20px;
        color: #0091fa;
      }
      svg, span {
        vertical-align: middle;
      }
      svg + span {
        margin-left: 5px;
      }
      &.folder-tree__disabled {
        svg {
          opacity: 0.3;
        }
        span {
          color: #c0c4cc;
        }
      }
    }
  }
}
</style>
