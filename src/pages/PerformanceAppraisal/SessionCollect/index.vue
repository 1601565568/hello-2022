<template>
  <div>
    <page-table title="会话数据统计">
      <!-- 搜索 start -->
      <template slot="search">
        <el-form :inline="true" class="form-inline_top">
          <el-form-item label="有效期：" class="el-form__change">
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
            <el-table-column prop="payTime" label="平均响应时长">
            </el-table-column>
            <el-table-column prop="redpackName" label="群聊发言次数">
            </el-table-column>
            <el-table-column prop="mchMsg" label="敏感词触发次数">
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
  PageTable, NsGuideDialog, NsGuideWeChatDialog, GuideDialog
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
