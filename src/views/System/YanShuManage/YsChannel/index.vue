<template>
  <div >
    <div class="template-page">
      <ns-ys-channel ref="table"  @open-dialog="onOpenDialog" @default-change="onDefaultChange">
      </ns-ys-channel>
    </div>

    <el-dialog :title="dialogTitle" :visible="dialogVisible"
                  :close-on-click-modal = "false" :before-close="onCloseDialog" width="450px">
        <el-form ref="form" placement="right" label-width="140px" :model="model" :rules="rules">
          <el-form-item label="通道账号：" prop = "ys_account" required>
            <el-form-grid size="xmd">
                <el-select v-model="model.ys_account" filterable clearable
                           :placeholder="$t('prompt.select')" :multiple="false">
                  <el-option v-for="option in accountOptions" :key="option.value" :label="option.label"
                             :value="option.value"></el-option>
                </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="通道名称：" prop = "sp_name"  required>
            <el-form-grid size="xmd">
                <el-input  type="text" v-model.trim = "model.sp_name" placeholder="请输入通道名称，限制20字">
                </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="触达方式：" prop = "channel_type"  required>
            <el-form-grid size="xmd">
                <el-select v-model="model.channel_type" filterable  clearable :placeholder="$t('prompt.select')" :multiple="false">
                  <el-option label="短信"  :value="1"></el-option>
                  <el-option label="邮件"  :value="2"></el-option>
                </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="通道标识：" prop = "channel_code"  required>
            <el-form-grid size="xmd">
                <el-input type="text" v-model.trim = "model.channel_code" placeholder="请输入通道标识，限制30字">
                </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="使用场景：" prop = "send_mode"  required v-show="showSendModel">
            <el-form-grid size="xmd">
                <el-select v-model="model.send_mode" filterable  clearable :placeholder="$t('prompt.select')" :multiple="false">
                  <el-option label="不限"  :value="0"></el-option>
                  <el-option label="触达"  :value="1"></el-option>
                  <el-option label="营销"  :value="2"></el-option>
                </el-select>
            </el-form-grid>
          </el-form-item>
          <el-form-item  label="设为默认：" required>
            <el-form-grid size="xmd">
                  <el-switch v-model="model.is_default" :active-value="1"
                             :inactive-value="0" type="text">
                  </el-switch>
            </el-form-grid>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="onCloseDialog">{{$t('operating.cancel')}}</ns-button>
          <ns-save @click="onSave" ></ns-save>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import index from './src/index'
import NsYsChannel from './NsYsChannel'

index.components = {
  NsYsChannel
}
export default index
</script>
