<template>
  <div class="template-page">
    <ns-table-template ref="smsTemplate" @add-template="addTemplate" @update-template="updateTemplate"></ns-table-template>
    <!-- 弹框 -->
    <el-dialog ref="addNoteDialog" :title="title" :visible="smsVisible" width="700px" :before-close="onCloseDialog" :close-on-click-modal="false">
      <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules">
        <el-form-item label="模板标题：" required prop="template_title" >
          <el-form-grid size="lg">
              <el-input  type="text" v-model.trim="model.template_title" placeholder="请输入模板标题，限制30字"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item required label="模板类型："  prop="template_type">
          <el-form-grid size="lg">
              <el-select v-model="model.template_type" :placeholder="$t('prompt.select')">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="短信内容：" required prop="template">
          <el-form-grid width="550" block v-show="state.tplTags.length>0">
            <div class="tmp-fieldset__tags">
              <el-tag v-for="tag in state.tplTags" :key="tag.id" @click.native="tagClick(tag.key)" class="margin-r-mini">{{tag.text}}</el-tag>
            </div>
          </el-form-grid>
          <el-form-grid width="550" class="form-textarea">
            <el-input :rows="4" v-model="model.template" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item>
         <el-form-grid>
           <div class="tmp-tips text-info"><i class="el-icon-info"></i>
             温馨提示：模板不需要包含短信签名，不超过500字
           </div>
         </el-form-grid>
       </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDialog">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSaveOrUpdateTemplate" ></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import index from './src/index'
import NsTableTemplate from './NsTableTemplate'
index.components = {
  NsTableTemplate
}
export default index
</script>
