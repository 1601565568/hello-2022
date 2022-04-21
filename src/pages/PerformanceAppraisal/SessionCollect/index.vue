<template>
  <div>
    <page-table title="会话数据统计">
      <!-- 搜索 start -->
      <template slot="search">
        <el-form :inline="true" class="form-inline_top">
          <el-form-item label="有效期：" class="el-form__change">
            <el-date-picker
              v-model="seachDate"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              popper-class="date-filter"
              :clearable="false"
              range-separator="至"
              :picker-options="pickerOptions"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              :default-time="['00:00:00', '23:59:59']"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            :label="cloudPlatformType == 'ecrp' ? '发放人：' : '发放成员：'"
            class="el-form__change"
          >
            <NsGuideDialog
              :selfBtn="true"
              :appendToBody="true"
              :isButton="false"
              :auth="true"
              btnTitle=""
              :dialogTitle="选择员工"
              v-model="model.guideIds"
              @input="
                (value) => {
                  changeSearchfrom({ guideIds: value })
                }
              "
              :isOpenDialogAfterRequest="false"
              v-if="cloudPlatformType == 'ecrp'"
            >
              <template slot="selfBtn">
                <div class="self-btn">
                  {{
                    model.guideIds && model.guideIds.length
                      ? `已选择${model.guideIds.length}个员工`
                      : '全部'
                  }}
                  <Icon type="geren" class="guideIds-icon"></Icon>
                </div>
              </template>
            </NsGuideDialog>
            <NsGuideWeChatDialog
              :selfBtn="true"
              :appendToBody="true"
              :isButton="false"
              :auth="true"
              :switchAreaFlag="1"
              btnTitle=""
              dialogTitle="选择企业微信成员"
              v-model="model.guideIds"
              @input="
                (value) => {
                  changeSearchfrom({ guideIds: value })
                }
              "
              :isOpenDialogAfterRequest="false"
              v-else
            >
              <template slot="selfBtn">
                <div class="self-btn">
                  {{
                    model.guideIds && model.guideIds.length
                      ? `已选择${model.guideIds.length}个成员`
                      : '全部'
                  }}
                  <Icon type="geren" class="guideIds-icon"></Icon>
                </div>
              </template>
            </NsGuideWeChatDialog>
          </el-form-item>
        </el-form>
      </template>
      <template slot="button">
        <ns-button
          size="large"
          @click="handleExcelExport(model)"
          id="exportButton"
          >导出文件</ns-button
        >
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
            <el-table-column prop="nickname" label="企业微信成员">
            </el-table-column>
            <el-table-column prop="state" label="接待人数">
              <template slot-scope="scope">
                {{ setTypeMap[scope.row.launchType] }}
              </template>
            </el-table-column>
            <el-table-column prop="total" label="已回复聊天占比">
              <template slot-scope="scope">
                <template>
                  {{ (scope.row.money / 100) | moneyStr }}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="payTime" label="平均响应时长"> </el-table-column>
            <el-table-column prop="redpackName" label="群聊发言次数">
            </el-table-column>
            <el-table-column prop="mchMsg" label="敏感词触发次数">
            </el-table-column>
            <el-table-column prop="redpackType" label="红包类型">
              <template slot-scope="scope">
                {{ redpacketTypeMap[scope.row.redpackType] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="sendName"
              :label="cloudPlatformType === 'ecrp' ? '发放人' : '发放成员'"
            >
            </el-table-column>
            <el-table-column
              prop="workNumber"
              label="工号"
              v-if="cloudPlatformType === 'ecrp'"
            >
              <template slot-scope="scope">
                {{ scope.row.workNumber || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="shopNames"
              show-overflow-tooltip
              label="工作门店"
              v-if="cloudPlatformType === 'ecrp'"
            >
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
Index.components = {
  PageTable, NsGuideDialog, NsGuideWeChatDialog
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
