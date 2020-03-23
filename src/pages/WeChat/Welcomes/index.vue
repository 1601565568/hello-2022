<template>
  <div>
    <NsTableWelcomes ref="mainTable" :url=$api.weChat.welcomes.findList
                     @open-dialog="onOpenDialog" @onShowEmployeeScope='onShowEmployeeScope'>
    </NsTableWelcomes>
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
import NsTableWelcomes from './NsTableWelcomes'
import NsTableEmployeeScope from './NsTableEmployeeScope.vue'
import ElImage from '@nascent/nui/lib/image'
index.components = {
  NsTableWelcomes,
  ElUpload,
  ElImage,
  NsTableEmployeeScope
}
export default index
</script>
<style scoped>
  @import "@theme/variables.pcss";
</style>
