<template>
  <div class="template-page">
    <ns-table-activity-examine ref="table" @showAudit="showAudit"></ns-table-activity-examine>
    <el-dialog title="审核活动" :visible.sync="visible"
               v-loading = "loading"
               element-loading-background="rgba(0, 0, 0, 0.11)"
               element-loading-text="数据加载中..."
               :before-close="onCloseDialog" width="470px">
      <el-form ref="form" placement="right" label-width="100px" :model="audioModel" :rules="rules">
        <el-form-item label="活动名称：" class = "el-inline-block">
          <el-form-grid size="xmd">
            {{audioModel.planName}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="活动类型：" class = "el-inline-block">
          <el-form-grid size="xmd">
            {{audioModel.marketingType}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="创建人：" class = "el-inline-block">
          <el-form-grid size="xmd">
            {{audioModel.userName}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="执行时间：" class = "el-inline-block">
          <el-form-grid size="xmd">
            {{audioModel.executeTime ? audioModel.executeTime : '立即发送'}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="营销对象：">
          <el-form-grid size="xmd">
            {{audioModel.obj}}
          </el-form-grid>
          <el-form-grid size="xmd">
            {{audioModel.userStr}}
          </el-form-grid>
        </el-form-item>
        <el-form-item label="审核意见：" prop="auditRemark">
          <el-form-grid size="xmd">
            <el-input v-model.trim = "audioModel.auditRemark"
                      type="textarea"
                      :rows="3"
                      maxlength="20"
                      show-word-limit
                      placeholder="请输入内容">
            </el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item label=" 审核状态：" prop="auditResult" class="el-form-validate__unHide">
          <el-form-grid>
            <el-radio-group  v-model="audioModel.auditResult">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDialog">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSaveAuditInfo" ></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import index from './src'
import NsTableActivityExamine from './NsTableActivityExamine'
index.components = {
  NsTableActivityExamine
}
export default index
</script>
