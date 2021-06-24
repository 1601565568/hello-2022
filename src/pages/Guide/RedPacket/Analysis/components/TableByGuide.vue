<template>
  <page-table style="padding-top:0">
    <template slot="table">
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        style="width: 100%">
        <el-table-column
          prop="dayTime"
          label="员工">
        </el-table-column>
        <el-table-column
          prop="dayTime"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="todaySendMoney"
          label="工作门店">
          <template slot-scope="scope">
            {{scope.row.todaySendMoney/100 | moneyStr}}
          </template>
        </el-table-column>
        <el-table-column
          prop="guideSendMoney"
          label="被领红包个数">
          <template slot-scope="scope">
            {{scope.row.guideSendMoney/100 | moneyStr}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fissionSendMoney"
          label="被领红包金额（元）">
          <template slot-scope="scope">
            {{scope.row.fissionSendMoney/100 | moneyStr}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="_data._pagination.enable"
                    class="template-table__pagination"
                    :page-sizes="_data._pagination.sizeOpts"
                    :total="_data._pagination.total"
                    :current-page="_data._pagination.page"
                    :page-size="_data._pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="$sizeChange$"
                    @current-change="$pageChange$">
      </el-pagination>
    </template>
  </page-table>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      model: this.data
    }
  },
  components: { PageTable },
  props: ['url', 'data'],
  mixins: [tableMixin],
  watch: {
    data (newVal) {
      this.model = newVal
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
</style>
