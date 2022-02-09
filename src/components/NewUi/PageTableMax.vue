<template>
  <div class="template-table">
    <!-- 工具栏 -->
    <div class="template-table__bar">
      <div class='template-table__bar-name' v-if='title'>
        {{title}}
      </div>
      <el-row class="template-table__bar-base" :style="`width:${title?'auto' :'100%'}`">
        <!-- 搜索条件-->
        <el-col :span='searchCol' class="search-content">
          <slot name='search' />
        </el-col>
        <!-- 按钮-->
        <el-col :span='24-searchCol' class="btn-content">
          <slot name='button' />
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <slot name="table">

    </slot>
    <!-- 分页 -->
    <slot name="pagination">

    </slot>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    searchCol: {
      default: 21
    },
    title: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
