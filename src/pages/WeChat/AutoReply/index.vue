<template>
  <div>
    <NsTableAutoReply ref="mainTable" :url=$api.weChat.autoReply.findList
                     @open-dialog="onOpenDialog" @onShowEmployeeScope='onShowEmployeeScope' @onShowShopScope='onShowShopScope'>
    </NsTableAutoReply>
    <!-- 使用门店 -->
    <el-dialog ref="shopDialog" :visible.sync="nsTableShopScopeModel.visible"
               @open='onOpenShopDialog()' @closed='onCloseShopDialog()'
               title="使用门店"
               width="660px">
      <ns-table-shop-scope ref='shopTable' :data="nsTableShopScopeModel"></ns-table-shop-scope>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="nsTableShopScopeModel.visible = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 使用员工 -->
    <el-dialog ref="employeeDialog" :visible.sync="nsTableEmployeeScopeModel.visible"
               @open='onOpenEmployeeDialog()' @closed='onCloseEmployeeDialog()'
               title="使用员工"
               width="660px">
      <ns-table-employee-scope ref='employeeTable' :data="nsTableEmployeeScopeModel"></ns-table-employee-scope>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="nsTableEmployeeScopeModel.visible = false">关闭</ns-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import index from './src/index.js'
import ElUpload from '@nascent/nui/lib/upload'
import NsTableAutoReply from './NsTableAutoReply'
import NsTableEmployeeScope from './NsTableEmployeeScope.vue'
import NsTableShopScope from './NsTableShopScope.vue'
import ElImage from '@nascent/nui/lib/image'
index.components = {
  NsTableAutoReply,
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
