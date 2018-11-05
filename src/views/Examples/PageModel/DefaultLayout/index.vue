<template>
  <div class="template-page">
    <default-table></default-table>
  </div>
</template>

<script>
  import index from './src/index'
  import DefaultTable from './DefaultTable'
  index.components = {
    DefaultTable
  }
  export default index
</script>
