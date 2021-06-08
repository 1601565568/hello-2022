<template>
  <el-popover ref="droptreepopover"
              v-model="dropTreeVisible"
              :width="droptreeWidth"
              placement="bottom-start"
              trigger="click"
              :disabled="inputDisabled"
              popper-class="tmp-droptree-popover"
              @show="popoverShowHandle"
              @hide="popoverHideHandle">
    <el-input class="tmp-droptree-search" placeholder="输入关键字进行过滤" v-model="filterText" v-if="isShow && !loading"></el-input>
    <div class="el-tree__loading" v-if="loading" v-loading="loading" element-loading-spinner="el-icon-loading">全部</div>
    <el-scrollbar v-else outsider ref="scrollbar">
      <el-tree v-show="dropTreeVisible" ref="treeStore" class="tmp-droptree-tree"
               :data="treeData"
               :empty-text="emptyText"
               :node-key="nodeKey"
               :props="props"
               :load="load"
               :lazy="lazy"
               :render-after-expand="renderAfterExpand"
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
               :filter-node-method="filterNode"
               :accordion="accordion"
               :indent="indent"
               @node-click="nodeClickHandle"
               @check-change="checkChangeHandle"
               @current-change="currentChangeHandle"
               @node-expand="nodeExpandHandle"
               @node-collapse="nodeCollapseHandle">
        <div slot-scope="{node,data}" class="tree-node">
          <div class="card-labels">
            <i class="tree-node__icon" v-if="data.icon" :class= data.icon></i>
            <el-popover  v-if="subdivision && !data.disabled" placement="right-start" trigger="hover">
              <el-scrollbar ref="subdivisionListHeight" class="popover-scrollbar">
                <div class="padding-lr-larger" style="max-width:450px;">
                      <span v-for="(propertyItem,propertyIndex) in JSON.parse(data.ext1)" :key="propertyIndex">
                       <el-row v-for="(component,componentIndex) in propertyItem.component" :key="componentIndex">
                         <el-col :span="3" style="min-height: 1px;">
                           <div v-if="propertyItem.relation!==undefined && propertyItem.relation!=='' && componentIndex===0" class="word-noBreak">
                              <div class="card-labels__label card-labels__label--all">{{propertyItem.relation}}</div>
                           </div>
                         </el-col>
                         <el-col :span="21" class="word-noBreak" v-if="componentIndex>0||(propertyItem.popupPage&&componentIndex>0)" style="padding-left:10px"><div class="card-labels__label card-labels__label--all">{{component.description}}</div></el-col>
                         <el-col :span="21" class="word-noBreak" v-else><div class="card-labels__label card-labels__label--all">{{component.description}}</div></el-col>
                       </el-row>
                    </span>
                </div>
              </el-scrollbar>
              <span  slot="reference">{{ data.label}}</span>
            </el-popover>
            <span v-else :class="data.disabled ? 'text-secondary' : ''">{{ data.label}}</span>
          </div>
        </div>
      </el-tree>
    </el-scrollbar>
    <el-input type="hidden" style="display: none;" v-model="dropValue"></el-input>
    <el-input type="hidden" style="display: none;" v-model="dropText"></el-input>
    <div v-if="showCheckbox && treeData.length > 0" class="text-right">
      <ns-button size="mini" type="text" @click="onCancelChecked">{{$t('operating.cancel')}}</ns-button>
      <ns-button type="primary" size="mini" @click="hideDroptreeHandle">确定</ns-button>
    </div>
    <el-input slot="reference" ref="droptreeInput" v-model="showText"
              class="tmp-droptree-input" readonly
              :placeholder="placeholder" :disabled="inputDisabled" @clear="cleanClickHandle"
              @click.native="showDropTreeHandle">
      <template slot="suffix" v-if="clearable && showText && !inputDisabled" >
        <Icon type="circleclose" className="el-input__icon el-input__clear" style="padding: 5px;" @click="cleanClickHandle" />
      </template>
    </el-input>
  </el-popover>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'NsDroptree',
  data: function () {
    return {
      filterText: '',
      showText: '',
      dropValue: '',
      dropText: '',
      dropTreeVisible: false,
      droptreeWidth: '',
      // 多选确认
      multiConfirm: false,
      currChecked: [],
      currCheckedText: '',
      isShopPopover: true
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    url: Object,
    value: {},
    subdivision: {
      type: Boolean,
      default: false
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    autoSize: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    placeholder: {
      type: String,
      default: function () {
        return '请选择'
      }
    },
    isShow: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    emptyText: {
      type: String,
      default: function () {
        return '暂无数据'
      }
    },
    nodeKey: {
      type: String,
      default: function () {
        return 'id'
      }
    },
    clearable: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    inputDisabled: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: false
    },
    renderAfterExpand: {
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
    props: {
      default: function () {
        return {
          children: 'children',
          label: 'label',
          icon: 'icon'
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
    accordion: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    leafOnly: {
      type: Boolean,
      default: false
    },
    onlyCheckParent: {
      type: Boolean,
      default: true
    },
    filterLazyNodes: Function
  },
  computed: {
    treeData: function () {
      return this.data
    }
  },
  watch: {
    defaultCheckedKeys: function (newVal) {
      this.$refs.treeStore.defaultCheckedKeys = newVal
      this.$refs.treeStore.setDefaultCheckedKey(newVal)
    },
    defaultExpandedKeys: function (newVal) {
      this.$refs.treeStore.defaultExpandedKeys = newVal
      this.$refs.treeStore.setDefaultExpandedKeys(newVal)
    },
    currentNodeKey: function (newVal) {
      this.$refs.treeStore.setCurrentNodeKey(newVal)
      this.$refs.treeStore.currentNodeKey = newVal
    },
    data: function (newVal) {
      this.$data.data = newVal
    },
    filterText: function (val) {
      if (typeof this.filterLazyNodes === 'function' && this.lazy) {
        this.filterLazyNodes(val)
      } else {
        this.$refs.treeStore.filter(val)
      }
    },
    dropValue: function (val) {
      const obj = {
        value: val,
        text: this.dropText
      }
      this.$emit('input', obj)
    },
    dropText: function (val) {
      const obj = {
        value: this.dropValue,
        text: val
      }
      this.$emit('input', obj)
    },
    value: function () {
      this.showText = this.value.text
      if (this.value.value) {
        const checkedIds = String(this.value.value).split(',')
        this.$refs.treeStore.setCheckedKeys(checkedIds)
        this.currChecked = checkedIds
        this.currCheckedText = this.value.text
      } else {
        this.$refs.treeStore.setCheckedKeys([])
      }
    }
  },
  created: function () {
    this.$nextTick(() => {
      this.$refs.scrollbar.$el.children[0].style.maxHeight = '200px'
    })
    if (this.url) {
      loadTreeData(this, this.treeData, this.url)
    } else if (this.treeData) {
      this.showText = this.value.text
      if (this.value.value) {
        this.$nextTick(function () {
          const keys = String(this.value.value).split(',')
          this.$refs.treeStore.setCheckedKeys(keys)
        })
      }
    }
  },
  methods: {
    // 清空选择
    cleanClickHandle: function () {
      this.showText = ''
      this.dropValue = ''
      this.dropText = ''
      this.value.value = ''
      this.value.text = ''
      this.currChecked = []
      this.currCheckedText = ''
      this.isShopPopover = false
      this.$nextTick(function () {
        this.$refs.treeStore.setCheckedKeys([])
      })
    },
    // 刷新下拉树
    refresh: function () {
      if (this.url && this.url !== '') {
        loadTreeData(this, this.treeData, this.url)
      }
    },
    // 刷新下拉树
    loadData: function (url, params) {
      if (url) {
        loadTreeData(this, this.treeData, url, params)
      } else {
        throw new Error('请传入url')
      }
    },
    popoverShowHandle: function () {
      // 判断是否点击清空按钮的情况
      if (!this.isShopPopover) {
        this.dropTreeVisible = false
        this.isShopPopover = true
      }
      if (this.dropValue) {
        this.multiConfirm = true
      } else {
        this.multiConfirm = false
      }
    },
    showDropTreeHandle: function () {
      if (this.autoSize) {
        this.$refs.droptreeInput.autosize = true
      } else {
        this.droptreeWidth = this.$refs.droptreeInput.$el.clientWidth
      }
    },
    /**
       * 确定选择
       */
    hideDroptreeHandle: function () {
      if (this.showCheckbox) {
        this.multiConfirm = true
        let checkArrLabels = []
        let checkArrIds = []
        if (this.onlyCheckParent) {
          const checkedNodes = this.treeDeepSearchCheckedParent(this.treeData)
          if (checkedNodes) {
            checkArrLabels = checkedNodes.checkedNames.concat(checkArrLabels)
            checkArrIds = checkedNodes.checkedIds.concat(checkArrIds)
          }
        } else {
          const checkArr = this.$refs.treeStore.getCheckedNodes(this.leafOnly)
          for (let i = 0; i < checkArr.length; i++) {
            // 设置是否可以选择，特殊场景
            if (!checkArr[i].disabled) {
              checkArrLabels.push(checkArr[i].label)
              checkArrIds.push(checkArr[i][this.nodeKey])
            }
          }
        }
        this.showText = checkArrLabels.join(',')
        this.dropValue = checkArrIds.join(',')
        this.dropText = this.showText
        this.currChecked = checkArrIds
        this.currCheckedText = this.dropText
      }
      this.dropTreeVisible = false
    },
    // 递归树获取选中的父节点
    treeDeepSearchCheckedParent (nodes) {
      let count = 0
      const checkedIds = []
      const checkedNames = []
      const checkedNode = {
        checkedNames: [],
        checkedIds: []
      }
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.children && node.children.length > 0) {
          const currNodes = this.treeDeepSearchCheckedParent(node.children)
          checkedNode.checkedNames = checkedNode.checkedNames.concat(currNodes.checkedNames)
          checkedNode.checkedIds = checkedNode.checkedIds.concat(currNodes.checkedIds)
        }
        if (node.checked) {
          count++
          checkedNames.push(node.label)
          checkedIds.push(node.id)
        }
      }
      if (count < nodes.length || nodes[0].parentId === '0') {
        checkedNode.checkedNames = checkedNames.concat(checkedNode.checkedNames)
        checkedNode.checkedIds = checkedIds.concat(checkedNode.checkedIds)
      }
      return checkedNode
    },
    onCancelChecked () {
      this.setCheckedKeys(this.currChecked)
      this.dropValue = this.currChecked.join(',')
      this.dropText = this.currCheckedText
      this.showText = this.currCheckedText
      this.dropTreeVisible = false
    },
    // tree 方法
    filterNode: function (value, data) {
      if (!value) {
        return true
      }
      if (data.label) {
        return data.label.indexOf(value) !== -1
      }
      return false
    },
    popoverHideHandle: function () {
      const _this = this
      setTimeout(function () {
        _this.filterText = ''
      }, 200)
      if (this.showCheckbox) {
        if (this.dropValue) {
          this.setCheckedKeys(this.dropValue.split(','))
        }
        if (!this.multiConfirm) {
          this.onCancelChecked()
        }
      }
    },
    filter: function (value) {
      if (!this.filterNodeMethod) {
        throw new Error('[Tree] filterNodeMethod is required when filter')
      }
      this.$refs.treeStore.filter(value)
    },
    getNodeKey: function (node, index) {
      const nodeKey = this.nodeKey
      if (nodeKey && node) {
        return node.data[nodeKey]
      }
      return index
    },
    getCheckedNodes: function (leafOnly) {
      return this.$refs.treeStore.getCheckedNodes(leafOnly)
    },
    getCheckedKeys: function (leafOnly) {
      return this.$refs.treeStore.getCheckedKeys(leafOnly)
    },
    setCheckedNodes: function (nodes, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      }
      this.$refs.treeStore.setCheckedNodes(nodes, leafOnly)
    },
    setCheckedKeys: function (keys, leafOnly) {
      if (!this.nodeKey) {
        throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      }
      this.$refs.treeStore.setCheckedKeys(keys, leafOnly)
    },
    setChecked: function (data, checked, deep) {
      this.$refs.treeStore.setChecked(data, checked, deep)
    },
    nodeClickHandle: function (nodeData, node, instance) {
      if (!this.showCheckbox && !nodeData.disabled) {
        this.dropValue = nodeData[this.nodeKey]
        this.showText = nodeData.label
        this.dropText = nodeData.label
        this.dropTreeVisible = false
      } else if (nodeData.disabled) {
        this.$set(instance, 'expanded', !node.expanded)
        this.$set(node, 'expanded', !node.expanded)
      }
      const obj = {
        value: this.dropValue,
        text: this.dropText
      }
      this.$emit('input', obj)
      this.$emit('node-click', nodeData, node, instance)
    },
    checkChangeHandle: function (nodeData, checked, childChecked) {
      this.$set(nodeData, 'checked', checked)
      this.$emit('check-change', nodeData, checked, childChecked)
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
    getText: function (format) {
      return this.$refs.droptreeInput.getText(format)
    }
  }
}

// 加载tree数据
function loadTreeData (_this, data, url, params) {
  _this.$http.fetch(url, params).then((json) => {
    if (data.length > 0) {
      data.splice(0)
    }
    const result = json.result
    // 顶级节点为空，直接从子节点中获取
    if (result instanceof Object && !result.hasOwnProperty(_this.nodeKey) && !result.hasOwnProperty('label') && result.hasOwnProperty('children')) {
      $.each(result.children, function (i, val) {
        data.push(val)
      })
    } else if (result instanceof Object && result.hasOwnProperty(_this.nodeKey) && result.hasOwnProperty('label')) {
      // 顶级节点不为空
      data.splice(0, 1, result)
    } else if (Array.isArray(result)) {
      // 直接返回多个节点
      $.each(result, function (i, val) {
        data.push(val)
      })
    } else {
      throw new Error('数据类型错误')
    }
    if (_this.value && _this.value.hasOwnProperty('text') && _this.value.hasOwnProperty('value')) {
      _this.showText = _this.value.text
      if (_this.value.value) {
        _this.$nextTick(function () {
          const keys = String(_this.value.value).split(',')
          _this.$refs.treeStore.setCheckedKeys(keys)
        })
      }
    } else {
      throw new Error('数据初始化值类型错误')
    }
  }).catch(() => {
    throw new Error('数据请求出错')
  }).finally(() => {})
}
</script>

<style scoped>
  @import "@theme/variables.pcss";

  .tmp-droptree-footer {
    text-align: right;
  }
  @component-namespace card {
    @b labels {
      @e label {
        opacity: 0.6;
        background: rgba(102,102,102,0.10);
        line-height: 14px;
        display: inline-block;
        border-radius: 13px;
        padding: var(--default-padding-base) var(--default-padding-larger);
        margin-right: var(--default-margin-base);
        margin-bottom: var(--default-margin-base);

        @m all {
          font-size: var(--default-font-size-small);
          line-height: 16px;
          padding: 5px;
          margin-right: 0;
          opacity: 0.8;
        }
      }
      @e total {
        display: inline-block;
        padding-left: var(--default-padding-base);
        @m num {
          color: var(--theme-font-color-info);
          padding: 0 var(--default-padding-base);
        }
        @m icon {
          color: var(--theme-font-color-info);
          margin-left: var(--default-margin-base);
          cursor: pointer;
        }
      }
      @e all {
        padding: 10px 10px 7px;
      }
    }
  }
  .popover-scrollbar {
  >>> .el-scrollbar__wrap {
    max-height: 400px;
  }
  }
  .word-noBreak {
    min-width: 215px;
    word-break: keep-all;
  }
.el-tree__loading {
  height: 30px;
  line-height: 30px;
}
.el-tree__loading >>> .el-loading-spinner {
  margin-top: -15px!important;
}
</style>
