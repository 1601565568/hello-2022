<template>
  <div class="template-page">
    <NsTableEnterpriseWeChat ref="table"></NsTableEnterpriseWeChat>
  </div>
</template>

<script>
import index from './src/index'
import NsTableEnterpriseWeChat from './NsTableEnterpriseWeChat'

index.components = {
  NsTableEnterpriseWeChat
}
export default index
</script>
<style scoped>
</style>
