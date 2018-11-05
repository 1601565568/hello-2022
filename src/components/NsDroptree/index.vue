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
    <el-input class="tmp-droptree-search" placeholder="输入关键字进行过滤" v-model="filterText" v-if="isShow"></el-input>
    <el-scrollbar outsider ref="scrollbar">
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
            <i class="tree-node__icon iconfont" v-if="data.icon" :class= data.icon></i>
            <span>{{ data.label}}</span>
          </div>
      </el-tree>
    </el-scrollbar>
    <el-input type="hidden" style="display: none;" v-model="dropValue"></el-input>
    <el-input type="hidden" style="display: none;" v-model="dropText"></el-input>
    <div v-if="showCheckbox && treeData.length > 0" class="text-right">
      <ns-button size="mini" type="text" @click="onCancelChecked">{{$t('operating.cancel')}}</ns-button>
      <ns-button type="primary" size="mini" @click="hideDroptreeHandle">确定</ns-button>
    </div>
    <el-input slot="reference" ref="droptreeInput" v-model="showText" :readonly="inputReadOnly"
              class="tmp-droptree-input" readonly
              :placeholder="placeholder" :disabled="inputDisabled" @clear="cleanClickHandle"
              @click.native="showDropTreeHandle">
     <template slot="suffix" v-if="clearable && showText" >
       <i class="el-input__icon el-icon-circle-close el-input__clear"  @click="cleanClickHandle"></i>
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
      url: Object,
      value: {},
      validateEvent: {
        type: Boolean,
        default: true
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
      inputReadOnly: {
        type: Boolean,
        default: false
      },
      leafOnly: {
        type: Boolean,
        default: false
      },
      onlyCheckParent: {
        type: Boolean,
        default: true
      }
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
        this.$refs.treeStore.filter(val)
      },
      dropValue: function (val) {
        var obj = {
          value: val,
          text: this.dropText
        }
        this.$emit('input', obj)
      },
      dropText: function (val) {
        var obj = {
          value: this.dropValue,
          text: val
        }
        this.$emit('input', obj)
      },
      value: function () {
        this.showText = this.value.text
        if (this.value.value) {
          let checkedIds = String(this.value.value).split(',')
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
            var keys = String(this.value.value).split(',')
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
        this.droptreeWidth = this.$refs.droptreeInput.$el.clientWidth
      },
      /**
       * 确定选择
       */
      hideDroptreeHandle: function () {
        if (this.showCheckbox) {
          this.multiConfirm = true
          var checkArrLabels = []
          var checkArrIds = []
          if (this.onlyCheckParent) {
            let checkedNodes = this.treeDeepSearchCheckedParent(this.treeData)
            if (checkedNodes) {
              checkArrLabels = checkedNodes.checkedNames.concat(checkArrLabels)
              checkArrIds = checkedNodes.checkedIds.concat(checkArrIds)
            }
          } else {
            let checkArr = this.$refs.treeStore.getCheckedNodes(this.leafOnly)
            for (var i = 0; i < checkArr.length; i++) {
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
        var count = 0
        let checkedIds = []
        let checkedNames = []
        let checkedNode = {
          checkedNames: [],
          checkedIds: []
        }
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          if (node.children && node.children.length > 0) {
            let currNodes = this.treeDeepSearchCheckedParent(node.children)
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
        var _this = this
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
        var obj = {
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
  function loadTreeData (_this, data, url) {
    _this.$http.fetch(url).then((json) => {
      data.splice(0)
      var result = json.result
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
            var keys = String(_this.value.value).split(',')
            _this.$refs.treeStore.setCheckedKeys(keys)
          })
        }
      } else {
        throw new Error('数据初始化值类型错误')
      }
    }).catch(() => {
      throw new Error('数据请求出错')
    })
  }
</script>

<style scoped>
  .tmp-droptree-footer {
    text-align: right;
  }
</style>
