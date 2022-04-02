<template>
  <div>
    <page-table :searchCol="24" :diyTitle="true">
      <template slot="title">
        <div class="head-router">
          <span>好友营销</span>
        </div>
      </template>
      <template slot='search'>
        <el-form :inline="true" class='form-inline_top'>
          <el-form-item label="">
            <el-input v-model.trim="model.name" placeholder="请输入活动名称" @keyup.enter.native="onSearch">
              <Icon type="ns-search" slot="suffix" class='search-icon' @click="onSearch"></Icon>
            </el-input>
          </el-form-item>
          <el-form-item label="创建人：">
            <ns-select v-model="model.employeeId" @input="getEmployeeId" filterable clearable :url="$api.marketing.weworkMarketing.getEmployee"/>
          </el-form-item>
          <el-form-item label="活动状态：">
            <ns-select v-model="model.status" @input="getStatus" filterable clearable :url="$api.marketing.weworkMarketing.getActivityStatus"/>
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
            sortable="0" :width="150">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            prop="reviewTime"
            label="审核时间"
            sortable="1" :width="150">
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
            sortable="2" :width="150">
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
              <template v-if="scope.row.type === 3"><span class="mem-detail" @click="lookReceiver(3, scope.row.id)">{{scope.row.targetCount}}</span>个客户分群</template>
              <template v-else><span class="mem-detail" @click="lookReceiver(1, scope.row.id)">{{scope.row.targetCount}}</span>个{{cloudPlatformType === 'ecrp' ? '员工' : '成员'}}全部好友</template>
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
                {{getStatusName(scope.row.status)}}（已执行{{scope.row.successNum}}个,失败{{scope.row.failNum}}个）
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
                {{getStatusName(scope.row.status)}}（已执行{{scope.row.successNum}}个,失败{{scope.row.failNum}}个）
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
      <div class="table-title" slot="title">{{showStaff ? (cloudPlatformType === 'ecrp' ? '已选择员工' : '已选择成员') : '已选择分群'}}</div>
      <div>
        <div>
          <el-input v-if="showStaff" v-model="staffName" class="input-search" :placeholder="cloudPlatformType === 'ecrp' ? '请输入员工姓名' : '请输入成员姓名'" @keyup.enter.native="getTableList">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="getTableList"></Icon>
          </el-input>
          <el-input v-else v-model="groupName" class="input-search" placeholder="请输入分群名称" @keyup.enter.native="getTableList">
            <Icon type="ns-search" slot="suffix" class='search-icon' @click="getTableList"></Icon>
          </el-input>
        </div>
        <template>
          <el-table ref="table" :data="tableDialogData" class="new-table_border"
                    v-loading.lock="tableDialogLoading" :element-loading-text="$t('prompt.loading')"
                    :row-style="tableRowClassName">
            <template v-if="showStaff">
              <el-table-column
                :show-overflow-tooltip="true"
                prop="guide.name"
                :label="cloudPlatformType === 'ecrp' ? '员工姓名' : '成员姓名'">
              </el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                prop="guide.workNumber"
                v-if="cloudPlatformType === 'ecrp'"
                label="工号">
                <template slot-scope="scope">
                  <template v-if="scope.row.guide.workNumber">
                    {{scope.row.guide.workNumber}}
                  </template>
                  <template v-else>-</template>
                </template>
              </el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                prop="guide.simpleShops.shopName"
                v-if="cloudPlatformType === 'ecrp'"
                label="工作门店">
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.guide.simpleShops && scope.row.guide.simpleShops.length"
                    placement="top-start"
                    class="item"
                    :title="`工作门店（${scope.row.guide.simpleShops.length}）`"
                    trigger="hover"
                    :content="scope.row.guide.simpleShops.map(el => el.shopName).join('；')">
                    <span class="scope-name-tip" slot="reference">{{scope.row.guide.simpleShops.length ? scope.row.guide.simpleShops.map(el => el.shopName).slice(0, 2).join('；') : '-'}}</span>
                    <div style="max-width: 400px">
                      {{scope.row.guide.simpleShops.map(el => el.shopName).join('；')}}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                prop="guide.status"
                label="在职状态">
                <template slot-scope="scope">
                  <template>
                    {{scope.row.guide.status === 0 ? '禁用' : scope.row.guide.status === 1 ? '在职' : '离职'}}
                  </template>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="targetName"
                label="分群名称">
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
</style>
