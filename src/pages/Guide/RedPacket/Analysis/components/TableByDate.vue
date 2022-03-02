<template>
  <page-table style="padding-top:0">
    <template slot="table">
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        style="width: 100%">
        <el-table-column
          prop="dayTime"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="todaySendMoney"
          label="今日转出金额（元）">
          <template slot-scope="scope">
            {{scope.row.todaySendMoney/100 | moneyStr}}
          </template>
        </el-table-column>
        <el-table-column
          prop="guideSendMoney"
          :label="cloudPlatformType==='ecrp'?'员工':'成员'+'转出金额（元）'">
          <template slot-scope="scope">
            {{scope.row.guideSendMoney/100 | moneyStr}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fissionSendMoney"
          label="裂变大师转出金额（元）">
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
      model: this.data,
      cloudPlatformType: this.$store.state.user.remumber.remumber_login_info.productConfig.cloudPlatformType // 平台判断
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
