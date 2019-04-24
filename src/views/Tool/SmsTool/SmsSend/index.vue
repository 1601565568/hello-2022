<template>
  <el-tabs v-model="smsSendTabs" @tab-click="handleClick">
    <el-tab-pane label="手动批量发送" name="first">
      <el-form class="form-main" ref="smsForm" placement="right" label-width="110px" :model="model" :rules="rules">
        <el-form-item  label="接收人手机号码：" prop = "targetStr" required>
          <el-form-grid size="lg">
            <el-input type="textarea"
                      :autosize="{ minRows: 5, maxRows: 100}"
                      v-model = "model.targetStr"
                      placeholder="请输入接收人手机号码">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid>
            <div class="tmp-tips text-info"><i class="el-icon-info"></i> 请输入手机号码多个号码用“;”或“换行”隔开（每次限发20条）。</div>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="短信模板：" class = "el-inline-block"  prop = "template_id" >
          <el-form-grid size="lg">
              <ns-select v-model="model.template_id"
                         :url = "$api.touch.smsSend.queryCommonSmsTemplateOption"
                         filterable  clearable
                         :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="短信内容：" prop="send_content" required>
          <el-form-grid size="lg">
              <ns-sms-template v-model="model.send_content" :signature="model.signature_name"></ns-sms-template>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="短信签名：" prop= "signature_name" required>
          <el-form-grid size="lg">
              <ns-select  v-model="model.signature_name"
                          :url = "$api.touch.smsSignature.querySignatureOption"
                          filterable  clearable
                          :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
          </el-form-grid>
        </el-form-item>

        <el-form-item>
          <ns-button @click = "onSend" type="primary">发送</ns-button>
          <ns-button @click = "onReset" >{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="文件导入发送" name="second">
      <el-form class="form-main" ref="smsImportForm" placement="right" label-width="110px" :model="model" :rules="rules2">
        <el-form-item label="上传文件：" required>
          <!--:http-request="uploadFile"-->
          <el-form-grid size="xmd">
              <el-upload
                ref="file"
                :limit-file-list="true"
                :file-list="fileList"
                :limit="1"
                :before-upload="beforeAvatarUpload"
                :action="uploadUrl"
                :on-success="onUploadSuccess"
                :on-error="onUploadError"
                :on-remove="onUploadRemove"
                accept=".xlsx,.xls" name="file" >
                <ns-button size="small"  type="primary">选择文件</ns-button>
                <div slot="tip" class="el-upload__tip" style="width: 500px">
                  <div class="tmp-tips text-warning"><i class="el-icon-warning"></i>
                    请上传excel文件，后缀名为.xlsx或.xls<a class="text-primary" href="/static/fileTemplates/批量手机号模板.xlsx">下载模板</a>
                  </div>
                </div>
              </el-upload>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="短信模板：" class = "el-inline-block"  prop = "template_id" >
          <el-form-grid size="lg">
              <ns-select v-model="model.template_id"
                         :url = "$api.touch.smsSend.querySmsTemplateOption"
                         filterable  clearable
                         :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="短信内容："  prop="send_content" required>
          <el-form-grid size="lg">
              <ns-sms-template v-model="model.send_content" :signature="model.signature_name"></ns-sms-template>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="短信签名：" class = "el-inline-block" required prop = "signature_name" >
          <el-form-grid size="lg">
              <ns-select  v-model="model.signature_name"
                          :url = "$api.touch.smsSignature.querySignatureOption"
                          filterable  clearable
                          :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
          </el-form-grid>
        </el-form-item>

        <el-form-item>
          <ns-button @click = "onSave2" type="primary">发送</ns-button>
          <ns-button @click = "onReset2" >{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>
<script>
import index from './src/index'
import NsSmsTemplate from 'web-crm/src/components/NsSmsTemplate'
index.components = {
  NsSmsTemplate
}

export default index
</script>
