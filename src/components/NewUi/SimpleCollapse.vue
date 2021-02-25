<template>
  <div class='recruiting-collapse'>
    <el-collapse :class='`common-collapse`' v-model='collapseList'>
      <el-collapse-item :title="title" :name="1" :disabled='disabled'>
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  data () {
    return {
      collapseList: [1]
    }
  },
  props: {
    title: {
      type: String
    },
    // 是否禁用下拉
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .common-collapse {
    margin-bottom: 16px;
  }
  .recruiting-collapse {
    padding-left: 16px;
    background-color: #fff;
  }
  .collapse-left {
    padding-right: 40px;
  }
  .collapse-right {
    position: relative;
    &::before {
      position: absolute;
      content: ' ';
      border-left: 1px solid #E8E8E8;
      left:0;
      top: -56px;
      bottom: 0;
    }
  }
</style>
