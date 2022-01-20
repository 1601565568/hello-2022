<template>
  <div>
    <NsTableWelcomes ref="mainTable" :url=$api.weChat.welcomes.findList
                     @open-dialog="onOpenDialog" @onShowEmployeeScope='onShowEmployeeScope' @onShowShopScope='onShowShopScope'>
    </NsTableWelcomes>
  </div>
</template>

<script>
import index from './src/index.js'
import ElUpload from '@nascent/nui/lib/upload'
import NsTableWelcomes from './NsTableWelcomes'
import NsTableEmployeeScope from './NsTableEmployeeScope.vue'
import ElImage from '@nascent/nui/lib/image'

index.components = {
  NsTableWelcomes,
  ElUpload,
  ElImage,
  NsTableEmployeeScope,
  NsTableShopScope
}
export default index
</script>
<style scoped>
  @import "@theme/variables.pcss";
</style>
