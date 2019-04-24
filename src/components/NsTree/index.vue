<template>
  <el-tree ref="store"
           :data="treeData"
           :empty-text="emptyText"
           :node-key="nodeKey"
           :props="props"
           :load="load"
           :icon-add="iconAdd"
           :icon-edit="iconEdit"
           :icon-delete="iconDelete"
           :render-content="renderContent"
           :highlight-current="highlightCurrent"
           :current-node-key="currentNodeKey"
           :default-expand-all="defaultExpandAll"
           :expand-on-click-node="expandOnClickNode"
           :auto-expand-parent="autoExpandParent"
           :default-expanded-keys="defaultExpandedKeys"
           :show-checkbox="showCheckbox"
           :check-strictly="checkStrictly"
           :default-checked-keys="defaultCheckedKeys"
           :filter-node-method="filterNodeMethod"
           :accordion="accordion"
           :indent="indent"
           :show-icon="showIcon"
           :show-icon-up="showIconUp"
           :show-icon-down="showIconDown"
           :show-add-limit="showAddLimit"
           :draggable="draggable"
           :allow-drag="allowDrag"
           :allow-drop="allowDrop"
           @node-drag-start="nodeDragStart"
           @node-drag-enter="nodeDragEnter"
           @node-drag-leave="nodeDragLeave"
           @node-drag-over="nodeDragOver"
           @node-drag-end="nodeDragEnd"
           @node-drop="nodeDrop"
           @node-click="nodeClickHandle"
           @check-change="checkChangeHandle"
           @current-change="currentChangeHandle"
           @node-expand="nodeExpandHandle"
           @node-collapse="nodeCollapseHandle">
    <div @mousemove="onNodeMouseMove(node)" @mouseout="onNodeMouseOut(node)" class="custom-tree-node"
         slot-scope="{node,data}">
      <span>
        <el-tooltip v-if="data[props.label].length > labelMaxLength" class="item" effect="light" placement="top-start">
          <div slot="content"> {{ data[props.label] }} </div>
          <span>{{ subStrLength(data[props.label]) }}</span>
        </el-tooltip>
        <span v-else>{{ data[props.label] }}</span>
      </span>
      <div class="custom-tree-node-icon">
        <span> <i class="el-icon-sort-up" v-show="showIcon && (iconAlwaysShow || data.iconShow) && node.previousSibling != null && showIconUp"
                          @click="iconUpClick(data,node,$event)"></i></span>
        <span> <i class="el-icon-sort-down" v-show="showIcon && (iconAlwaysShow || data.iconShow) && node.nextSibling != null && showIconDown"
                  @click="iconDownClick(data,node,$event)"></i></span>
        <span> <i class="el-icon-plus" v-show="showIcon && (iconAlwaysShow || data.iconShow) && data.showAdd && (!showAddLimit || node.level < showAddLimit)"
                  @click="iconAddClick(data,node,$event)"></i></span>
        <span> <i class="el-icon-edit" v-show="showIcon && (iconAlwaysShow || data.iconShow) && data.showEdit"
                  @click="iconEditClick(data,node,$event)"></i></span>
        <span> <i class="el-icon-delete" v-show="showIcon && (iconAlwaysShow || data.iconShow) && data.showDelete"
                  @click="iconDeleteClick(data,node,$event)"></i></span>
      </div>
    </div>
  </el-tree>
</template>

<script>
// 异步加载tree数据
function loadTreeData (_this, data, url) {
  // 清空数据，在异步请求数据
  _this.$http.fetch(url, data).then((json) => {
    var result = json.result
    // 顶级节点为空，直接从子节点中获取
    if (result instanceof Object && !result.hasOwnProperty('id') && !result.hasOwnProperty('label') && result.hasOwnProperty('children')) {
      data.push(result.children)
    } else if (result instanceof Object && result.hasOwnProperty('id') && result.hasOwnProperty('label')) {
      // 顶级节点不为空
      data.push(result)
    } else if (Array.isArray(result)) {
      // 直接返回多个节点
      data = result
    } else {
      throw new Error('数据类型错误')
    }
  }).catch(() => {
    throw new Error('数据请求出错')
  })
}

