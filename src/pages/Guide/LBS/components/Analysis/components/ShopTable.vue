<template>
  <page-table class='no-padding'>
    <template slot='table'>
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        :row-style="tableRowClassName"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="活动名称">
          <template slot-scope="scope">
            <div class="scope-title">
              <div class="scope-title_text">
                {{scope.row.name}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          width='250px'
          label="操作">
          <template slot-scope="scope">
            <ns-button type="text" v-copy='scope.row.activityPlacard'>查看详情</ns-button>
            <ns-button type="text" v-if='scope.row.status!==1' @click='handleAnalysis(scope.row.lbsId)'>添加群聊</ns-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </page-table>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  components: {
    PageTable
  },
  mixins: [tableMixin]
}
</script>
<style lang="scss" scoped>
  @import "@components/NewUi/styles/reset.css";
  .template-table.no-padding {
    padding: 0;
  }
</style>
