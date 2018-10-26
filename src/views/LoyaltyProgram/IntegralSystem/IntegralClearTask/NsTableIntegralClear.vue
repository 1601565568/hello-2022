<template>
  <ns-page-table ref="table" @open-dialog="$emit('open-dialog')">
    <!-- 表格外按钮 start -->
    <template slot="buttons">
      <ns-table-operate-button :buttons="_data._table.operate_buttons">
      </ns-table-operate-button>
    </template>
    <!-- 表格外按钮 end -->
    <!-- 表格 start -->
    <template slot="table">
      <el-table ref="table" :data="_data._table.data" class="template-table__main"
                stripe resizable v-loading.lock="_data._table.loadingtable"
                :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
        <el-table-column :show-overflow-tooltip="false" type="default" prop="clear_time"
                         label="清零时间" :sortable="false" width="150" align="center">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" type="default" prop="before_time"
                         label="清零时间范围" :sortable="false" width="250" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.before_time}} 前所获得的积分</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" type="default" prop="operate_remark"
                         label="操作备注" :sortable="false" align="left">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" type="default" prop="clear_task_status"
                         label="执行状态" :sortable="false" width="80" align="center">
          <template slot-scope="scope">
            <span v-if='scope.row.clear_task_status == 0'>待执行</span>
            <span v-if='scope.row.clear_task_status == 1'>执行中</span>
            <span v-if='scope.row.clear_task_status == 2'>执行失败</span>
            <span v-if='scope.row.clear_task_status == 3'>执行完成</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="false" type="default" prop="result"
                         label="执行结果" :sortable="false"  align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.result != '' && scope.row.result != null">
              {{scope.row.result}}
            </template>
            <template v-else>
              -
            </template>
          </template>

        </el-table-column>
      </el-table>
    </template>
    <!-- 表格 end -->
  </ns-page-table>
</template>
<script>
  import NsTableIntegralClear from './src/NsTableIntegralClear'
  export default NsTableIntegralClear
</script>
<style scoped>
  @import "../../../../style/small/variables.pcss";
  >>> .template-table__main{
    border-radius: var(--default-radius-mini);
  }
</style>
