<template>
  <div>
    <ns-table-task ref="table" :url="$api.guide.task.findList" @add="addTask" @edit="edit" @stop="stopTask" @delete="deleteTask"></ns-table-task>
    <el-dialog ref="editDialog" :title="title" :visible.sync="dialogVisible"
               :modal-append-to-body="false">
      <el-form ref="form" placement="right" label-width="110px"
               :model="model" :rules="rules">
        <el-form-item label="任务名称：" required>
          <el-form-grid size="xxmd">
            <el-form-item prop="name">
              <el-input v-model="model.name"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="任务时间：" required>
          <el-form-grid size="xxmd">
            <el-form-item prop="activityTime">
              <el-date-picker v-model="model.activityTime" type="daterange"
                              :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="类型：" required>
          <el-form-grid>
            <el-form-item prop="type" :rules = "{required:true, message:'请选择类型'}">
              <el-radio-group v-model="model.type">
                <el-radio class="radio" :label="0">营销任务</el-radio>
                <el-radio class="radio" :label="1">关怀任务</el-radio>
                <el-radio class="radio" :label="2">分享任务</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="指派门店：" required>
          <el-form-grid>
            <el-form-item>
              <el-radio-group v-model="model.shopRangeType">
                <el-radio :label="0">全部门店</el-radio>
                <el-radio :label="1">指定门店</el-radio>
              </el-radio-group>
              <el-form-grid v-if="model.shopRangeType===1"  size="xxmd">
                <el-form-item prop="shopIds">
                  <el-select placeholder="请选择门店" v-model="model.shopIds" multiple filterable>
                    <el-option v-for="store in shopList" :label="store.shopName" :key="store.id" :value="store.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-grid>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="简述：" required>
          <el-form-grid size="xlg">
            <el-form-item prop="remark" :rules = "{required:true, message:'请输入简述'}">
              <el-input type="textarea" v-model="model.remark"></el-input>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <el-form-item label="执行次数：" required>
          <el-form-grid>
            <el-form-item prop="runType" :rules = "{required:true, message:'请选择执行次数'}">
              <el-radio-group v-model="model.runType">
                <el-radio class="radio" :label="0">一次性</el-radio>
                <el-radio class="radio" :label="1">每日执行</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-grid>
        </el-form-item>
        <template v-if="model.type === 2">
          <el-form-item label="分享素材：" required>
            <el-form-grid size="xxmd">
              <el-form-item prop="materialId">
                <ns-select v-model="model.materialId" placeholder="请选择素材"
                           :url="$api.guide.material.queryMaterials">
                </ns-select>
              </el-form-item>
            </el-form-grid>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="closeDialog">取消</ns-button>
        <ns-save @click="saveTask" :disabled = "forbidden"></ns-save>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import List from './src/List'
  import NsTableTask from './NsTableTask'
  List.components = {
    NsTableTask
  }
  export default List
</script>
