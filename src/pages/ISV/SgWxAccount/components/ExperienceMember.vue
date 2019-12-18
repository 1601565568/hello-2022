<template>
  <el-dialog
    title="体验成员管理"
    :visible.sync="sVisible"
    class="dialog-chat"
    @closed="onClose"
    v-loading.lock="loading"
    :element-loading-text="$t('prompt.loading')">
    <el-form label-width="80px"
             class="surround-btn"
             :model="model"
             ref="form"
             novalidate='novalidate'
             :rules='rules'>
      <el-form-item style='margin-bottom: 30px' label="微信号：" prop="wechatId">
        <el-form-grid size="xlg">
          <el-input v-model="model.wechatId" placeholder='请输入微信号'>
          </el-input>
        </el-form-grid>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <ns-button @click="sVisible = false">取消</ns-button>
      <ns-button @click="onBindOrUnBindExperienceMember(0)" :loading="saving" :disabled="saving" type="danger">解绑</ns-button>
      <ns-button type="primary" :loading="saving" :disabled="saving"
                 @click="onBindOrUnBindExperienceMember(1)">绑定</ns-button>
      </span>
  </el-dialog>
</template>
<script>
import Index from './src/experienceMember'

export default Index
</script>
<style scoped></style>
