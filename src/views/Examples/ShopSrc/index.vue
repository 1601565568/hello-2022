<template>
  <!-- 有效来源分析页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.通过对官方不同渠道入口的有效付款情况跟踪，以便于衡量判定不同渠道的价值。从而可以针对渠道来源人群特性做针对性关怀与营销动作；<br>
        2.数据节点以付款状态进行判定，报表数据仅从CRM4.0上线后开始提供；<br>
        3.筛选区间仅支持按天进行筛选，PV、UV、IPV及IUV数据默认展示近一周数据走势；<br>
        4.IPV表示统计周期内宝贝页面被浏览的次数，IUV表示统计周期内浏览宝贝页的独立访客数；<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <template slot="searchSearch">
        <el-form label-width="70px"
                 :inline="true">
          <el-form-item label="付款时间：">
            <ns-datetime type="date"
                         v-model="time">
            </ns-datetime>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary">{{$t('operating.search')}}</ns-button>
            <ns-button>{{$t('operating.reset')}}</ns-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 表格 -->
      <template slot="table">
        <div class="template-table__main">
          <el-row :gutter="5">
            <el-col :span="12">
              <div class="template-table__echart content-style">
                <div class="page-block__title">
                  <p class="el-inline-block">
                    有效渠道分布
                  </p>
                  <el-radio-group v-model="radioValue">
                    <el-radio :label="1">有效金额</el-radio>
                    <el-radio :label="2">有效人数</el-radio>
                  </el-radio-group>
                </div>
                <business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="template-table__echart content-style">
                <div class="page-block__title">
                  <p class="el-inline-block">
                    流量分布
                  </p>
                </div>
                <business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <!-- 表格-结束 -->
    </ns-page-table>
    <div class="template-page__table content-style">
      <div class="page-block__title">
        <p class="el-inline-block">
          数据报表
        </p>
        <ns-button type="text" class="float-right clearfix"><i class="el-icon-download"></i>导出报表</ns-button>
      </div>
      <el-table
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="interval"
          label="来源">
        </el-table-column>
        <el-table-column
          prop="orderNumber"
          label="详细">
        </el-table-column>
        <el-table-column
          prop="orderProportion"
          label="有效金额"
          align="right">
        </el-table-column>
        <el-table-column
          prop="num"
          label="有效客户数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="customerRatio"
          label="有效商品件数"
          align="right">
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :next-click-unlimited="true"
        :total="400">
      </el-pagination>
    </div>
  </div>
  <!-- /有效来源分析页面 -->
</template>

<script>
  import index from './src/index'
  export default index
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .analysis-content {
    .template-page__table {
      margin-top: var(--default-margin-base);
      overflow: hidden;
    }
  }
</style>
