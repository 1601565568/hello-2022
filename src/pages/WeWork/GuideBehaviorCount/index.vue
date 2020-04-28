<template>
  <div>
    <column-table :url=$api.weWork.behaviorData.findList></column-table>
  </div>
</template>

<script>
import index from './src/index'
import ColumnTable from './ColumnTable.vue'
index.components = {
  ColumnTable
}
export default index
</script>

<style scoped>
  @import "@theme/variables.pcss";
  .template-page__row-left {
    min-width: 280px;
  }
  .tree-node {
    position: relative;
    padding-right: 70px !important;
    .tree-node__icon {
      position: absolute;
      right: 15px;

      span + span {
        margin-left: var(--default-margin-mini);
      }
    }
  }
</style>
