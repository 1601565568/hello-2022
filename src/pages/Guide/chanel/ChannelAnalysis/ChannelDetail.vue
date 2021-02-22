<template>
  <div class="channel-detail">
    <div class="channel-nav">
      <!-- <Icon class="back" type="fanhuishangyiji"  @click="$router.go(-1)"/> -->
      <Icon class="back" type="return" @click="$router.go(-1)" />
      <h3>渠道明细</h3>
    </div>
    <ContentPanel class="channel-content">
      <template v-slot:toolbar>
        <DatePickerBar
          @change="changeSearchDate"
          @initDate="setSearchDate"
          :defaultPickDay="7"
        />
        <ns-button class="export-button" @click="exportFile">导出CSV文件</ns-button>
      </template>
      <div class="new-table channel-detail-table">
        <el-table
          style="width: 100%;"
          size="medium"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="_data._table.data"
          v-loading="_data._table.loadingtable"
          @sort-change="$orderChange$"
        >
          <el-table-column prop="date" label="日期" sortable="date"></el-table-column>
          <el-table-column prop="addCount" label="添加人数" sortable="addCount"></el-table-column>
          <el-table-column prop="deleteCount" label="删除人数" width="316" sortable="deleteCount">
          </el-table-column>
          <el-table-column prop="beDeletedCount" label="被删除人数" sortable="beDeletedCount">
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="_data._pagination.enable"
        class="template-table__pagination"
        :page-sizes="_data._pagination.sizeOpts"
        :total="_data._pagination.total"
        :current-page="_data._pagination.page"
        :page-size="_data._pagination.size"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$pageChange$">
      </el-pagination>
    </ContentPanel>
  </div>
</template>

<script>
import ChannelDetail from './src/ChannelDetail'
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ContentPanel from '../components/ContentPanel'
import moment from 'moment'
import DatePickerBar from '@/components/NewUi/DatePickerBar'

ChannelDetail.components = {
  ContentPanel,
  DatePickerBar
}

export default ChannelDetail
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";
@import "../styles/reset.css";

.channel-detail {
  width: 100%;
  .channel-nav {
    background: #fff;
    height: 48px;
    line-height: 48px;
    margin: -10px -10px 0;
    .back {
      display: inline-block;
      margin-left: 16px;
      color: #0094fc;
      font-size: 16px;
      cursor: pointer;
    }
    h3 {
      display: inline-block;
      font-size: 16px;
      margin-left: 16px;
    }
  }

  .channel-content {
    .export-button {
      font-size: 14px;
      height: 32px;
      margin-right: 16px;
    }

    .channel-detail-table {
      margin: 12px auto 0;
      width: calc(100% - 32px);
    }
  }
}
</style>
