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
          <el-input placeholder="请输入渠道名称" v-model="model.channelName" @keyup.enter.native="searchform">
            <Icon type="ns-search-copy" slot="suffix" style="font-size: 24px; margin-top: 2px" @click="searchform"></Icon>
          </el-input>
          <ns-button class="ns-button" @click="exportFile">导出CSV文件</ns-button>
        </div>
      </template>
      <div class="new-table channel-table">
        <el-table
          style="width: 100%;"
          size="medium"
          class="table-form_reset"
          row-class-name="employee-table_row"
          header-cell-class-name="employee-talbe-header-cell"
          :data="_data._table.data"
          @sort-change="$orderChange$"
        >
          <el-table-column prop="channelName" label="渠道名称"></el-table-column>
          <el-table-column prop="addTotalCount" label="总添加人数" sortable="addTotalCount"></el-table-column>
          <el-table-column prop="addCount" label="添加人数" sortable="addCount"></el-table-column>
          <el-table-column prop="deleteCount" label="删除人数" sortable="deleteCount">
          </el-table-column>
          <el-table-column prop="beDeletedCount" label="被删除人数" sortable="beDeletedCount">
          </el-table-column>
          <el-table-column prop="count" label="操作">
            <template>
              <ns-button type="text" @click="test">查看明细</ns-button>
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
  mixins: [ tableMixin ],
  props: [ 'searchDate' ],
  watch: {
    async searchDate (times) {
      if (times !== null) {
        this.model.startTime = times[0]
        this.model.endTime = times[1]
      } else {
        this.model.startTime = ''
        this.model.endTime = ''
      }

      this.searchform()
    }
  },
  data () {
    return {
      chartHeight: 200,
      customIndicatorDialogVisible: false, // 自定义指标dialog
      channelFriendRateDialogVisible: false, // 渠道好友占比
      url: this.$api.guide.channel.findChannelAnalysisList,
      model: {
        channelName: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted () {
    this.searchform()
    window.console.log('渠道统计列表', this._data)
  },
  methods: {
    searchform () {
      this.$searchAction$()
    },
    test () {
      this.$router.push('/Guide/chanel/ChannelDetail/0')
    },
    customIndicator () {
      this.customIndicatorDialogVisible = true
    },
    showChannelFriendRateDialog () {
      this.chartHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.channelFriendRateDialogVisible = true
    },
    checkTableDataExists () {
      if (!this._data || !this._data._table || !this._data._table.data || this._data._table.data.length < 1) {
        this.$notify.error('当前没有匹配的数据项')
        return true
      }
      return false
    },
    exportFile () {
      if (this.checkTableDataExists()) {
        return false
      }

      let param = this.$generateParams$()
      // param.searchMap.type = 2
      this.$notify.info('导出中，请稍后片刻')
      this.$http.fetch(this.$api.guide.channel.exportFileTest, param)
        .then((resp) => {
          this.$notify.success('下载完成')
        }).catch((resp) => {
          if (!resp.size === 0) {
            this.$notify.error('导出报错，请联系管理员')
          } else {
            let url = window.URL.createObjectURL(new Blob([resp]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            const fileName = `${this.$route.params.name || ''}-好友添加明细.CSV`
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
          }
        })
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
    height: 100%;
    .channel-table {
      margin: 0 auto;
      width: calc(100% - 32px);
    }
  }
}
</style>
