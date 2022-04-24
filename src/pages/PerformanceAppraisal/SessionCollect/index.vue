<template>
  <div>
    <page-table title="会话数据统计">
      <!-- 搜索 start -->
      <template slot="search">
        <el-form :inline="true" class="form-inline_top">
          <el-form-item label="时间选择：" class="el-form__change">
            <el-date-picker
              v-model="_data._order.time"
              type="date"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :picker-options="pickerOptions"
              placeholder="请选择日期"
              align="right"
              @change="changeSearchfrom()"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="企业微信成员: " class="el-form__change">
            <GuideDialog
              :selfBtn="true"
              :appendToBody="true"
              :isButton="false"
              :auth="false"
              btnTitle=""
              :dialogTitle="`选择员工`"
              v-model="guideIds"
              @inputAllData="handleGuideIds"
              :isOpenDialogAfterRequest="false"
            >
              <template slot="selfBtn">
                <div class="self-btn">
                  {{
                    guideIds && guideIds.length
                      ? `已选择${guideIds.length}个员工`
                      : '全部'
                  }}
                  <Icon type="geren" class="guideIds-icon"></Icon>
                </div>
              </template>
            </GuideDialog>
          </el-form-item>
        </el-form>
      </template>
      <template slot="button">
        <ns-button
          size="large"
          @click="handleExcelExport(model)"
          id="exportButton"
          >导出文件
        </ns-button>
      </template>
      <!-- 搜索 end -->
      <!-- 表格 start -->
      <template slot="table">
        <template>
          <el-table
            :data="_data._table.data"
            class="new-table_border"
            v-loading.lock="_data._table.loadingtable"
            style="width: 100%"
          >
            <el-table-column prop="userName" label="企业微信成员">
            </el-table-column>
            <el-table-column prop="receptionTotal" label="接待人数">
              <template slot="header">
                接待人数
                <el-tooltip
                  effect="light"
                  popper-class="popperClass"
                  placement="top"
                >
                  <Icon type="question-circle" class="question-circle" />
                  <template slot="content">
                    客户主动发起聊天后，企微成员在当天24点前回复接待的人数，不包括群聊
                  </template>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="replyPercentage" label="已回复聊天占比">
              <template slot="header">
                已回复聊天占比
                <el-tooltip
                  effect="light"
                  popper-class="popperClass"
                  placement="top"
                >
                  <Icon type="question-circle" class="question-circle" />
                  <template slot="content">
                    单聊中企微员工已回复接待客户人数/主动发起聊天的客户数对应比例，不包括群聊
                  </template>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <template>
                  {{ scope.row.replyPercentage }}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="avgReplyTime" label="平均响应时长">
              <template slot="header">
                平均响应时长
                <el-tooltip
                  effect="light"
                  popper-class="popperClass"
                  placement="top"
                >
                  <Icon type="question-circle" class="question-circle" />
                  <template slot="content">
                    客户主动发起聊天后，企微成员在当天24点前所有聊天首次回复总时长/回复接待客户数比例，不包括群聊
                  </template>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="roomSpeakTotal" label="群聊发言次数">
              <template slot="header">
                群聊发言次数
                <el-tooltip
                  effect="light"
                  popper-class="popperClass"
                  placement="top"
                >
                  <Icon type="question-circle" class="question-circle" />
                  <template slot="content">
                    群聊成员时间段内在其所在的群聊里发送的消息总条数，只统计包含外部客户群聊
                  </template>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="sensitiveWordsTotal" label="敏感词触发次数">
              <template slot="header">
                敏感词触发次数
                <el-tooltip
                  effect="light"
                  popper-class="popperClass"
                  placement="top"
                >
                  <Icon type="question-circle" class="question-circle" />
                  <template slot="content">
                    在敏感词管理预置好敏感词之后，记录该成员时间段内在其群聊里敏感词的触发总次数
                  </template>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
      <!-- 表格 end -->
      <!-- 页面 start -->
      <template slot="pagination">
        <el-pagination
          v-if="_data._pagination.enable"
          class="template-table__pagination"
          :page-sizes="_data._pagination.sizeOpts"
          :total="_data._pagination.total"
          :current-page="_data._pagination.page"
          :page-size="_data._pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="$sizeChange$"
          @current-change="$pageChange$"
        >
        </el-pagination>
      </template>
      <!-- 页面 end -->
    </page-table>
  </div>
</template>
<script>
import Index from './src/index'
import PageTable from '@/components/NewUi/PageTablePro'
import NsGuideDialog from '@/components/NsGuideDialog'
import NsGuideWeChatDialog from '@/components/NsGuideWeChatDialog'
import GuideDialog from '@/components/NewUi/GuideDialog'
Index.components = {
  PageTable, GuideDialog
}
export default Index
</script>
<style lang="scss" scoped>
@import '@components/NewUi/styles/reset.css';
.self-btn {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
  .guideIds-icon {
    color: #c0c4cc;
  }
}
</style>
