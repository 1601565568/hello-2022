<template>
  <div>
    <ns-table-download ref="table" @download="onBeforeDownload"></ns-table-download>
    <el-dialog ref="permisionDialog" :title="dialogTitle" :visible="permisionVisible" :close-on-click-modal="false"
               :before-close="onCloseDiaglog" width="600px" >
      <el-form label-width="100px" placement="right" class="institution-form"  :model ="model" ref = "permissionForm" :rules="rules" >
        <el-form-item  label="手机号： "  prop = "template"   class="el-inline-block" >
          <el-form-grid size="sm">
            <el-form-item prop = "mobile">
              <el-input placeholder="请输入手机号" readonly  v-model="model.mobile"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <ns-button type="primary"  @click = "sendCode" :disabled="captchaDisabled" >{{getCaptChaStr}}</ns-button>
        <el-form-item label="验证码："   required>
          <el-form-grid size="xmd">
            <el-form-item  prop = "verificationCode">
              <el-input   v-model="model.verificationCode"    placeholder="请输入验证码"   ></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
        <el-form-grid class="text-info ml-sm"><i class="el-icon-info"></i>验证码获取一次，若在5分钟内不需要重复获取验证码</el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDiaglog">{{$t('operating.cancel')}}</ns-button>
        <ns-button type="primary" @click="onSubmitAndDownload">下载</ns-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import index from './src/index'
import NsTableDownload from './NsTableDownload'

index.components = {
  NsTableDownload
}
export default index
</script>
