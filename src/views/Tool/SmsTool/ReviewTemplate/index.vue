<template>
  <div >

    <ns-table-review-template ref="reviewTemplateTable" @open-dialog="onOpenDialog"></ns-table-review-template>
    <el-dialog ref="reviewTemplateDialog" :title="dialogTitle" :visible.sync="reviewTemplateVisible"
               :close-on-click-modal="false" :before-close="onCloseDialog" width="450px">
      <el-form ref="form" placement="right" label-width="100px"
               :model="model" :rules="rules" v-loading="loading"
               :element-loading-text="$t('prompt.loading')">
        <el-form-item label="模板名称：" class="el-inline-block" required>
          <el-form-grid size="lg">
            <el-form-item prop="template_title">
              <el-input type="text" v-model.trim="model.template_title" placeholder="请输入模板标题，限制30字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>

        <el-form-item label="解释内容：" class="el-form-validate__unHide" required  prop="template">
          <el-form-grid size="lg">
              <el-input v-model="model.template" type="textarea" placeholder="请输入解释内容"></el-input>
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
  import NsTableReviewTemplate from './NsTableReviewTemplate'

  index.components = {
    NsTableReviewTemplate
  }
  export default index
</script>
