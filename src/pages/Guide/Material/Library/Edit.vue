<template>
  <div class="library-wrapper">
    <el-tabs v-model="tabValue" type="card" @tab-click="handleTabChange">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <Component
          ref="component"
          :is="item.type"
          :detail="detail"
          :labelList="labelList"
          :breadcrumb="breadcrumb"
          @toggleLabel="toggleLabel"
          @togglePreview="togglePreview"
        />
      </el-tab-pane>
    </el-tabs>
    <label-add ref="labelAdd" @submit="getLabelList"></label-add>
    <preview ref="preview"></preview>
  </div>
</template>
<script>
import Index from './src/edit'
export default Index
</script>
<style scoped>
  /* @import "@theme/variables.pcss"; */
  @component-namespace library {
    @b wrapper {
      padding: 20px 20px 0;
      background: #fff;
      >>> .el-tabs__nav {
        border: none;
        .el-tabs__item {
          padding: 5px 20px;
          font-size: 12px;
          color: #303133;
          font-weight: normal;
          line-height: 20px;
          border-style: solid;
          border-color: #dcdfe6;
          border-bottom: none;
          border-width: 1px 1px 0 1px;
          &:first-child {
            border-width: 1px 0 0 1px;
            border-radius: 4px 0 0 0;
          }
          &:last-child {
            border-width: 1px 1px 0 0;
            border-radius: 0 4px 0 0;
          }
          &.is-active {
            color: #fff;
            border-color: #0392fb;
            background-color: #0392fb;
          }
        }
      }
    }
  }
</style>
