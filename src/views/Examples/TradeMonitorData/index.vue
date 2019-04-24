<template>
  <!-- 付款周期分析页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.交易监控用于分析单天或单月的付款订单结构，通过树状图展示统计周期内订单数、商品数、客户数、订单来源以及客户结构；<br>
        2.该报表同时支持同比和环比的对比分析，可轻松解读各项指标变化趋势；<br>
        3.环比：当前的统计周期与上一个统计周期比较；同比：当前统计周期与去年同期比较。<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <template slot="advancedSearch">
        <el-form label-width="70px" class="surround-btn"
                 :inline="true">
          <el-form-item label="付款时间：">
            <ns-datetime type="date"
                         v-model="time">
            </ns-datetime>
          </el-form-item>
          <el-form-item label="备注旗帜：">
            <el-checkbox-group v-model="banners">
              <el-checkbox :label="1"><i class="iconfont icon-flag-red"></i></el-checkbox>
              <el-checkbox :label="2"><i class="iconfont icon-flag-yellow"></i></el-checkbox>
              <el-checkbox :label="3"><i class="iconfont icon-flag-blue"></i></el-checkbox>
              <el-checkbox :label="4"><i class="iconfont icon-flag-green"></i></el-checkbox>
              <el-checkbox :label="5"><i class="iconfont icon-flag-purple"></i></el-checkbox>
              <el-checkbox :label="6"><i class="iconfont icon-flag-gray"></i></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="template-table__more-btn">
          <ns-button type="primary">{{$t('operating.search')}}</ns-button>
          <ns-button>{{$t('operating.reset')}}</ns-button>
        </div>
      </template>

      <!-- 表格 -->
      <template slot="table">
        <div class="template-table__main">
          <div class="page-block__title">
            <p class="el-inline-block">
              数据图表
            </p>
            <el-radio-group v-model="radioValue">
              <el-radio :label="1">按天</el-radio>
              <el-radio :label="2">按月</el-radio>
            </el-radio-group>
          </div>
          <!-- 组织架构 -->
          <!-- API https://spiritree.github.io/vue-orgchart/#/props -->
          <el-scrollbar>
            <vo-basic :data="chartData" :createNode="createNode"></vo-basic>
          </el-scrollbar>
          <!-- 组织架构 -->
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
          label="发货~签收时间间隔"
          align="right">
        </el-table-column>
        <el-table-column
          prop="orderNumber"
          label="订单数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="orderProportion"
          label="订单比例"
          align="right">
        </el-table-column>
        <el-table-column
          prop="num"
          label="客户数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="customerRatio"
          label="客户比例"
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
  <!-- /付款周期分析页面 -->
</template>

<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .analysis-content {
    .template-table__main {
      box-shadow: var(--default-box-shadow-base);
      background-color: var(--theme-color-white);
      >>> .echarts {
        overflow: hidden;
      }
      /* 组织架构树组件样式优化 */
      >>> .vo-basic {
        top: 0!important;
        overflow: inherit!important;
        .orgchart {
          .topLine, .rightLine, .downLine, .leftLine {
            border-width: 1px;
            border-color: var(--theme-base-border-color-primary);
          }
          .downLine {
            width: 1px;
            background-color: var(--theme-base-border-color-primary);
          }
          .node {
            width: 160px;
            padding: 0;
            margin: 0 var(--default-margin-base);
            border-radius: var(--default-radius-mini);
            border: 1px solid var(--theme-base-border-color-primary);
            &.focused, &:hover {
              background-color: transparent;
            }
            .title {
              height: auto;
              padding: var(--default-padding-base) 0;
              background-color: var(--theme-color-primary);
            }
            i {
              display: none;
            }
            .info-list {
              display: flex;
              div {
                flex: 1;
              }
            }
            p {
              color: var(--theme-font-color-secondary);
              font-size: var(--default-font-size-small);
            }
            span {
              color: var(--theme-color-danger);
            }
          }
        }
      }
    }
    .template-page__table {
      margin-top: var(--default-margin-base);
      overflow: hidden;
    }
  }
</style>
