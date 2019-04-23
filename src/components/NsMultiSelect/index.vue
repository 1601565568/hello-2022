<template>
  <div class="template-multi">
    <div class="template-multi-header">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{label}}
      </el-checkbox>
    </div>
    <div class="template-multi-content">
      <el-multi
        :data="nodes"
        accordion
        node-key="id"
        :default-checked-keys="defaultCheckedKeys"
        @check-change="handleCheckChange"
        ref="node"
        :cols="4"
        :show-Selectall="false"
        :props="nodesProps">
      </el-multi>
    </div>

  </div>
</template>

<script>
// 遍历所有节点的id
function foreachNodes (nodes, nodeKeys, checkedNodes) {
  for (var i = 0; i < nodes.length; i++) {
    nodeKeys.push(nodes[i].id)
    if (nodes[i].check && nodes[i].check === true) {
      checkedNodes.push(nodes[i].id)
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      foreachNodes(nodes[i].children, nodeKeys, checkedNodes)
    }
  }
}
export default {
  name: 'NsMultiSelect',
  data: function () {
    return {
      nodesProps: {
        children: 'children',
        label: 'label'
      },
      checkAll: false, // 线上是否全选
      isIndeterminate: false
    }
  },
  props: {
    nodes: {
      type: Array,
      default: function () {
        return []
      }
    },
    label: {
      type: String,
      default: function () {
        return ''
      }
    },
    defaultCheckedKeys: {
      type: Array,
      default: function () {
        return []
      }
    },
    defaultCheckedAll: {
      type: Array,
      default: function () {
        return []
      }
    }

  },
  methods: {
    // 显示多层级店铺选择器窗口
    handerlMultilayerVisible () {
      this.dialogMultilyaerVisible = true
      //  需要在body内重新加一层结构
      document.body.appendChild(this.$refs.dialogMultilyaer.$el)
    },
    handleCheckAllChange (event) {
      this.$refs.node.setCheckedKeys(event.target.checked ? this.defaultCheckedAll : [])
      this.isIndeterminate = false
      this.$emit('input', this.$refs.node.getCheckedNodes())
    },
    handleCheckChange (value) {
      let checkedCount = this.$refs.node.getCheckedNodes().length
      this.checkAll = checkedCount === this.defaultCheckedAll.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.defaultCheckedAll.length
      this.$emit('input', this.$refs.node.getCheckedNodes())
    },

    getCheckedKeys () {
      return this.$refs.node.getCheckedKeys(true)
    },
    setCheckedKeys (nodes) {
      this.$refs.node.setCheckedKeys(nodes)
    }

  },
  created: function () {
    foreachNodes(this.nodes, this.defaultCheckedAll, this.defaultCheckedKeys)
    this.isIndeterminate = this.defaultCheckedKeys.length > 0
  },
  mounted: function () {

  }
}
</script>
