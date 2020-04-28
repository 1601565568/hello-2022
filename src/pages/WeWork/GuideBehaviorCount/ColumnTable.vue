<template class="template-page">
  <div class="template-page__row">
    <!-- 左边 渲染开始 -->
    <div class="template-page__row-left">
      <el-input ref="quickText" v-model="shopTreePage.shopName" placeholder="输入线下门店名称/导购姓名" clearable
                @keyup.enter.native="initShopList(1)">
        <Icon type="search" className="el-input__icon" style="padding: 5px;" slot="suffix" name="name" @click="initShopList(1)"/>
      </el-input>
      <el-scrollbar ref='shopTreeDiv' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px" >
        <el-tree class="filter-tree" ref="guideTree" :data="shopFindList" highlight-current
                 node-key="id" :default-expand-all="false" :expand-on-click-node="false" :default-checked-keys="[0]"
                 :filter-node-method="onFilterNode" @node-click="onClickNode">
          <div class="subdivision-tree-node" slot-scope="{ node }" >
            <span>{{node.label}}</span>
            <span v-if="node.label === '全部'">
            </span>
            <!-- 后端返回的是组件，不建议增加status字段 -->
            <!-- <span class="text-error">{{node.status === 2 ? '(员工已离职)':''}}</span> -->
          </div>
        </el-tree>
      </el-scrollbar>
      <el-pagination style='text-align: center' small
                     :total="shopTreePage.total"
                     :page-size="shopTreePage.size"
                     layout="prev, slot, next, jumper"
                     :current-page.sync="shopTreePage.page"
                     @current-change="initShopList">
        <span>{{shopTreePage.page + '/' + (Math.ceil(shopTreePage.total/ shopTreePage.size) || 1)}}</span>
      </el-pagination>
    </div>
    <!-- 左边 渲染结束 -->
    <!-- 右边 渲染开始 -->
    <div class="template-page__row-right">
      <el-scrollbar ref='pageRight' wrapStyle="overflow-x:hidden;" style="padding-bottom: 10px">
        <!-- 图表开始 -->
        <div class="echart-main">
            <div class="echart-main__title">
              <span>客户聊天分析</span>
              <el-radio-group v-model="analysisDays" @change="onClickEchatsTime" class="float-right">
                <el-radio-button label=1>昨天</el-radio-button>
                <el-radio-button label=2>7天</el-radio-button>
                <el-radio-button label=3>近30天</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <el-row class="echart-main__data" :gutter="5">
                <el-col :span="6">
                  <div v-if="echartsType === 1" class="echart-main__data--item active">
                    <p class="num">{{echatData.chatCnt}}</p>
                    <h4 class="title">聊天总数</h4>
                  </div>
                  <div v-else @click="initTotalFriendData(1)" class="echart-main__data--item">
                      <p class="num">{{echatData.chatCnt}}</p>
                      <h4 class="title">聊天总数</h4>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div v-if="echartsType === 2" class="echart-main__data--item active">
                    <p class="num">{{echatData.messageCnt}}</p>
                    <h4 class="title">发送消息数</h4>
                  </div>
                  <div v-else @click="initTotalFriendData(2)" class="echart-main__data--item">
                      <p class="num">{{echatData.messageCnt}}</p>
                      <h4 class="title">发送消息数</h4>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div v-if="echartsType === 3" class="echart-main__data--item active">
                    <p class="num" v-if="echatData.replyPercentage === null">-</p>
                    <p class="num" v-else>{{echatData.replyPercentage}}<span>%</span></p>
                    <h4 class="title">已回复聊天占比</h4>
                  </div>
                  <div v-else @click="initTotalFriendData(3)" class="echart-main__data--item">
                    <p class="num" v-if="echatData.replyPercentage === null">-</p>
                    <p class="num" v-else>{{echatData.replyPercentage}}<span>%</span></p>
                    <h4 class="title">已回复聊天占比</h4>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div v-if="echartsType === 4" class="echart-main__data--item active">
                    <p class="num" v-if="echatData.avgReplyTime === null">-</p>
                    <p class="num" v-else>{{echatData.avgReplyTime}}<span>分钟</span></p>
                    <h4 class="title">平均首次回复时长</h4>
                  </div>
                  <div v-else @click="initTotalFriendData(4)" class="echart-main__data--item">
                    <p class="num" v-if="echatData.avgReplyTime === null">-</p>
                    <p class="num" v-else>{{echatData.avgReplyTime}}<span>分钟</span></p>
                    <h4 class="title">平均首次回复时长</h4>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-loading.lock="loadingTotalFriendData" class="echart-main__content"
                 :element-loading-text="$t('prompt.loading')">
              <!-- 暂无数据结构 -->
              <div class="no-data" v-if="!totalFriendData.series">
              </div>
              <template v-if="totalFriendData.series">
                <div class="dataCenter-echart__container">
                  <business-echarts :options="totalFriendData" class="oscillogram" auto-resize></business-echarts>
                </div>
              </template>
            </div>
          </div>
        <!-- 图表结束 -->
        <!-- 列表开始 -->
        <ns-page-table :colButton="0">
          <!-- 简单搜索 -->
          <template slot="searchSearch">
            <el-form :model="model" :inline="true" class="pull-right">
              <el-form-item>
                <el-radio-group v-model="model.date" class="float-right">
                  <el-radio-button label="1">昨天</el-radio-button>
                  <el-radio-button label="2">近7天</el-radio-button>
                  <el-radio-button label="4">自定义</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="自定义：" label-width="80px">
                <el-date-picker
                  class="float-left"
                  :disabled="model.date !== '4'"
                  v-model="model.dateRange"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :unlink-panels = true
                  :default-time="['00:00:00', '00:00:00']">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <ns-button type="primary" @click="$searchAction$">{{$t('operating.search')}}</ns-button>
                <ns-button @click="$resetInputAction$">{{$t('operating.reset')}}</ns-button>
              </el-form-item>
            </el-form>
          </template>
          <!-- 简单搜索-结束 -->

          <!-- 表格 -->
          <template slot="table">
            <el-table ref="table" :data="_data._table.data" class="template-table__main"
                      stripe
                      resizable v-loading.lock="_data._table.loadingtable"
                      :element-loading-text="$t('prompt.loading')" @sort-change="$orderChange$">
              <el-table-column :show-overflow-tooltip="true" prop="name"
                               label="导购姓名" :sortable="false">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="friendCnt" align="right"
                               label="好友总数">
                <template slot-scope="scope">
                  <NsButton type="text">{{formatInteger(scope.row.friendCnt)}}</NsButton>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="groupChatCnt" align="right"
                               label="群总数" :sortable="false">
                <template slot-scope="scope">
                  <NsButton type="text">{{formatInteger(scope.row.groupChatCnt)}}</NsButton>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="newContactCnt" align="right"
                               label="新增好友数" :sortable="false">
                <template slot-scope="scope">
                  <NsButton type="text">{{formatInteger(scope.row.newContactCnt)}}</NsButton>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="chatCnt" align="right"
                               :sortable="false">
                <template slot="header">
                  <!-- 提示内容请自行实现 -->
                  主动聊天总数 <Icon type="question-circle" />
                </template>
                <template slot-scope="scope">
                  {{formatInteger(scope.row.chatCnt)}}
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="messageCnt" align="right"
                               label="发送信息总数" :sortable="false">
                <template slot="header">
                  <!-- 提示内容请自行实现 -->
                  发送信息总数 <Icon type="question-circle" />
                </template>
                <template slot-scope="scope">
                  <NsButton type="text">{{formatInteger(scope.row.messageCnt)}}</NsButton>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="appletCnt" align="right"
                               label="分享小程序" :sortable="false">
                <template slot-scope="scope">
                  <NsButton type="text">{{formatInteger(scope.row.appletCnt)}}</NsButton>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="replyPercentage" align="right"
                               label="已回复聊天占比" :sortable="false">
                <template slot-scope="scope">
                  {{formatInteger(scope.row.replyPercentage)}}
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="avgReplyTime" align="right"
                               width="170"
                               label="平均首次回复时长(min)" :sortable="false">
                <template slot-scope="scope">
                  {{formatInteger(scope.row.avgReplyTime)}}
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="negativeFeedbackCnt" align="right"
                               label="删除客户数" :sortable="false">
                <template slot-scope="scope">
                  <NsButton type="text">{{formatInteger(scope.row.negativeFeedbackCnt)}}</NsButton>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="negativeFeedbackCnt" align="right"
                               label="拉黑客户数" :sortable="false">
                <template slot-scope="scope">
                  <NsButton type="text">{{formatInteger(scope.row.negativeFeedbackCnt)}}</NsButton>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!-- 表格-结束 -->

          <!-- 分页 -->
          <template slot="pagination">
            <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                           :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                           :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                           layout="total, sizes, prev, pager, next, jumper" @size-change="$sizeChange$"
                           @current-change="$pageChange$">
            </el-pagination>
          </template>
          <!-- 分页-结束 -->
        </ns-page-table>
        <!-- 列表结束 -->
      </el-scrollbar>
    </div>
    <!-- 右边 渲染结束 -->
  </div>
