<template>
  <div>
    <SmsList ref="callTable" :url=$api.riskManagement.smsRecords.findSmsList></SmsList>
  </div>
</template>

<script>
import SmsList from './SmsList'
import index from './src/index'
index.components = {
  SmsList
}
export default index
</script>

<style scoped>

</style>
