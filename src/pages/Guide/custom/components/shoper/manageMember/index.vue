<template>
  <div>
    <PageTop />
    <ManagementTool/>
    <StoreGuide />
  </div>
</template>
<script>
import PageTop from './pageTop'
import ManagementTool from './managementTool'
import StoreGuide from './storeGuide'
export default {
  components: {
    PageTop,
    ManagementTool,
    StoreGuide
  }
}
</script>
<style lang="scss" scoped></style>
