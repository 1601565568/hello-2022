<template>
  <!-- 地区销售分析页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.地区销售分析用于判断在某一段时间内全国各省份客户的消费能力，或者用于分析某一商品在各省份的消费能力，尤其针对季节性商品，可以有效利用该报表分析季节性商品与地域分布的关系；<br>
        2.由于当客户使用购物车拍下多种宝贝时，存在购物车级别的优惠的分摊问题，在此分析数据中，购物车级别的优惠不会从销售额中减去，所以宝贝的销售额仅供参考，不能作为财务核算数据。销售件数可以作为精确数据使用；<br>
        3.商品关键字为模糊查询，商家编码为精确查询。<br>
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
          </div>
          <el-row>
            <el-col :span="12">
              <business-echarts :options="option" auto-resize></business-echarts>
            </el-col>
            <el-col :span="12">
              <business-echarts :options="option1" auto-resize></business-echarts>
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
        :summary-method="getSummaries"
        show-summary
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="month"
          label="月份"
          align="right">
        </el-table-column>
        <el-table-column
          prop="transactions"
          label="交易成功订单数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="evaluation"
          label="自动评价"
          align="right">
        </el-table-column>
        <el-table-column
          prop="evaluationRatio"
          label="自动评价占比"
          align="right">
        </el-table-column>
        <el-table-column
          prop="active"
          label="主动评价订单数"
          align="right">
        </el-table-column>
        <el-table-column
          prop="ratio"
          label="主动评价订单占比"
          align="right">
        </el-table-column>
        <tr slot="append" class="el-table__row append-average">
          <td v-for="item in columnsAverage" class="text-right"><div class="cell">{{item}}</div></td>
        </tr>
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
  <!-- /地区销售分析页面 -->
</template>

<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .analysis-content {
    >>> .template-table__bar-more {
      margin-top: -5px;
    }
    .template-table__main {
      box-shadow: var(--default-box-shadow-base);
      background-color: var(--theme-color-white);
      >>> .echarts {
        overflow: hidden;
      }
    }
    .template-page__table {
      margin-top: var(--default-margin-base);
      overflow: hidden;
    }
    .append-average {
      display: flex;
      width: 100%;
      td {
        flex: 1;
        background-color: var(--theme-bg-color-base);
      }
    }
  }
</style>
