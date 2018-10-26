<template>
  <div class="template-page">
    <ns-table-interact ref="table"></ns-table-interact>
  </div>
</template>

<script>
  import index from './src/index'
  import NsTableIntegral from './NsTableIntegral'
  import NsTableInteract from './src/NsTableIntegral'
  export default {
    components: {NsTableInteract}
  }
  index.components = {
    NsTableIntegral
  }
</script>
