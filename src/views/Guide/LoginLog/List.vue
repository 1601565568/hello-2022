<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.loginLogFindList>
    </ns-table-guide>
  </div>
</template>

<script>
  import List from './src/List'
  import NsTableGuide from './NsTableGuide'

  List.components = {
    NsTableGuide
  }
  export default List
</script>

<style scoped>
  .kehuBox-main-span_title .el-col{
    display: flex;
    justify-content: center;
    line-height: 35px;
  }
</style>
