<template>
  <div>
    <ns-table-hash ref="table" :url="$api.core.hash.queryTable" @add="onAddForm" @edit="onEditForm" @delete="onDelete"></ns-table-hash>
    <el-dialog :title="title" width="400px"
               :visible="visible"
               :close-on-click-modal="false" :before-close="onClose">
      <el-form ref="form" placement="right" label-width="100px" :model="model" :rules="rules" v-loading="loading"
               :element-loading-text="$t('prompt.loading')">
        <el-form-item label="哈希名称："  required>
          <el-form-grid size="xmd">
            <el-form-item prop="hash_name">
              <el-input type="text" v-model="model.hash_name" disabled placeholder="请输入哈希名称，限制50字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="哈希键："  required>
          <el-form-grid size="xmd">
            <el-form-item prop="hash_key">
              <el-input type="text" v-model="model.hash_key" disabled placeholder="请输入哈希键，限制50字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="哈希值：" required>
          <el-form-grid size="xmd">
            <el-form-item prop="hash_value">
              <el-input class="text-right" :disabled="model.is_write === 0" v-model="model.hash_value" placeholder="请输入哈希值,限制250字">
              </el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="哈希类型：" >
          <el-form-grid size="xmd">
            <el-form-item prop="hash_type">
              <el-select v-model="model.hash_type" disabled	>
                <el-option  v-for="(type,index) in types" :label="type.label" :value="type.value" :key="'type'+index"></el-option>
              </el-select>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="是否只读：">
          <el-form-grid size="xmd">
            <el-form-item >
              {{model.is_write === 0 ? '是' : '否' }}
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="备注：">
          <el-form-grid size="xmd">
            <el-form-item prop="remark">
              <el-input type="textarea" v-model="model.remark" placeholder="请输入备注，限制250字">
              </el-input>
            </el-form-item>
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
  import NsTableHash from './NsTableHash'
  index.components = {
    NsTableHash
  }
  export default index
</script>
