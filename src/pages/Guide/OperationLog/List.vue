<template>
  <div>
    <ns-table-guide ref="table" :url=$api.guide.guide.operationlogFindList @viewDetails = "viewDetails">
    </ns-table-guide>
    <!--  查看详情弹窗开始  -->
    <el-dialog :title="title" :visible.sync="detailShow" width="1000px"  >
      <div>
        <el-form label-width="70px">
          <el-form-item label="变更人：">
            {{changeValue.operatorName || '-'}}
          </el-form-item>
          <el-form-item label="操作时间：">
            {{changeValue.createTime || '-'}}
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="list"
          stripe>
          <el-table-column label="操作前" align="left">
            <template slot-scope="scope">
              <span :class="scope.row.before !== scope.row.after ? 'warning-row' : ''" v-if="scope.row.before">{{scope.row.before}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作后" align="left">
            <template slot-scope="scope">
              <span :class="scope.row.before !== scope.row.after ? 'warning-row' : ''" v-if="scope.row.after">{{scope.row.after}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <ns-button @click="detailShow = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 查看详情结束 -->
  </div>
</template>

<script>
import List from './src/List'
import NsTableGuide from './NsTableGuide'
List.components = {
  NsTableGuide
}
export default List
</script>
<style scoped>
  .warning-row {
    background: palevioletred;
    color: white;
    padding: 3px;
  }
</style>
