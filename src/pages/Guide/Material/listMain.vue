<template>
  <div>
    <ns-table-material ref="table" :url=$api.guide.material.queryTableList></ns-table-material>
  </div>
</template>
<script>
import List from './src/List'
import NsTableMaterial from './NsTableMaterial'
List.components = {
  NsTableMaterial
}
export default List
</script>
