<template>
  <el-dialog
    title="绑定终端"
    :visible.sync="sVisible"
    width="400px"
    @closed="onClose">
    <el-form ref="saveForm" :model="model" @submit.native.prevent
             class="pull-right"
             label-width="100px"
             novalidate='novalidate'
             :rules='rules'
              style='margin-bottom: 30px'>
      <el-form-item label="工号：" prop="deviceNo">
        <el-form-grid size='xmd'>
          {{guide.work_id?guide.work_id:'-'}}
        </el-form-grid>
      </el-form-item>
      <el-form-item label="姓名：" prop="deviceNo">
        <el-form-grid size='xmd'>
          {{guide.name}}
        </el-form-grid>
      </el-form-item>
      <el-form-item label="职位：" prop="deviceNo">
        <el-form-grid size='xmd'>
          {{guide.job == 1 ? "店长" : "导购"}}
        </el-form-grid>
      </el-form-item>
      <el-form-item label="终端设备ID：" prop="deviceNos" required>
        <el-form-grid size='xmd'>
          <el-select filterable placeholder="请选择" v-model="model.deviceNos" :multiple='true'
                     :multiple-limit='guide.job == 1 ? 0 : 1'>
            <el-option
              v-for="item in deviceList"
              :key="item.deviceID"
              :label="item.deviceID"
              :value="item.deviceID"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-grid>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <ns-button @click="sVisible = false">取 消</ns-button>
            <ns-button type="primary" @click="bindDevice" :loading='saving' :disabled='saving'>确 定</ns-button>
    </span>
  </el-dialog>
</template>
<script>
import Index from './src/bindDevice'

export default Index
</script>
<style scoped>

</style>
