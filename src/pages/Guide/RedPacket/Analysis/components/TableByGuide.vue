<template>
  <page-table style="padding-top:0">
    <template slot="table">
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="员工">
        </el-table-column>
        <el-table-column
          prop="wokerNumber"
          label="工号">
          <template slot-scope="scope">
            {{scope.row.wokerNumber || '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="工作门店">
          <template slot-scope="scope">
            <div class="offline-shop-content" v-if='scope.row.shopName'>
              <span class="scope-store-text">
                {{scope.row.shopName}}
              </span>
              <el-popover
                v-if="scope.row.shopName.split('；').length"
                placement="top-start"
                class="item"
                :title="`工作门店（${scope.row.shopName.split('；').length}）`"
                trigger="hover"
                :content="scope.row.shopName">
                <span class="scope-name_tip" slot="reference">共{{scope.row.shopName.split('；').length}}个</span>
                <div style="max-width: 400px">
                  {{scope.row.shopName}}
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="receiverNum"
          label="被领红包个数">
        </el-table-column>
        <el-table-column
          prop="receiverMoney"
          align='right'
          label="被领红包金额（元）">
          <template slot-scope="scope">
            {{scope.row.receiverMoney/100 | moneyStr}}
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
.offline-shop-content {
  display: flex;
  .scope-store-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.scope-name_tip {
  color: #0091FA;
  display: block;
  min-width: 55px;
}
</style>
