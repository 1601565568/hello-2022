
<template>
  <div>
    <el-dialog :title="dialogTitle"
               :visible.sync="visible"
               :show-scroll-x="false"
               :close-on-click-modal="false"
               :before-close="onDialogClose"
               width="1100px"
               :modal-append-to-body='appendToBody'
               :append-to-body='appendToBody'>
      <div>
        <div class="head-wechat">
        </div>

        <div>
          <ElTable v-loading="tableLoading"
                   ref="employeeTable"
                   :data="employeeData"
                   height="260"
                   class="new-table_border">
            <template v-if="cloudPlatformType === 'ecrp'">
              <ElTableColumn :show-overflow-tooltip="true"
                           prop="name"
                           label="所属员工"/>
              <ElTableColumn :show-overflow-tooltip="true"
                           prop="name"
                           label="工作门店"/>
            </template>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="name"
                           label="企业微信成员"
                           v-else/>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="userId"
                           label="添加时间"/>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="userId"
                           label="来源">
              <template slot-scope="scope">
                {{scope.row.addWay ? addWay[scope.row.addWay] ? addWay[scope.row.addWay] : '未知' : '未知'}}
              </template>
            </ElTableColumn>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="userId"
                           label="备注手机号"/>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="userId"
                           label="备注名"/>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="userId"
                           label="描述"/>
            <ElTableColumn :show-overflow-tooltip="true"
                           prop="userId"
                           label="企业微信标签"/>
          </ElTable>
          <el-pagination v-if="_data.pagination4Emp.enable"
                         class="template-table__pagination"
                         :page-sizes="_data.pagination4Emp.sizeOpts"
                         :total="_data.pagination4Emp.total"
                         :current-page="_data.pagination4Emp.page"
                         :page-size="_data.pagination4Emp.size"
                         :layout="true ? 'total, sizes, prev, pager, next' : 'total'"
                         @size-change="$sizeChange$"
                         @current-change="searchEmployee">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import index from './src/index.js'
// index.components = {
// }
export default index
</script>

<style scoped>
@import "@theme/variables.pcss";
.el-input__suffix:before {
  display: none !important;
}
.head-wechat {
  width: 240px;
  margin: 20px 0 30px 0;
}

>>> .el-table th.el-table-column--selection > .cell {
  padding: 0 14px;
}
/* 表格 */
.new-table_border {
  >>> .el-table__header th {
    background-color: #f5f5f5;
    padding: 8px 0;
    .cell {
      position: relative;
      &:after {
        content: " ";
        position: absolute;
        background: #e8e8e8;
        width: 1px;
        right: 0;
        top: 0px;
        bottom: 0px;
      }
    }
    &:last-child {
      .cell:after {
        display: none;
      }
    }
  }
}
</style>
