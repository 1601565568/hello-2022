<template>
  <div>
    <callList ref="callTable" :url=$api.riskManagement.callRecords.findList></callList>
  </div>
</template>

<script>
import callList from './CallList'
import index from './src/index'
index.components = {
  callList
}
export default index
</script>

<style scoped>

</style>
