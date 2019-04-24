<template>
  <div class="template-page">
    <el-tabs v-model="affairsActive" @tab-click="tabClick">
      <el-tab-pane label="我创建的事务 " name="establish"></el-tab-pane>
      <el-tab-pane label="指派给我的事务" name="appoint"></el-tab-pane>
      <el-tab-pane label="指派出去的事务" name="designate"></el-tab-pane>
      <el-tab-pane label="全部事务" name="all"></el-tab-pane>
    </el-tabs>
    <ns-table-affairs ref="table" @view-chat="openChat" @edit-affair="openEdit" @handle-affair="openHandle" @order-list="openOrderList"></ns-table-affairs>

    <!-- 聊天记录弹窗 -->
    <el-dialog
      title="聊天记录"
      :visible.sync="dialogChat"
      height="500px"
      :show-scroll-x="false"
      width="1070px">
      <!-- 弹窗内容 -->
      <el-tabs v-model="dialogChatActive">
        <el-tab-pane label="近3个月记录 " name="nearly"></el-tab-pane>
        <el-tab-pane label="3个月前记录" name="ago"></el-tab-pane>
      </el-tabs>
      <el-form label-width="60px" :inline="true" class="padding-base text-right">
        <el-form-item
          label="关键字：">
          <el-form-grid size="sm">
            <el-input placeholder='关键字' v-model="keyWord" clearable></el-input>
          </el-form-grid>
        </el-form-item>
        <el-form-item
          label="聊天时间：">
          <el-form-grid>
            <ns-datetime startPlaceholder="" endPlaceholder="" v-model="chatTime"></ns-datetime>
          </el-form-grid>
        </el-form-item>
        <el-form-item
          label="客服旺旺：">
          <el-form-grid size="sm">
            <ns-select filterable clearable placeholder="" v-model="service"
                        :multiple="false"  :url="$api.core.common.queryPlatForm">
            </ns-select>
          </el-form-grid>
        </el-form-item>
        <el-form-item label-width="0px">
          <ns-button type="primary" >{{$t('operating.search')}}</ns-button>
          <ns-button >{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
      <!-- 聊天记录列表 -->
      <!-- 暂无数据结构 -->
      <!--<ns-no-data size="sm">{{$t('prompt.noData')}}</ns-no-data>-->
      <!-- 暂无数据结构-结束 -->

      <el-collapse accordion class="chat-record">
        <el-collapse-item v-for="list in chatRecord" :key="list.date">
          <template slot="title">
            日期：{{list.date}}
            <a target="_blank" :href="list.link" class="float-right">查看聊天详情</a>
          </template>
          <ul class="record-list">
            <li class="record-list__item" v-for="item in list.recordList" :key="item.date">
              <h5 class="text-success">{{item.serviceName}} <span class="text-secondary">({{item.serviceTime}})</span></h5>
              <p>{{item.serviceContent}}</p>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
      <!-- 聊天记录列表-结束 -->
      <!-- 弹窗内容-结束 -->

      <span slot="footer" class="dialog-footer">
        <ns-button @click="dialogChat = false">关闭</ns-button>
      </span>
    </el-dialog>
    <!-- 聊天记录弹窗-结束 -->

    <!-- 客户所有订单弹窗 -->
    <el-dialog title="客户所有订单" :visible.sync="dialogOrder" width="1000px"
               :close-on-click-modal = "false">
      <ns-affaris-order ref="sysCustomerIdTrade"></ns-affaris-order>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogOrder = false">关闭</ns-button>
      </div>
    </el-dialog>
    <!-- 客户所有订单弹窗-结束 -->

    <!-- 处理事务弹窗 -->
    <el-dialog title="处理事务" :visible.sync="dialogHandle" width="950px"
               :show-scroll-x="false"
               :close-on-click-modal = "false">
      <el-form label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="期望时间：">
              2018-08-08 17:17
              <i class="text-icon low">低</i>
              <i class="text-icon medium">中</i>
              <i class="text-icon high">高</i>
            </el-form-item>
            <el-form-item
              label="发起人：">
              admin
            </el-form-item>
            <el-form-item
              label="事务类型：">
              <el-form-grid size="xmd">
                <ns-select filterable clearable placeholder="" v-model="service"
                           :multiple="false"  :url="$api.core.common.queryPlatForm">
                </ns-select>
              </el-form-grid>
            </el-form-item>
            <el-form-item
              label="处理信息：">
              <el-input type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item
              label="指派处理人：">
              <el-form-grid size="sm">
                <ns-select filterable clearable placeholder="" v-model="service"
                           :multiple="false"  :url="$api.core.common.queryPlatForm">
                </ns-select>
              </el-form-grid>
              <el-form-grid size="sm">
                <ns-select filterable clearable placeholder="" v-model="service"
                           :multiple="false"  :url="$api.core.common.queryPlatForm">
                </ns-select>
              </el-form-grid>
              <el-form-grid>
                <ns-button type="text">分配给我</ns-button>
              </el-form-grid>
            </el-form-item>
            <el-form-item
              label="上传图片：">
              <el-form-grid size="xmd">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/">
                  <ns-button type="primary">选择图片</ns-button>
                </el-upload>
              </el-form-grid>
            </el-form-item>
            <el-form-item
              label="预计费用：">
              0.00
            </el-form-item>
            <el-form-item
              label="消耗费用：">
              <el-form-grid size="xxs">
                <el-input class="text-right"></el-input>
              </el-form-grid>
              <el-form-grid size="xxs">
                元
              </el-form-grid>
              <el-form-grid>
                <el-popover
                  title="消耗费用明细"
                  width="300"
                  trigger="hover">
                  <el-form label-width="80px" class="text-form-unique" :inline="true">

                  </el-form>
                  <!-- 处理事务按钮及处理信息 -->
                  <span slot="reference">消耗费用总额：0.00 元</span>
                </el-popover>
              </el-form-grid>
            </el-form-item>
            <el-form-item
              label="事务状态：">
              <el-checkbox>已解决
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="买家昵称：">
              tianlhj
              <ns-button type="primary">编辑信息</ns-button>
            </el-form-item>
            <el-form-item
              label="订单编号：">
              <el-form-grid size="xmd">
                <el-input></el-input>
              </el-form-grid>
            </el-form-item>
            <el-form-item
              label="事务备注：">
              电话关怀
            </el-form-item>
            <el-form-item
              label="处理记录：">
              <el-scrollbar ref="recordHeight" outsider class="record-scroll">
                <div class="record-item">
                  <p>处理信息：</p>
                  <p>222</p>
                  <p class="text-secondary">
                    <span>客服：admin</span>
                    <span>时间：2018-08-06 20:25</span>
                  </p>
                </div>
                <div class="record-item">
                  <p>处理信息：</p>
                  <p>指派给巧姐</p>
                  <p class="text-secondary">
                    <span>客服：admin</span>
                    <span>时间：2018-08-07 11:45</span>
                  </p>
                </div>
                <div class="record-item">
                  <p>处理信息：</p>
                  <p>巧姐解决了</p>
                  <p class="text-secondary">
                    <span>客服：巧姐</span>
                    <span>时间：2018-08-07 11:46</span>
                  </p>
                </div>
              </el-scrollbar>
            </el-form-item>
            <el-form-item
              label="历史事务：">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="创建时间"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="事务类型"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="remarks"
                  label="事务备注">
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogHandle = false">取 消</ns-button>
        <ns-save @click="dialogHandle = false" ></ns-save>
      </div>
    </el-dialog>
    <!-- 处理事务弹窗-结束 -->

    <!-- 修改事务弹窗 -->
    <el-dialog title="修改事务" :visible.sync="dialogEdit" width="600px"
               :close-on-click-modal = "false">
      <div>修改事务弹窗</div>
      <div slot="footer" class="dialog-footer">
        <ns-button @click="dialogEdit = false">取 消</ns-button>
        <ns-save @click="dialogEdit = false" ></ns-save>
      </div>
    </el-dialog>
    <!-- 修改事务弹窗-结束 -->
  </div>
</template>

<script>
import index from './src/index'
import NsTableAffairs from './NsTableAffairs'
import NsAffarisOrder from './NsAffarisOrder'
import NsDatetime from 'components/NsDatetime'
index.components = {
  NsTableAffairs,
  NsAffarisOrder,
  NsDatetime
}
export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .chat-record {
    >>> .el-collapse-item {
      .el-collapse-item__header {
        .float-right {
          color: var(--theme-base-link-color-primary);
          margin-right: var(--default-margin-larger);
        }
      }
      .el-collapse-item__content {
        font-size: var(--default-font-size-small);
      }
      .record-list {
        padding: 0;
        .record-list__item {
          padding: var(--default-padding-base);
          list-style: none;
          border: 1px solid var(--theme-base-border-color-primary);
          box-shadow: var(--default-box-shadow-base);
          border-radius: var(--default-radius-mini);
          &:not(:last-child) {
            margin-bottom: var(--default-margin-base);
          }
        }
      }
    }
  }
  .text-icon {
    display: inline-block;
    height: 23px;
    width: 23px;
    line-height: 23px;
    text-align: center;
    vertical-align: middle;
    font-style: normal;
    border-radius: var(--default-radius-mini);
    color: var(--theme-color-white);
    &.low {
      background-color: var(--theme-font-color-regular)!important;
    }
    &.medium {
      background-color: var(--theme-color-primary)!important;
    }
    &.high {
      background-color: var(--theme-color-danger)!important;
    }
  }
  /* 处理记录 */
  .record-scroll {
    .record-item {
      border-bottom: 1px solid var(--theme-base-border-color-primary);
      .text-secondary {
        span + span {
          margin-left: var(--default-margin-larger);
        }
      }
    }
  }
</style>
