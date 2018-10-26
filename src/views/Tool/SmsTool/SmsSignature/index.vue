<template>
  <div>
      <ns-table-sms-signature ref="table" @open-dialog="onOpenDialog" @effective-change="onEffectiveChange" @default-change="onDefaultChange" >
      </ns-table-sms-signature>
      <el-dialog ref="dialog" :title="dialogTitle" :visible="visible"
                 :close-on-click-modal = "false" :before-close="onClose" width="450px">
        <el-form ref="form" placement="right" label-width="150px" :model="model" :rules="rules">
          <el-form-item label="签名：" required prop= "signature_name">
            <el-form-grid size="xmd">
                <el-input  type="text"
                           v-model.trim = "model.signature_name"
                           placeholder="请输入签名，限2-30字">
                </el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="所属店铺：" prop= "shop">
            <el-form-grid size="xmd">
              <ns-select  v-model="model.shop_id" filterable :placeholder="$t('prompt.select')"
                          :multiple="false" :url="$api.core.common.getTopShopData4Options"></ns-select>
            </el-form-grid>
          </el-form-item>
          <!--<el-form-item label="审核后立即生效："  prop= "is_effective" style="width: 200px">
            <el-form-grid size="xmd">
                <el-switch :active-value="1" :inactive-value="0"  v-model = "model.is_effective" >
                </el-switch>
            </el-form-grid>
          </el-form-item>-->
          <el-form-item label="是否默认：" prop= "is_default">
            <el-form-grid size="xmd">
                <!--  :before-change="(call,currVal)=>{onStateChange(call,currVal,scope.row)}"  -->
                <el-switch :active-value="1" :inactive-value="0"  v-model = "model.is_default" >
                 </el-switch>
            </el-form-grid>
          </el-form-item>

          <!--<el-form-item label="部门名称：">
            <el-form-grid size="xmd">
              <el-form-item>
                {{ model.department_name}}
              </el-form-item>
            </el-form-grid>
          </el-form-item>-->

        </el-form>
        <div slot="footer" class="dialog-footer">
          <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
          <ns-button type="primary" @click="onSavaAndSubmit" >保存并提交审核</ns-button>
          <ns-save @click="onSave"></ns-save>
        </div>
      </el-dialog>
  </div>
</template>
<script>
  import index from './src/index'
  import NsTableSmsSignature from './NsTableSmsSignature'
  index.components = {
    NsTableSmsSignature
  }
  export default index
</script>
