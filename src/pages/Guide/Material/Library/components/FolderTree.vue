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
        :default-expanded-keys="defaultExpandKeys"
        :render-content="renderNode"
        :check-strictly="true"
        @node-click="onSelect"
      >
      </el-tree>
    </div>
    <div slot="footer" class="clearfix">
      <ns-button @click="onAddFolder" class="folder-tree__btn">新建文件夹</ns-button>
      <ns-button @click="hide">取 消</ns-button>
      <ns-button type="primary" :loading="loading" @click="handleSave">确 定</ns-button>
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
      params: {},
      list: [{
        id: -1,
        label: '素材库',
        children: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 2,
            label: '二级 1-1',
            children: [{
              id: 3,
              label: '三级 1-1-1'
            }, {
              id: 4,
              label: '三级 1-1-2',
              isLeaf: false
            }]
          }]
        }, {
          id: 5,
          label: '一级 2',
          children: [{
            id: 6,
            label: '二级 2-1'
          }, {
            id: 7,
            label: '二级 2-2'
          }]
        }, {
          id: 8,
          label: '一级 3',
          disabled: true,
          children: [{
            id: 9,
            label: '二级 3-1'
          }, {
            id: 10,
            label: '二级 3-2'
          }]
        }, {
          id: 11,
          label: '一级 4',
          children: [{
            id: 12,
            label: '二级 4-1'
          }, {
            id: 13,
            label: '二级 4-2'
          }]
        }, {
          id: 14,
          label: '一级 5',
          children: [{
            id: 15,
            label: '二级 5-1'
          }, {
            id: 16,
            label: '二级 5-2'
          }]
        }]
      }],
      defaultExpandKeys: [-1],
      treeProps: {
        label: 'label',
        children: 'children'
      },
      selected: null
    }
  },
  components: { NewFolder },
  computed: {},
  methods: {
    show (params = {}) {
      this.visible = true
      // 注册选择元素
      this.params = { ...params }
      this.loadList()
    },
    hide () {
      this.visible = false
    },
    onSelect (data) {
      console.log({ ...data })
      this.$refs.folderTree.setCheckedKeys([data.id])
      this.selected = data
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
      this.$refs.newFolder.show()
    },
    // 获取文件列表
    loadList () {
      console.log('重新加载')
      // let result = [{
      //   id: 1,
      //   label: '一级 1',
      //   children: [{
      //     id: 4,
      //     label: '二级 1-1',
      //     children: [{
      //       id: 9,
      //       label: '三级 1-1-1'
      //     }, {
      //       id: 10,
      //       label: '三级 1-1-2'
      //     }]
      //   }]
      // }, {
      //   id: 2,
      //   label: '一级 2',
      //   children: [{
      //     id: 5,
      //     label: '二级 2-1'
      //   }, {
      //     id: 6,
      //     label: '二级 2-2'
      //   }]
      // }, {
      //   id: 3,
      //   label: '一级 3',
      //   children: [{
      //     id: 7,
      //     label: '二级 3-1'
      //   }, {
      //     id: 8,
      //     label: '二级 3-2'
      //   }]
      // }, {
      //   id: 4,
      //   label: '一级 4',
      //   children: [{
      //     id: 9,
      //     label: '二级 4-1'
      //   }, {
      //     id: 10,
      //     label: '二级 4-2'
      //   }]
      // }, {
      //   id: 5,
      //   label: '一级 5',
      //   children: [{
      //     id: 19,
      //     label: '二级 5-1'
      //   }, {
      //     id: 20,
      //     label: '二级 5-2'
      //   }]
      // }]
      // this.list = [{ id: -1, label: '素材库', children: result }]
      // this.defaultExpandKeys = ['-1']
    },
    handleSave () {
      // console.log('保存到')
    }
  }
}
</script>
<style scoped>
@component-namespace folder {
  @b tree {
    @e wrapper {
      min-height: 270px;
      padding-bottom: 20px;
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
    .el-dialog__body {
      padding: 0 30px !important;
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
