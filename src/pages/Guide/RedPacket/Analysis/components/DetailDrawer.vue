<template>
  <div class="master-drawer">
    <div class='drawer-content'>
      <div class='master-close'>
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <div class='header-title'>
        <h4 class='header-title_text'>领取详情</h4>
      </div>
      <div class='analysis-content'>
        <page-table :searchCol='24'>
          <template slot='table'>
            <template>
              <el-table
                :data="_data._table.data"
                class="new-table_border"
                v-loading.lock="_data._table.loadingtable"
                style="width: 100%">
                <el-table-column
                  prop="nickname"
                  label="领取人">
                  <template slot-scope="scope">
                    {{scope.row.nickname || '-'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="payTime"
                  label="领取时间">
                </el-table-column>
                <el-table-column
                  prop="money"
                  label="领取金额（元）">
                  <template slot-scope="scope">
                    {{scope.row.money/100 | moneyStr}}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </template>
        </page-table>
      </div>
    </div>
  </div>
</template>
<script>
import PageTable from '@/components/NewUi/PageTable'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
export default {
  data () {
    return {
      model: {
        id: this.id
      },
      url: this.$api.guide.redpacket.getRecordDetail,
      pagination: {
        enable: true,
        size: 500,
        sizeOpts: [15, 50, 100],
        page: 1,
        total: 0
      }
    }
  },
  components: { PageTable },
  mixins: [tableMixin],
  props: ['id'],
  methods: {
    // 关闭弹框
    handleClose () {
      this.$emit('onClose')
    }
  },
  mounted () {
    this.$reload()
  },
  watch: {
    id (newVal) {
      this.model.id = newVal
      this.$reload()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.master-drawer {
  height: 100vh;
  overflow-y: auto;
}
.drawer-content {
   position: relative;
  padding: 12px 16px;
  min-height: 100vh;
  padding-bottom: 50px;
}
.master-close {
  font-size: 16px;
  padding: 16px 16px 32px 16px;
  .el-icon-close {
    cursor: pointer;
  }
}
.header-title {
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 16px;
  color: #262626;
  line-height: 24px;
  .header-title_num {
    font-size: 16px;
    color: #595959;
    line-height: 24px;
    margin-left:16px;
  }
}
.scope-title {
  display: flex;
  align-items: center;
}
.search-icon {
  font-size: 22px;
  margin-top: 2px;
}
</style>
