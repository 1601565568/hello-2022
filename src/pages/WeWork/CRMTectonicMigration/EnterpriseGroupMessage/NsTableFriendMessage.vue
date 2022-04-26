<template>
  <div>
    <page-table :searchCol="24" :diyTitle="true">
      <template slot="title">
        <div class="head-router">
          <span>群营销</span>
        </div>
      </template>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top' @submit.native.prevent>
          <el-form-item label="">
            <el-input v-model.trim="model.name" placeholder="请输入活动名称" @keyup.enter.native="onSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="onSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="创建人：">
            <ns-select v-model="model.employeeId" :props="selectProps" @change="getEmployeeId" filterable clearable :url="$api.marketing.weworkMarketing.groupCreators"/>
          </el-form-item>
          <el-form-item label="活动状态：">
            <ns-select v-model="model.status" @change="getStatus" filterable clearable :data="statusData"/>
          </el-form-item>
          <el-form-item label="创建时间：" class='el-form__change'>
            <el-date-picker
              v-model="model.createTime"
              type="datetimerange"
              @change="getCreateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="执行时间：" class='el-form__change'>
            <el-date-picker
              v-model="model.execTime"
              type="datetimerange"
              @change="getExecTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00','23:59:59']"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot='button'>
        <ns-table-operate-button :buttons="_data._table.operate_buttons">
        </ns-table-operate-button>
        <!-- <ns-button type="primary" size='large' @click="handleDetail({})">新建</ns-button> -->
      </template>
      <template slot='table'>
        <el-table ref="table" :data="_data._table.data" class="new-table_border"
                  v-loading.lock="_data._table.loadingtable" :element-loading-text="$t('prompt.loading')"
                  @sort-change="$orderChange$" :row-style="tableRowClassName">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="活动名称">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建时间"
            sortable="create_time" :width="150">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="reviewTime"
            label="审核时间"
            sortable="review_time" :width="150">
            <template slot-scope="scope">
              <template v-if="scope.row.reviewTime">
                {{scope.row.reviewTime}}
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="sendTime"
            label="执行时间"
            sortable="send_time" :width="150">
            <template slot="header">
              <span>实际执行时间</span>
              <el-tooltip placement="top" effect="light" stype="">
                <Icon type="question-circle" theme="outlined" className="text-primary"/>
                <div slot="content">活动的实际执行时间。</div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.sendTime">
                {{scope.row.sendTime}}
              </template>
              <template v-else>-</template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="trade_tag_name"
            label="营销对象">
            <template slot-scope="scope">
              <template><span class="mem-detail" @click="lookReceiver(scope.row.id)">{{scope.row.chatRoomCount}}</span>个群聊</template>
              <!-- <template v-else><span class="mem-detail" @click="lookReceiver(1, scope.row.id)">{{scope.row.targetCount}}</span>个{{cloudPlatformType === 'ecrp' ? '员工' : '成员'}}全部好友</template> -->
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="employee.name"
            label="创建人">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="status"
            min-width="90px"
            label="活动状态">
            <template slot-scope="scope">
              <!-- 已执行 -->
              <template v-if="scope.row.status === 6">
                {{getStatusName(scope.row.status)}}（已执行{{scope.row.formatReceiverStatusCount.success}}个,失败{{scope.row.formatReceiverStatusCount.fail}}个）
              </template>
              <!-- 审核失败 -->
              <template v-else-if="scope.row.status === 3">
                {{getStatusName(scope.row.status)}}
                <el-tooltip placement="top" effect="light" stype="">
                  <Icon type="question-circle" theme="outlined" className="text-primary"/>
                  <div slot="content">{{scope.row.reviewRemark}}</div>
                </el-tooltip>
              </template>
              <!-- 已终止 -->
              <template v-else-if="scope.row.status === 7">
                {{getStatusName(scope.row.status)}}（已执行{{scope.row.formatReceiverStatusCount.success}}个,失败{{scope.row.formatReceiverStatusCount.fail}}个）
                <!-- <el-tooltip placement="top" effect="light" stype="">
                  <Icon type="question-circle" theme="outlined" className="text-primary"/>
                  <div slot="content">{{scope.row.remark}}</div>
                </el-tooltip> -->
              </template>
              <template v-else>
                {{getStatusName(scope.row.status)}}
              </template>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            label="操作"
            width="145">
            <template slot-scope="scope">
              <ns-table-column-operate-button
                :buttons="_data._table.table_buttons"
                :prop="scope">
              </ns-table-column-operate-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination v-if="_data._pagination.enable" class="template-table__pagination"
                      :page-sizes="_data._pagination.sizeOpts" :total="_data._pagination.total"
                      :current-page="_data._pagination.page" :page-size="_data._pagination.size"
                      :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="$sizeChange$"
                      @current-change="$pageChange$">
        </el-pagination>
      </template>
    </page-table>
    <el-dialog :visible.sync="showTableDialog" width="67%">
      <div class="table-title" slot="title">已选群聊</div>
      <div>
        <div>
          <el-input v-model="chatRoomName" class="input-search" placeholder="请输入分群名称" @keyup.enter.native="getTableList">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="getTableList"></Icon>
          </el-input>
        </div>
        <template>
          <el-table ref="table" :data="tableDialogData" class="new-table_border"
                    v-loading.lock="tableDialogLoading" :element-loading-text="$t('prompt.loading')"
                    :row-style="tableRowClassName">
            <template>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="name"
                label="群聊名称">
                <template slot-scope="scope">
                  {{scope.row.name || '-'}}
                </template>
              </el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                prop="ownerName"
                label="群主">
                <template slot-scope="scope">
                  {{scope.row.ownerName || '-'}}
                </template>
              </el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                prop="personNum"
                label="群人数">
                <template slot-scope="scope">
                  {{scope.row.personNum || '-'}}
                </template>
              </el-table-column>

            </template>

          </el-table>
        </template>
        <template>
          <el-pagination class="template-table__pagination"
                        :page-sizes="paginationDialog.sizeOpts" :total="paginationDialog.total"
                        :current-page="paginationDialog.page" :page-size="paginationDialog.size"
                        :layout="true? 'total, sizes, prev, pager, next, jumper':'total'" @size-change="dialogSizeChange"
                        @current-change="dialogPageChange">
          </el-pagination>
        </template>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showDialog" width="30%">
      <div class="tipsShowTitle" slot="title">{{dialogTitle}}</div>
      <div class="tipsShowContent">
        <span class="ns-warm-cricle">!</span>
        {{dialogContent}}
      </div>
      <span slot="footer" class="dialog-footer">
        <ns-button @click="onEscCancel">取 消</ns-button>
        <ns-button type="primary" @click="onEscConfirm">确定</ns-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NsTableFriendMessage from './src/NsTableFriendMessage'

