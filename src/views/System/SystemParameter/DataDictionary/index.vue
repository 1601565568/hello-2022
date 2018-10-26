<template>
  <div >
    <ns-table-data-dictionary ref="dataDictionaryTable" :types="types" @edit="onEdit" @add="onAdd"></ns-table-data-dictionary>
    <el-dialog ref="dataDictionaryDialog" :title="dialogTitle" width="400px"
               :visible="dataDictionaryVisible"
               :close-on-click-modal="false" :before-close="onCloseDialog">
      <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules" v-loading="loading"
               :element-loading-text="$t('prompt.loading')">
        <el-form-item label="名称：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="name">
              <el-input type="text" v-model.trim="model.name" placeholder="请输入数据字典名称，限制50字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="编码：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="code">
              <el-input type="text" v-model.trim="model.code" placeholder="请输入编码，限制50字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="类型：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="type">
              <el-select v-model="model.type" filterable>
                <el-option v-for="(value,key) in types" :key="key" :label="value" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="序号：" >
          <el-form-grid size="xmd">
            <el-form-item prop="order_num">
              <el-input type="number" class="text-right" v-model.number="model.order_num" placeholder="请输入序号">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="备注：" >
          <el-form-grid size="xmd">
            <el-form-item prop="remark">
              <el-input type="textarea" v-model.trim="model.remark" placeholder="请输入备注，限制50字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dataDictionaryVisible = false">{{$t('operating.cancel')}}</ns-button>
        <ns-save :loading="saveBtnLoading" @click="onSave"></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import index from './src/index'
  import NsTableDataDictionary from './NsTableDataDictionary'
  index.components = {
    NsTableDataDictionary
  }
  export default index
</script>
