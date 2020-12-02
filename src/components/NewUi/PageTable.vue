<template>
  <div class="template-table">
    <!-- 工具栏 -->

    <div class="template-table__bar">
      <el-row class="template-table__bar-base">
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
    }
  }
}
</script>
<style lang="scss" scoped>
.template-table {
  padding: 24px 16px;
  background: #FFFFFF;
  border-radius: 4px;
  border-radius: 4px;
  .template-table__bar {
    padding: 0;
    box-shadow: none;
    .search-content {
      display: flex;
      justify-content: flex-start;
    }
  }
  .template-table__bar-base {
    margin-bottom: 16px;
  }
}
.btn-content {
  display: flex;
  justify-content: flex-end;
  height: 100%;
  align-items: flex-start;
}
.el-pagination {
  box-shadow: none
}
</style>
