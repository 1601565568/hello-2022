<template>
  <div class="template-table">
    <!-- 工具栏 -->

    <div class="template-table__bar">
      <el-row>
        <el-col class="template-table__head">
          <slot name="head"></slot>
        </el-col>
      </el-row>
      <el-row type="flex" class="template-table__bar-base">
        <el-col :span="colButton">
          <!-- 按钮 -->
          <slot name="buttons"> </slot>
        </el-col>
        <el-col :span="24 - colButton">
          <!-- 简单搜索 -->
          <slot name="searchSearch"> </slot>
        </el-col>
      </el-row>
      <!-- 图表类的页面，栅格3等分，中间显示图表切换按钮组 -->
      <!-- 更多条件-->
      <div class="template-table-search">
        <div class="template-table__bar-more">
          <!-- 高级搜索 -->
          <slot name="advancedSearch"> </slot>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <slot name="table"> </slot>
    <!-- 分页 -->
    <slot name="pagination"> </slot>
  </div>
</template>

<script>
export default {
  name: 'NsPageTable',
  data () {
    return {}
  },
  props: {
    /* 按钮栏宽度配置 */
    colButton: {
      type: Number,
      default: 8
    }
  }
}
</script>
