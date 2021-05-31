<template>
  <el-dialog title="区域选择" width="492px" :visible="visible" @close="close" @open="open" :append-to-body="true">
    <el-input
      class="area-name-input"
      v-model="filterText"
      placeholder="请输入区域名称"
      @keyup.enter.native="() => {}"
    >
      <Icon type="search" style="font-size: 24px" slot="suffix" @click="() => {}"/>
    </el-input>
    <el-tree
      class="area-tree"
      ref="AreaTree"
      :data="tree"
      node-key="id"
      highlight-current
      :show-checkbox="false"
      :default-expand-all="false"
      :expand-on-click-node="false"
      :filter-node-method="filterAreaNode"
      :default-expanded-keys="[currentArea.id]"
      :current-node-key="currentArea.id"
      @node-click="selectAreaNode"
    >
      <span class="area-tree-node" slot-scope="{ node,data }">
        <el-radio :value="currentArea.id" :label="data.id">
          <Icon class="area-node-icon" type="cate" />
          <span class="area-node-title">{{ node.label }}</span>
        </el-radio>
      </span>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <NsButton @click="close" size="medium">取 消</NsButton>
      <NsButton type="primary" size="medium" @click="confirm">确 定</NsButton>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    area: {
      type: Object,
      default: function () {
        return { id: -1, label: '' }
      }
    },
    tree: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      scrollTop: 0,
      filterText: '',
      currentArea: { id: -1, label: '' }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.AreaTree.filter(val)
    }
  },
  methods: {
    saveScroll () {
      this.$nextTick(() => {
        setTimeout(() => {
          const scrollTop = this.$refs.AreaTree.$parent.wrap
          scrollTop.scrollTop = this.scrollTop
        }, 13)
      })
    },
    close () {
      this.currentAreaNodeKey = -1
      this.$emit('update:visible', false)
    },
    open () {
      this.currentArea = this.area
      this.saveScroll()
    },
    confirm () {
      this.scrollTop = this.$refs.AreaTree.$parent.wrap.scrollTop
      this.$emit('confirm', this.currentArea)
      this.close()
    },
    filterAreaNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectAreaNode (data) {
      this.currentArea = { id: data.id, label: data.label }
    }
  }
}
</script>

<style lang="scss" scoped>
.area-name-input {
  width: 460px;
}
.area-tree {
  margin-top: 10px;
  .area-tree-node {
    display: flex;
    align-items: center;
    .area-node-icon {
      margin-right: 5px;
      color: #0091fa;
      font-size: 14px;
    }
  }
}
</style>
