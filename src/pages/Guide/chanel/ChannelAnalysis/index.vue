<template>
  <div class="channel-analysis-container">
    <content-panel title="渠道添加好友占比" class="channel-friends-rate">
      <template v-slot:toolbar>
        <div>
          <el-tooltip content="超出9个指标，建议全屏观看" effect="light" placement="top">
            <ns-button class="ns-button fullscreen-button" @click="showChannelFriendRateDialog">
              <Icon type="info-circle" theme="filled"/>
            </ns-button>
          </el-tooltip>
          <ns-button class="ns-button" @click="customIndicator">自定义指标</ns-button>
          <!-- 自定义指标Dialog -->
          <CustomIndicatorDialog
            :visible="customIndicatorDialogVisible"
            @close="customIndicatorDialogVisible = false"
          />
          <!-- 全屏查看渠道好友占比Dialog -->
          <ChannelFriendRateDialog
            :visible="channelFriendRateDialogVisible"
            :chartHeight="chartHeight"
            @close="channelFriendRateDialogVisible = false"

          />
        </div>
      </template>
      <!-- echart图 -->
      <ChannelChart class="channel-friend-rate-chart"/>
    </content-panel>
    <content-panel title="渠道统计" class="channel-statistics">
      <template v-slot:toolbar>
        <div class="channel-statisitcs-toobar">
          <el-input placeholder="请输入渠道名称" v-model="filterText">
            <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px"></Icon>
          </el-input>
          <ns-button class="ns-button">导出CSV文件</ns-button>
        </div>
      </template>
      <div class="new-table channel-table">
        <el-table
          style="width: 100%;"
          size="medium"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="tableData"
        >
          <el-table-column prop="name" label="渠道名称"></el-table-column>
          <el-table-column prop="totalAddCount" label="总添加人数" sortable></el-table-column>
          <el-table-column prop="addCount" label="添加人数" sortable></el-table-column>
          <el-table-column prop="delCount" label="删除人数" width="316" sortable>
          </el-table-column>
          <el-table-column prop="deletedCount" label="被删除人数" sortable>
          </el-table-column>
          <el-table-column prop="count" label="操作">
            <template>
              <ns-button type="text" @click="test">查看明细</ns-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="template-table__pagination"
        :page-sizes="[15, 25, 50, 100]"
        :total="100"
        :current-page="1"
        :page-size="20"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$sizeChange$"
        @current-change="$pageChange$">
      </el-pagination>
    </content-panel>
  </div>
</template>

<script>
import tableMixin from '@nascent/ecrp-ecrm/src/mixins/table'
import ContentPanel from '../components/ContentPanel'
import ChannelChart from './ChannelChart'
import CustomIndicatorDialog from './CustomIndicatorDialog'
import ChannelFriendRateDialog from './ChannelFriendRateDialog'

export default {
  components: {
    ContentPanel,
    ChannelChart,
    CustomIndicatorDialog,
    ChannelFriendRateDialog
  },
  mixins: [tableMixin],
  data () {
    return {
      chartHeight: 200,
      customIndicatorDialogVisible: false, // 自定义指标dialog
      channelFriendRateDialogVisible: false, // 渠道好友占比
      filterText: '',
      tableData: [
        {
          name: '渠道名字',
          totalAddCount: 100,
          addCount: 88,
          delCount: 55,
          deletedCount: 23
        },
        {
          name: '渠道名字',
          totalAddCount: 99,
          addCount: 89,
          delCount: 25,
          deletedCount: 21
        }
      ]
    }
  },
  methods: {
    test () {
      this.$router.push('/Guide/chanel/ChannelDetail/0')
    },
    customIndicator () {
      this.customIndicatorDialogVisible = true
    },
    showChannelFriendRateDialog () {
      this.chartHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.channelFriendRateDialogVisible = true
    }
  }
}
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
    .channel-friend-rate-chart {
      height: calc(415px - 56px);
    }
  }

  .channel-statistics {
    height: 387px;
    .channel-table {
      margin: 0 auto;
      width: calc(100% - 32px);
    }
  }
}
</style>
