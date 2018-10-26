<template>
  <div>
    <ns-table-shop  ref="table" :url=$api.guide.shop.findList></ns-table-shop>
  </div>
</template>

<script>
  import List from './src/List'
  import NsTableShop from './NsTableShop'
  List.components = {
    NsTableShop
  }
  export default List
</script>
