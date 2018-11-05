<template>
  <div>
    <ns-table-wx-template ref="wxTemplateTable" @add="onAdd" @edit="onEdit"
                          :template-type-options="templateTypeOptions"></ns-table-wx-template>
    <el-dialog  :title="dialogTitle" :visible.sync="wxTemplateVisible" width="600px"
               :close-on-click-modal="false" :before-close="onClose">
      <el-form ref="form" placement="right" label-width="120px"
               :model="model" :rules="rules" v-loading="loading"
               :element-loading-text="$t('prompt.loading')">
        <el-form-item label="微信官方模板：" prop="templateCode" required>
          <el-form-grid size="xmd">
             <el-select filterable v-model="model.templateCode" @change="onSelectWxTemplate">
               <el-option v-for="(tag, index) in wxTemplateTagsList" :label="tag.wx_template_name" :value="tag.wx_template_code" :key="index"></el-option>
             </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="模板名称：" prop="templateName" required>
          <el-form-grid size="xmd">
            <el-input type="text" v-model.trim="model.templateName" placeholder="请输入模板名称，限50字"></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="模板类型：" prop="templateType" required>
          <el-form-grid size="xmd">
              <el-select v-model="model.templateType" filterable
                         :placeholder="$t('prompt.select')">
                <el-option v-for="option in templateTypeOptions" :key="option.value" :label="option.label"
                           :value="option.value"></el-option>
              </el-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="模板设置：">
            <div class="receive-part" style="width: 366px">
                <el-form-item label-width="50px" label="内容：" prop="template.detailContent">
                  <el-form-grid size="lg">
                  <el-input type="textarea" v-model.trim="model.template.detailContent" placeholder="请输入内容，限100字"></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item  label-width="50px"  label="备注：" prop="template.remark">
                  <el-form-grid size="lg">
                  <el-input type="textarea" v-model.trim="model.template.remark" placeholder="请输入备注，限100字"></el-input>
                  </el-form-grid>
                </el-form-item>
                <el-form-item  label-width="50px"  label="链接：" prop="template.detailLink" :rules="{message:'请输入正确的链接地址',trigger:'blur',type: 'url'}">
                  <el-form-grid size="lg" >
                  <el-input v-model.trim="model.template.detailLink" placeholder="请输入链接"></el-input>
                  </el-form-grid>
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item v-if="model.templateCode" label="模板预览：">
          <el-form-grid width="366">
            <el-form-item>
              <div class="receive-part">
                <p class="font-size-middle">
                  {{currWxTemplate.wx_template_name}}
                </p>
                <p class="text-secondary font-size-small">{{dateStr}}</p>
                <p class="text-info">{{model.template.detailContent}}</p>
                <p v-for="(item,itemIndex) in model.template.templateTags" :key="itemIndex">
                  <el-form-grid width="lg">
                    <el-form-item label-width="1" :label="item.wxTagName + '：'">
                       <span class="text-info">
                               {{item.wxTagExample}}
                       </span>
                    </el-form-item>
                  </el-form-grid>
                </p>
                <p class="text-info">{{model.template.remark}}</p>
                <a class="more-info"  v-if = "model.template.detailLink" :href="model.template.detailLink" target="_blank">详情</a>
                <a class="more-info" v-else>详情</a>
              </div>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
        <ns-save :loading="saveBtnLoading" @click="onSave" ></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import index from './src/index'
  import NsTableWxTemplate from './NsTableWxTemplate'

  index.components = {
    NsTableWxTemplate
  }
  export default index
</script>

<style scoped>
  @import "../../../../style/small/variables.pcss";
  .receive-part {
    line-height: 20px;
    border: 1px dashed var(--theme-base-border-color-primary);
    padding: var(--default-margin-base) var(--default-margin-larger);
  }

  .more-info {
    margin-top: var(--default-margin-base);
    border-top: 1px solid var(--theme-base-border-color-primary);
    padding-top: var(--default-margin-base);
    display: block;
    cursor: pointer;
  }
</style>
