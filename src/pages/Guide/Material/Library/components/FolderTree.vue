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
        :indent="24"
        :data="list"
        :check-strictly="true"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeys"
        :render-content="renderNode"
        @node-click="onSelect"
        @node-expand="onExpand"
        @node-collapse="onCollapse"
      >
      </el-tree>
    </div>
    <div slot="footer" class="clearfix">
      <ns-button @click="onAddFolder" class="folder-tree__btn">新建文件夹</ns-button>
      <ns-button @click="hide">取 消</ns-button>
      <ns-button type="primary" :disabled="!checked" :loading="loading" @click="handleSave">确 定</ns-button>
    </div>
    <new-folder ref="newFolder" @submit="loadList"></new-folder>
  </el-dialog>
</template>
<script>
import NewFolder from './NewFolder'
import { getErrorMsg } from '@/utils/toast'
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
      expandedKeys: [],
      checked: null,
      catalogue: [],
      selectRows: []
    }
  },
  components: { NewFolder },
  computed: {},
  methods: {
    async show (rows, catalogue) {
      this.visible = true
      this.selectRows = Object.prototype.toString.call(rows) === '[object Object]' ? [rows] : (rows || [])
      this.catalogue = catalogue || []
      await this.loadList()
      this.$nextTick(() => {
        this.resetTree(rows, this.catalogue)
      })
    },
    hide () {
      this.visible = false
    },
    resetTree (rows, catalogue) {
      this.expandedKeys = catalogue.length ? catalogue.map(o => o.id) : [0]
      this.checked = catalogue.length ? catalogue[catalogue.length - 1] : null
      this.$refs.folderTree.setCheckedKeys(this.checked ? [this.checked.id] : [])
    },
    onExpand (data) {
      let index = this.expandedKeys.findIndex(key => data.id === key)
      if (index < 0) {
        this.expandedKeys.push(data.id)
      }
    },
    onCollapse (data) {
      let index = this.expandedKeys.findIndex(key => data.id === key)
      if (index > -1) {
        this.expandedKeys.splice(index, 1)
      }
    },
    onSelect (data, node) {
      if (data.disabled) {
        return
      }
      this.checked = data
      this.$refs.folderTree.setCheckedKeys([data.id])
      let catalogue = []
      while (node && node.parent) {
        catalogue.unshift({
          id: +node.data.id,
          name: node.data.label
        })
        node = node.data && node.data.id === 0 ? null : node.parent
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
    isDisabled (row) {
      let index = this.selectRows.findIndex(o => o.id === +row.id)
      return index > -1
    },
    formatList (data) {
      return data.map(item => {
        item.id = +item.id
        item.disabled = this.isDisabled(item)
        if (item.children) {
          item.children = this.formatList(item.children)
        }
        return item
      })
    },
    // 获取文件列表
    async loadList () {
      let queryLoading = this.$loading({ target: '.folder-tree__wrapper', fullscreen: false, text: '正在加载...' })
      return this.$http.fetch(this.$api.guide.getDirectoryTree).then(resp => {
        this.list = [{ id: 0, label: '素材库', children: this.formatList(resp.result) }]
      }).catch(resp => {
        this.$notify.error(getErrorMsg('查询失败', resp))
      }).finally(() => {
        queryLoading.close()
      })
    },
    handleSave () {
      if (this.selectRows.length) {
        this.moveTo()
      } else {
        this.$emit('submit', { checked: this.checked, catalogue: this.catalogue })
        this.hide()
      }
    },
    moveTo () {
      this.loading = true
      const params = { parentId: this.checked.id }
      params.itemList = this.selectRows.map(item => ({
        id: item.id,
        isDirectory: item.isDirectory,
        parentPath: item.parentPath
      }))
      this.$http.fetch(this.$api.guide.batchMoveMaterial, { ...params }).then(() => {
        this.$notify.success(`已移动到文件夹“${this.checked.label}”`)
        this.$emit('submit', { checked: this.checked, catalogue: this.catalogue })
        this.hide()
      }).catch(resp => {
        this.$notify.error(getErrorMsg('移动失败', resp))
      }).finally(() => {
        this.loading = false
      })
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
  >>> .el-tree-node {
    > .el-tree-node__content {
      padding: 5px 10px;
      border: solid 1px transparent;
      border-radius: 4px;
      .el-tree-node__expand-icon {
        padding: 0;
        margin-left: 10px;
        font-size: 16px;
        color: #bfbfbf;
        pointer-events: none;
        vertical-align: middle;
        &.is-leaf {
          visibility: hidden;
        }
      }
      .folder-tree__item {
        margin-left: 5px;
        font-size: 0;
        > svg, > span {
          display: inline-block;
          vertical-align: middle;
        }
        > span {
          font-size: 12px;
          color: #C0C4CC;
          line-height: 20px;
        }
        > svg {
          font-size: 20px;
          color: #0091fa;
          opacity: 0.3;
        }
        > svg + span {
          margin-left: 5px;
        }
      }
    }
    &.is-focusable > .el-tree-node__content {
      .el-tree-node__expand-icon {
        color: #8c8c8c;
        pointer-events: auto;
      }
      .folder-tree__item {
        > svg {
          opacity: 1;
        }
        > span {
          color: #606266;
        }
      }
    }
    &.is-checked > .el-tree-node__content {
      background-color: #f5fbff !important;
      border-color: #0392fb;
    }
  }
}
</style>
