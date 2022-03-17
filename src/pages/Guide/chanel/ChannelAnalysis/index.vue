<template>
  <div class="channel-analysis-container">
    <content-panel v-loading="loadingChannelFriendRate" title="渠道添加好友占比" class="channel-friends-rate">
      <template v-slot:toolbar v-if="channelList.length">
        <div>
          <el-tooltip content="指标过多时，建议全屏观看" effect="light" placement="top">
            <ns-button class="ns-button fullscreen-button" @click="showChannelFriendRateDialog">
              <Icon type="quanping" style="font-size: 16px"/>
            </ns-button>
          </el-tooltip>
          <ns-button class="ns-button" @click="customChannelCodes">自定义指标</ns-button>
          <!-- 自定义指标Dialog -->
          <CustomChannelDialog
            :visible="channelCodesDialogVisible"
            @close="channelCodesDialogVisible = false"
            @confirm="chooseChannelCodes"
            :channelList="channelList"
            :selectedChannels="selectedChannelCodes"
          />
          <!-- 全屏查看渠道好友占比Dialog -->
          <ChannelFriendRateDialog
            :visible="channelFriendRateDialogVisible"
            :chartHeight="chartHeight"
            @close="channelFriendRateDialogVisible = false"
            :channelCodes="selectedChannelCodes"
            :searchDate="searchDate"
          />
        </div>
      </template>
      <!-- echart图 -->
      <ChannelChart
        v-if="channelList.length"
        ref="channelChart"
        class="channel-friend-rate-chart"
        :channelCodes="selectedChannelCodes"
        :searchDate="searchDate"
        @loading="loadingChannelFriendRate = !loadingChannelFriendRate"
      />
      <div class="no-data-content" v-else>
        <img src="@/assets/no-data.png" alt="暂无数据">
      </div>
    </content-panel>
    <content-panel title="渠道统计" class="channel-statistics">
      <template v-slot:toolbar>
        <div class="channel-statisitcs-toobar">
          <el-input placeholder="请输入渠道名称" v-model="model.channelName" @keyup.enter.native="searchform">
            <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px" @click="searchform"></Icon>
          </el-input>
          <ns-button class="ns-button" @click="exportFile">导出文件</ns-button>
        </div>
      </template>
      <div class="new-table channel-table">
        <el-table
          style="width: 100%;"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="_data._table.data"
          v-loading="_data._table.loadingtable"
          @sort-change="$orderChange$"
        >
          <el-table-column prop="channelName" label="渠道名称"></el-table-column>
          <el-table-column prop="addTotalCount" label="总添加人数" sortable="addTotalCount">
            <template slot="header">
              总添加人数
              <el-tooltip class="help" :content="`统计通过此渠道添加的好友总数（会进行以下场景排重仅计算为1：添加后删除又添加，同一个消费者在一个渠道添加多个${cloudPlatformType === 'ecrp' ? '员工' : '成员'}）`">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="addCount" label="添加人数" sortable="addCount">
            <template slot="header">
              添加人数
              <el-tooltip class="help" :content="`筛选时间内，统计通过此渠道添加的好友总数（会进行以下场景排重仅计算为1：添加后删除又添加，同一个消费者在一个渠道添加多个${cloudPlatformType === 'ecrp' ? '员工' : '成员'}）`">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="deleteCount" label="删除人数" sortable="deleteCount">
            <template slot="header">
              删除人数
              <el-tooltip class="help" :content="`筛选时间内，${cloudPlatformType === 'ecrp' ? '员工' : '成员'}主动删除此渠道的好友数（会进行以下场景排重仅计算为1：发生多次删除）`">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="beDeletedCount" label="被删除人数" sortable="beDeletedCount">
            <template slot="header">
              被删除人数
              <el-tooltip class="help" :content="`筛选时间内，此渠道添加的好友主动删除${cloudPlatformType === 'ecrp' ? '导购' : '成员'}的好友数（会进行以下场景排重仅计算为1：发生多次删除）`">
                <Icon type="ns-help"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="操作" width="105">
            <template slot-scope="scope">
              <ns-button type="text" @click="checkDetail(scope.row)">查看明细</ns-button>
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
    </content-panel>
  </div>
</template>

<script>
import ChannelAnalysis from './src/index.js'
import ContentPanel from '../components/ContentPanel'
import ChannelChart from './ChannelChart'
import CustomChannelDialog from './CustomChannelDialog'
import ChannelFriendRateDialog from './ChannelFriendRateDialog'

ChannelAnalysis.components = {
  ContentPanel,
  ChannelChart,
  CustomChannelDialog,
  ChannelFriendRateDialog
}

export default ChannelAnalysis
</script>

<style lang="scss" scoped>
@import "./styles/reset.css";

.channel-analysis-container {
  .ns-button {
    font-size: 14px;
    height: 32px;
    margin: 0 16px;
  }

  .channel-friends-rate {
    height: 415px;
    .fullscreen-button {
      margin-right: 0;
      margin-top: -1px;
      width: 32px;
      padding: 7px 0;
    }

    .channel-friend-rate-chart {
      height: calc(415px - 56px);
    }

    .no-data-content {
      margin: 50px auto;
      width: 320px;
      height: 220px;
    }
  }

  .channel-statistics {
    height: 100%;
    .channel-table {
      margin: 0 auto;
      width: calc(100% - 32px);
    }
  }
}
</style>