export default NsTableFriendMessage
</script>

<style lang="scss" scoped>
@import "@/components/NewUi/styles/reset.css";
::v-deep .btn-content{
  min-width: 70px;
}
::v-deep .el-dialog__header{
  padding: 16px !important;
}
::v-deep .el-dialog__body{
  padding: 0 16px 14px;
}
.table-title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #303133;
  line-height: 24px;
  font-weight: 500;
}
::v-deep .input-search{
  width: 240px;
  height: 32px;
  margin-top: 12px;
  margin-bottom: 16px;
  line-height: 32px;
  .el-input__suffix::before{
    display: none;
  }
  .el-input__inner {
    font-size: 13px;
    height: 32px;
    line-height: 32px;
  }
  .search-icon{
    margin-top: 2px;
  }
}
.tipsShowTitle {
  // padding: 6px 3px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.tipsShowContent {
  padding: 16px 6px 0px;
  color: #595959;
  font-size: 14px;
}
.ns-warm-cricle {
  display: inline-block;
  text-align: center;
  line-height: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffaa00;
  color: #fff;
  margin-right: 10px;
}
::v-deep .el-dialog__footer {
  padding: 16px !important;
}
.search-icon {
  font-size: 27px;
  // margin-top: 2px;
}
.mem-detail{
  color: #0094FC;
  cursor: pointer;
}
::v-deep .el-dropdown-link{
  color: #0091FA;
  margin-left: 5px;
  font-weight: 500;
}
</style>