</template>

<script>
import ColumnTable from './src/ColumnTable'

export default ColumnTable
</script>

<style scoped>
  @import "@theme/variables.pcss";

  @component-namespace echart {
    @b main {
      .echart-main__title, .echart-main__content {
        margin-bottom: var(--default-margin-base);
        background-color:  var(--theme-color-white);
        border-radius: var(--default-radius-mini);
        box-shadow: var(--default-box-shadow-base);
      }
      @e data {
        @m item {
          cursor: pointer;
          text-align: center;
          padding: 20px 0;
          margin-bottom: var(--default-margin-base);
          border: 1px solid #D1DFF5;
          background-color:  #F7FBFF;
          border-radius: var(--default-radius-mini);
          box-shadow: var(--default-box-shadow-base);
          .num {
            color: var(--theme-font-color-primary);
            font-size: var(--dafault-font-size-xlarge);
            height: 20px;
            span {
              font-size: var(--default-font-size-middle);
            }
          }
          .title {
            margin-top: var(--default-margin-larger);
            color: var(--theme-font-color-regular);
            font-size: var(--default-font-size-base);
            font-weight: normal;
          }
          &.active {
            border-color: #0094FC;
            background-color: #E5F4FE;
            .num {
              color: #0094FC;
            }
            .title {
              color: #0094FC;
            }
          }
        }
      }
      @e title {
        line-height: 28px;
        padding: var(--default-padding-base) var(--default-padding-base) var(--default-padding-base) 0;
        > span {
          position: relative;
          display: inline-block;
          line-height: 1;
          padding: 0 0 0 var(--default-padding-larger);

          &:before {
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 4px;
            background-color: var(--theme-color-primary);
          }
        }
      }
    }
  }
</style>
