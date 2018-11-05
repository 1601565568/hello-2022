<template>
  <div>
    <div class="instructions-content">
      <div class="instructions-content__info">
        1、为保障您系统数据的安全性，建议您开启下载短信验证功能。开启后当系统中有数据被下载时我们会发生验证码到此号码进行二次确认，防止您的数据被恶意泄露；<br>
        2、启用时请确保有足够的短信余额，当余额不足时此功能将自动关闭；<br>
      </div>
    </div>
    <el-form ref="firstForm" label-width="130px" placement="right" class="form-main" :model="model"
             :rules="rules" @submit.native.prevent>
      <el-form-item label="数据下载验证：">
        <el-form-grid size="xlg">
          <el-switch v-model="model.is_download_validate"
                     :active-value="1" :inactive-value="0"></el-switch>
        </el-form-grid>
      </el-form-item>
      <el-form-item label="下载验证手机：" required>
        <el-form-grid size="xmd">
          <el-form-item prop="validate_mobile">
            <el-input class="text-left" type="number" placeholder="请输入手机号" v-model="model.validate_mobile"></el-input>
          </el-form-item>
        </el-form-grid>
      </el-form-item>
      <el-form-item>
        <ns-save @click="onValidate"></ns-save>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="visible" title="短信验证" :before-close="onClose" width="450px">
      <el-form label-width="90px" ref="form" :model="model" :rules="rules">
        <el-form-item label="手机号：">
            <el-form-grid size="md">
              <el-form-item prop="validate_mobile">
                {{model.validate_mobile}}
              </el-form-item>
            </el-form-grid>
            <el-form-grid size="sm">
              <ns-button type="primary" @click="onSendCaptcha" :disabled="captchaDisabled">{{getCaptChaStr}}</ns-button>
            </el-form-grid>
        </el-form-item>
        <el-form-item label="验证码：" required>
          <el-form-grid size="md">
            <el-form-item prop="captcha">
              <el-input v-model="model.captcha" :maxlength="6"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
          <el-form-grid class="xmd">
            <div class="tmp-tips text-info"><i class="el-icon-info"></i>验证码获取成功后，1分钟内无需重复获取验证码
            </div>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
        <ns-save :loading="saveBtnLoading" @click="onSave"></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import index from './src/index'

  export default index
</script>
