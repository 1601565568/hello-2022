<template>
  <el-form-item :label="label" :rules='rules' :prop='prop'>
    <el-form-grid :size="size">
      <el-popover ref="droptreepopover"
                  v-model="dropTreeVisible"
                  :width="width"
                  placement="bottom-start"
                  trigger="click"
                  popper-class="tmp-droptree-popover"
                  @show="onPopShow"
                  :disabled='disabled'>
        <el-scrollbar :style='{height: height + "px"}'
                      wrap-class="tem-droptree-scroll"
                      view-class="template-form-list"
                      wrapStyle="overflow-x:hidden;">
          <el-form-grid :size="size">
            <el-input style='margin-bottom: 5px'
                      placeholder="输入关键字进行过滤"
                      v-model="filterText"
                      clearable>
            </el-input>
            <el-tree :data="data"
                     ref='tree'
                     :expand-on-click-node="false"
                     @node-click="handleSelectValue"
                     class="tmp-droptree-tree"
                     highlight-current
                     :current-node-key="value"
                     :props="treeProps"
                     :node-key='treeProps.value'
                     :filter-node-method="filter">
            </el-tree>
          </el-form-grid>
        </el-scrollbar>
      </el-popover>
      <input type="hidden" ref="dropTreeValue" v-model="dropTreeValue"/>
      <el-input v-popover:droptreepopover="" ref="droptreeinput" v-model="dropTreeLabel" readonly
                :placeholder="placeholder"
                class="tmp-droptree-input"
      ></el-input>
    </el-form-grid>
  </el-form-item>
</template>

<script>
const props = {
  data: {
    type: Array
  },
  label: {
    type: String,
    default: '下拉树'
  },
  size: {
    type: String,
    default: 'xmd'
  },
  placeholder: {
    type: String,
    default: '点击选择'
  },
  onPopShow: {
    type: Function,
    default: function () {

    }
  },
  treeProps: Object,
  value: '',
  rules: Array,
  prop: String,
  disabled: Boolean,
  width: '',
  maxHeight: {
    type: Number,
    default: 400
  }
}

const methods = {
  handleSelectValue (data) {
    this.dropTreeVisible = false
    this.dropTreeLabel = data[this.treeProps.label]
    this.dropTreeValue = data[this.treeProps.value]
    this.$emit('input', data[this.treeProps.value])
  },
  getText (format) {
    return this.$refs.droptreeInput.getText(format)
  },
  filter (value, data) {
    return data[this.treeProps.label].indexOf(value) > -1
  },
  setValue (value) {
    const tree = this.$refs.tree
    tree.setCurrentKey(value)
    const current = tree.getCurrentNode()
    if (current) {
      this.dropTreeLabel = current[this.treeProps.label]
      this.dropTreeValue = current[this.treeProps.value]
    }
  }
}
export default {
  name: 'NsSelectTree',
  data: function () {
    return {
      dropTreeLabel: '',
      dropTreeVisible: false,
      dropTreeValue: '',
      filterText: '',
      height: this.maxHeight
    }
  },
  props: props,
  methods: methods,
  model: {
    prop: 'value'
  },
  watch: {
    value (newValue) {
      this.setValue(newValue)
    },
    data () {
      let dynamic = 30 + 22 * this.data.length
      dynamic = dynamic < 200 ? 200 : dynamic
      dynamic = dynamic > this.maxHeight ? this.maxHeight : dynamic
      this.height = dynamic
      this.$nextTick(() => {
        this.setValue(this.value)
      })
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>
