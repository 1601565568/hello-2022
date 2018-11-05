<template>
  <div>
    <ns-table-wx-account ref="table"></ns-table-wx-account>
   <!-- <el-dialog :title="dialogTitle" :visible="wxAccountVisible" nwidth="500px"
               :close-on-click-modal="false" :before-close="onCloseDialog">
      <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules">
        <el-form-item label="公众号：" class="el-inline-block" required>
          <el-form-grid size="xmd">
            <el-form-item prop="wx_name">
              <el-input
                type="text" v-model="model.wx_name" placeholder="请输入公众号，限制50字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="appKey："  required>
          <el-form-grid size="xmd">
            <el-form-item prop="app_key">
              <el-input type="text" v-model="model.app_key"
                        placeholder="请输入appKey，限制50字"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="appSecret："  required>
          <el-form-grid size="xmd">
            <el-form-item prop="app_secret">
              <el-input type="text" v-model="model.app_secret"
                        placeholder="请输入appSecret，限制50字"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item
        label="是否启用：">
        <el-form-grid size="xmd">
        <el-form-item prop="wx_status">
        <el-switch  :active-value="1" :inactive-value="0" v-model="model.wx_status"></el-switch>
        </el-form-item>
        </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onCloseDialog">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave" ></ns-save>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
  import index from './src/index'
  import NsTableWxAccount from './NsTableWxAccount'
  index.components = {
    NsTableWxAccount
  }
  export default index
</script>
