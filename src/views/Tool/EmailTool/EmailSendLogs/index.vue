<template>
  <div>
    <!-- 表格 -->
    <ns-table-email-send-logs ref="sendEmailLogForm" @email-detail="onEmailDetail">
    </ns-table-email-send-logs>
    <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false" v-model="emailSendLogDetail" width="840px">
      <el-form label-width="100px">
        <el-form-item label="收件人：" >
          <el-form-grid>
            <div v-for="target in emailSendLogDetail.targets">{{target}}</div>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="时间：" >
          <el-form-grid>{{emailSendLogDetail.send_time}}</el-form-grid>
        </el-form-item>
        <el-form-item label="发件人：" >
          <el-form-grid>
            {{emailSendLogDetail.send_name}}
            <span v-show="emailSendLogDetail.send_addr">[{{emailSendLogDetail.send_addr}}]</span>

          </el-form-grid>
        </el-form-item>
        <el-form-item label="邮件标题：" >
          <el-form-grid>{{emailSendLogDetail.title_name}}</el-form-grid>
        </el-form-item>
        <el-form-item label="邮件内容：">
          <el-form-grid class="el-block-box is-gray-bg" block>
            <div class="mailtemplate-preview">
              <div class="control-content" v-html="emailSendLogDetail.email_content"></div>
            </div>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDialog">关闭</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import index from './src/index'
import NsTableEmailSendLogs from './NsTableEmailSendLogs'

index.components = {
  NsTableEmailSendLogs
}
export default index
</script>
