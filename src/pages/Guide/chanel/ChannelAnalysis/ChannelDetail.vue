<template>
  <div class="channel-detail">
    <div class="channel-nav">
      <Icon class="back" type="fanhuishangyiji"  @click="$router.go(-1)"/>
      <!-- <Icon class="back" type="return" @click="$router.go(-1)" /> -->
      <h3>渠道明细</h3>
    </div>
    <ContentPanel class="channel-content">
      <template v-slot:toolbar>
        <DatePickerBar
          @change="changeSearchDate"
          @initDate="setSearchDate"
          :defaultPickDay="7"
        />
        <ns-button class="export-button" @click="exportFile" id="exportButton">导出CSV文件</ns-button>
      </template>
      <div class="new-table channel-detail-table">
        <el-table
          style="width: 100%;"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="_data._table.data"
          v-loading="_data._table.loadingtable"
          @sort-change="$orderChange$"
        >
          <el-table-column prop="date" label="日期" sortable="date"></el-table-column>
          <el-table-column prop="addCount" label="添加人数" sortable="addCount">
            <template slot="header">
              添加人数
              <el-tooltip class="help" :content="`统计当前日期，通过所有渠道添加的好友总数（会进行以下场景排重仅计算为1：添加后删除又添加，同一个消费者一天添加多个${cloudPlatformType === 'ecrp' ? '员工' : '成员'}）`">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="deleteCount" label="删除人数" width="316" sortable="deleteCount">
            <template slot="header">
              删除人数
              <el-tooltip class="help" :content="`统计当前日期，${cloudPlatformType === 'ecrp' ? '员工' : '成员'}主动删除的所有渠道的好友数（会进行以下场景排重仅计算为1：一天发生多次删除，多个${cloudPlatformType === 'ecrp' ? '员工' : '成员'}删除同一个好友）`">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="beDeletedCount" label="被删除人数" sortable="beDeletedCount" width="185">
            <template slot="header">
              被删除人数
              <el-tooltip class="help" :content="`筛选时间内，所有渠道添加的好友主动删除${cloudPlatformType === 'ecrp' ? '导购' : '成员'}的好友数（会进行以下场景排重仅计算为1：一天发生多次删除，一个好友删除多个${cloudPlatformType === 'ecrp' ? '员工' : '成员'}）`">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
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
      color:#909399;
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: #0094fc;
      }
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
