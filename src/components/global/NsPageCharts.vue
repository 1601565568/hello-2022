<template>
  <div class="template-charts">
    <div class="template-charts__bar">
          <!-- 搜索 -->
          <slot name="search">

          </slot>
    </div>
    <!-- 图表 -->
    <div class="template-charts__main">
    <slot name="charts">

    </slot>
    </div>
    <!-- 表格 -->
    <div class="template-charts__data">
    <slot name="table">

    </slot>
    <!-- 分页 -->
    <slot name="pagination">

    </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NsPageCharts'
  }
</script>

