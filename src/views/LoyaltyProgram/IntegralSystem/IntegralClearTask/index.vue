<template>
  <div>
    <ns-table-integral-clear ref="table" @open-dialog="onOpenDialog"></ns-table-integral-clear>
    <el-dialog ref="dialog" title="新建积分清零规则" :visible="visible" :before-close="onClose" width="550px">
      <div class="form" v-loading="loading" element-loading-text="数据保存中...">
        <el-form ref="form" placement="right" label-width="150px" :model="model" :rules="rules">
          <el-form-item label="积分清零范围：" required prop= "before_time">
            <el-form-grid size="xmd">
              <el-date-picker type="datetime" popper-class="date-hideNow" placeholder="请选择积分清零范围" v-model="model.before_time"
                              :picker-options="pickerOptions" default-time="23:59:59" value-format='yyyy-MM-dd HH:mm:ss' style="width: 300px" ></el-date-picker>
            </el-form-grid>
            <el-form-grid block>
              <div class="tmp-tips text-warning"><i class="el-icon-warning"></i>
                清零积分范围为截止该选择时间前获得的全部积分
              </div>
            </el-form-grid>
          </el-form-item>
          <el-form-item class='edit-form el-form-validate__unHide' label="操作备注："  prop="operate_remark" required>
            <el-form-grid width="300">
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                        placeholder="请输入操作备注" v-model="model.operate_remark">
              </el-input>
            </el-form-grid>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="onClose">{{$t('operating.cancel')}}</ns-button>
        <ns-save @click="onSave" ></ns-save>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import index from './src/index'
  import NsTableIntegralClear from './NsTableIntegralClear'

  index.components = {
    NsTableIntegralClear
  }
  export default index
</script>
