<template>
  <div id="sendEmail" class="form-main">
    <div class="tmp-page__content">
      <el-form :model="model" ref="sendEmailForm" :rules="rules" placement="right" label-width="100px">

        <el-scrollbar ref="emailSendHeight" outsider>
          <el-form-item label="发件人：" prop="send_name" required>
            <el-form-grid size="xmd">
                <el-input type="text"
                          v-model.trim="model.send_name"
                          placeholder="请输入发件人名称">
                </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="发件地址：" required prop="send_addr">
            <el-form-grid size="xmd">
              <el-input type="text"
                        v-model.trim="model.send_addr"
                        placeholder="请输入发件地址">
              </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="收件人：" required prop="targetStr">
          <el-form-grid size="xmd">
              <el-input type="textarea"
                        :autosize="{ minRows: 4, maxRows: 40}"
                        v-model="model.targetStr"
                        placeholder="请输入收件人地址">
              </el-input>
          </el-form-grid>
          <el-form-grid block class="text-info"><i class="el-icon-info"></i>请输入邮件地址，多个地址用“;”或“换行”隔开（每次限发100封）。</el-form-grid>
        </el-form-item>
        <el-form-item label="邮件模板：" prop = "template_id" class = "el-inline-block">
          <el-form-grid size="xmd">
              <ns-select v-model="model.template_id"
                         :url = "$api.touch.emailTemplate.queryEmailTemplateOption"
                         filterable  clearable
                         :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="邮件标题：" prop="title_name" required>
          <el-form-grid size="xlg">
              <el-input type="text"
                        v-model.trim="model.title_name"
                        placeholder="请输入邮件标题">
              </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item  label="邮件内容：" prop="editor" required>
            <el-form-grid class="el-block no-margin"  width="600px">
                <vue-ueditor-wrap :config="myConfig" v-model="model.editor" @ready="editorReady"></vue-ueditor-wrap>
            </el-form-grid>
          <el-form-grid block class="text-info"><i class="el-icon-info"></i>请输入邮件内容且 <span class="text-warning">内容不能包含占位符。</span></el-form-grid>
        </el-form-item>

        <el-form-item label="选择通道：" prop = "sp_id"  required>
          <el-form-grid size="xmd">
              <ns-select v-model="model.sp_id"
                         :url = "$api.touch.ysChannel.queryEmailChannelOptions"
                         filterable  clearable
                         :placeholder="$t('prompt.select')" :multiple="false">
              </ns-select>
            </el-form-grid>
          </el-form-item>
        </el-scrollbar>
        <el-form-item>
          <ns-button type="primary" @click="onSendEmail">发送</ns-button>
          <ns-button @click="resetForm">{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import index from './src/index'
  import VueUeditorWrap from 'vue-ueditor-wrap'

  index.components = {
    VueUeditorWrap
  }
  export default index
</script>

<style scoped>
  @import "../../../../style/small/variables.pcss";
  .el-scrollbar + .el-form-item {
    margin: var(--default-margin-base) 0 0 0!important;
  }
</style>
