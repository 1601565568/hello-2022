<template>
  <div>
    <ns-table-materialSubdivision ref="table" :url=$api.guide.materialSubdivision.querySubTableList></ns-table-materialSubdivision>
  </div>
</template>
<script>
import List from './src/List'
import NsTableMaterialSubdivision from './NsTableMaterialSubdivision'
List.components = {
  NsTableMaterialSubdivision
}
export default List
</script>
