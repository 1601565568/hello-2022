<template>
  <!-- 发货周期分析页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.发货周期分析主要用于对店铺内部订单流转效率进行分析；<br>
        2.分析报表呈现了按照从付款时间到发货时间的订单量分布情况（注意：0天表示当天发货，时间截止到晚上24:00，1天表示第二天发货，以此类推）；<br>
        3.一般来说，发货周期越短，说明店铺内部订单掌控能力和物流协调能力越强；<br>
        4.报表默认呈现最近3天的发货数据，如需更多的数据，请自定义时间段，时间段越长，报表呈现的时间将越长；<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <template slot="searchSearch">
        <el-form label-width="70px"
                 :inline="true">
          <el-form-item label="发货时间：">
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
          <div class="page-block__title">
            <p class="el-inline-block">
              数据图表
            </p>
            <el-radio-group v-model="radioValue">
              <el-radio :label="1">从付款到发货</el-radio>
              <el-radio :label="2">从付款到揽件</el-radio>
            </el-radio-group>
          </div>
          <business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
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
          label="付款~发货时间间隔"
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
  <!-- /发货周期分析页面 -->
</template>

<script>
  import index from './src/index'
  export default index
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .analysis-content {
    .template-table__main {
      box-shadow: var(--default-box-shadow-base);
      background-color: var(--theme-color-white);
    }
    .template-page__table {
      margin-top: var(--default-margin-base);
      overflow: hidden;
    }
  }
</style>
