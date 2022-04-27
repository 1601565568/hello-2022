<template>
  <div class="template-page">
    <ns-table-activity-examine ref="table" @showAudit="showAudit"></ns-table-activity-examine>
    <!-- 审核好友营销活动drawer -->
    <CheckActivityDrawer
      ref="CheckActivityDrawer"
      :visible.sync="visible"
      :messageId="messageId"
      @examine="examineActivity"
    />
    <!-- 审核Dialog -->
    <ExamineActivityDialog
      :visible.sync="visibleExamineDialog"
      :messageId="messageId"
      @confirm="confirmExamineActivity"
    />
  </div>
</template>

<script>
import index from './src'
import NsTableActivityExamine from './NsTableActivityExamine'
import CheckActivityDrawer from './components/CheckActivityDrawer.vue'
import ExamineActivityDialog from './components/ExamineActivityDialog.vue'
index.components = {
  NsTableActivityExamine,
  CheckActivityDrawer,
  ExamineActivityDialog
}
export default index
</script>