export default {
  name: 'NsTree',
  data: function () {
    return {
      treeData: this.data,
      nodeFocus: false
    }
  },
  props: {
    url: Object,
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    emptyText: {
      type: String,
      default: function () {
        return this.$t('prompt.noData')
      }
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number
    },
    props: {
      default: function () {
        return {
          children: 'children',
          label: 'label',
          icon: 'icon',
          disabled: 'disabled'
        }
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    currentNodeKey: [String, Number],
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 16
    },
    showIcon: Boolean,
    showIconUp: Boolean,
    showAddLimit: {
      type: String,
      default: '0'
    },
    showIconDown: Boolean,
    iconAdd: {
      type: String,
      default: function () {
        return 'el-icon-plus'
      }
    },
    iconEdit: {
      type: String,
      default: function () {
        return 'el-icon-edit'
      }
    },
    iconDelete: {
      type: String,
      default: function () {
        return 'el-icon-delete'
      }
    },
    iconAlwaysShow: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    labelMaxLength: {
      type: Number,
      default: function () {
        return 10
      }
    },
    draggable: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    allowDrag: Function,
    allowDrop: Function
  },
  watch: {
    data: function (newVal) {
      this.$set(this, 'treeData', newVal)
    }
  },
  methods: {
    filter: function (value) {
      if (!this.filterNodeMethod) {
        throw new Error('[Tree] filterNodeMethod is required when filter')
      }
      this.$refs.store.filter(value)
    },
    getNodeKey: function (node, index) {
      const nodeKey = this.nodeKey
      if (nodeKey && node) {
        return node.data[nodeKey]
      }
      return index
    },
    getCheckedNodes: function (leafOnly) {
      return this.$refs.store.getCheckedNodes(leafOnly)
    },
    getCheckedKeys: function (leafOnly) {
      return this.$refs.store.getCheckedKeys(leafOnly)
    },
    setCheckedNodes: function (nodes, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      }
      this.$refs.store.setCheckedNodes(nodes, leafOnly)
    },
    setCheckedKeys: function (keys, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      }
      this.$refs.store.setCheckedKeys(keys, leafOnly)
    },
    setChecked: function (data, checked, deep) {
      this.$refs.store.setChecked(data, checked, deep)
    },
    setCurrentKey: function (data) {
      this.$refs.store.setCurrentKey(data)
    },
    setCurrentNode: function (node) {
      this.$refs.store.setCurrentNode(node)
    },
    getNode: function (data) {
      this.$refs.store.getNode(data)
    },
    remove: function (data) {
      this.$refs.store.remove(data)
    },
    append: function (data, parentNode) {
      this.$refs.store.append(data, parentNode)
    },
    insertBefore: function (data, refNode) {
      this.$refs.store.insertBefore(data, refNode)
    },
    insertAfter: function (data, refNode) {
      this.$refs.store.insertAfter(data, refNode)
    },
    nodeClickHandle: function (nodeData, node, instance) {
      this.$emit('node-click', nodeData, node, instance)
    },
    checkChangeHandle: function (nodeData, node, instance) {
      this.$emit('check-change', nodeData, node, instance)
    },
    nodeExpandHandle: function (nodeData, node, instance) {
      this.$emit('node-expand', nodeData, node, instance)
    },
    nodeCollapseHandle: function (nodeData, node, instance) {
      this.$emit('node-collapse', nodeData, node, instance)
    },
    currentChangeHandle: function (nodeData, node) {
      this.$emit('current-change', nodeData, node)
    },
    iconUpClick: function (data, node, event) {
      event.stopPropagation()
      this.$emit('icon-up-click', data, node)
    },
    iconDownClick: function (data, node, event) {
      event.stopPropagation()
      this.$emit('icon-down-click', data, node)
    },
    iconAddClick: function (data, node, event) {
      event.stopPropagation()
      this.$emit('icon-add-click', data, node)
    },
    iconEditClick: function (data, node, event) {
      event.stopPropagation()
      this.$emit('icon-edit-click', data, node)
    },
    iconDeleteClick: function (data, node, event) {
      event.stopPropagation()
      this.$emit('icon-delete-click', data, node)
    },
    nodeDragStart: function (dragNode, event) {
      this.$emit('node-drag-start', dragNode, event)
    },
    nodeDragEnter: function (dragNode, currNode, event) {
      this.$emit('node-drag-enter', dragNode, currNode, event)
    },
    nodeDragLeave: function (dragNode, currNode, event) {
      this.$emit('node-drag-leave', dragNode, currNode, event)
    },
    nodeDragOver: function (dragNode, currNode, event) {
      this.$emit('node-drag-over', dragNode, currNode, event)
    },
    nodeDragEnd: function (dragNode, currNode, position, event) {
      this.$emit('node-drag-end', dragNode, currNode, position, event)
    },
    nodeDrop: function (dragNode, currNode, position, event) {
      this.$emit('node-drop', dragNode, currNode, position, event)
    },
    onNodeMouseMove: function (node) {
      this.$set(node.data, 'iconShow', true)
    },
    onNodeMouseOut: function (node) {
      this.$set(node.data, 'iconShow', false)
    },
    // 新增方法
    /**
       * 刷新树
       */
    refresh: function () {
      var _url = this.url
      if (_url) {
        this.treeData = []
        loadTreeData(this, this.treeData, _url)
      }
    },
    // 截取字符串长度
    subStrLength: function (str) {
      return str.length > this.labelMaxLength ? str.substr(0, this.labelMaxLength) + '...' : str
    }
  },
  created: function () {
    // 如果url不为空，做异步加载数据
    if (this.url) {
      loadTreeData(this, this.treeData, this.url)
    }
  }
}
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--default-font-size-base);
    padding-right: 8px;
  }
</style>
