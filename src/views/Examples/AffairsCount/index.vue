<template>
  <div>
    <!--事务统计页面-->
    <ns-page-charts>
    <!--搜索区域-->
    <template slot="search">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="统计时间：">
          <ns-datetime type="date"
                       v-model="create_time">
          </ns-datetime>
        </el-form-item>
        <el-form-item>
          <ns-button type="primary">{{$t('operating.search')}}</ns-button>
          <ns-button>{{$t('operating.reset')}}</ns-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- /搜索区域-->
    <!--图表区域-->
    <template slot="charts">
      <el-form label-width="66px">
        <el-form-item label="数据图表：">
          <el-radio-group v-model="counts_category">
            <el-radio label="1">按时间统计</el-radio>
            <el-radio label="2">按工作量统计</el-radio>
            <el-radio label="3">按额外成本统计</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="width:100%;height:400px;">
        <ns-no-data height="400">{{$t('prompt.noData')}}</ns-no-data>
      </div>
    </template>
    <!-- /图表区域-->
    <!--表格区域-->
    <template slot="table">
      <p class="table-title">数据报表</p>
      <el-scrollbar>
        <el-table show-summary :summary-method="getSummaries"
                  :data="tableData3" style="width:100%;">
          <el-table-column align="center"
                           label="来源"
                           width="150">
            <el-table-column align="center"
                             label="创建日期"
                             width="150" prop="date">
            </el-table-column>
          </el-table-column>
          <el-table-column label="精灵" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
           <el-table-column label="询单" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="评价" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="物流" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="关怀" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="订单" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="呼叫中心" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="短信回复" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="订单体检" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column label="其他" align="center">
            <el-table-column
              prop="date1"
              label="未处理"
              width="60" align="right">
            </el-table-column>
            <el-table-column align="right"
                             prop="date2"
                             label="处理中"
                             width="60">
            </el-table-column>
            <el-table-column align="right"
                             prop="date3"
                             label="已处理"
                             width="60">
            </el-table-column>
          </el-table-column>
          <el-table-column align="right"
                           prop="sum"
                           label="总计" width="60">
          </el-table-column>
          <tr slot="append" class="el-table__row append-average">
            <td class="text-center"><div class="cell" style="width: 149px;">均值</div></td>
            <td v-for="item in columnsAverage" class="text-right"><div class="cell" style="width: 59px;">{{item}}</div></td>
          </tr>
        </el-table>
      </el-scrollbar>
    </template>
    <!-- /表格区域-->
    </ns-page-charts>
    <!-- /事务统计页面 -->
  </div>
</template>

<script>
import index from './src/index'

export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
  .append-average td{
    border-top: 1px solid var(--theme-base-border-color-primary);
    background: var(--theme-bg-color-base);
  }
  .table-title{
    line-height: var(--default-form-item-small-height);
    padding-left:6px;
  }
  >>> .el-table--scrollable-x .el-table__body-wrapper{
    overflow: visible;
  }
  >>> .el-table, >>> .el-table__header-wrapper, >>> .el-table__body-wrapper, >>> .el-table__footer-wrapper{
    width:auto;
    overflow: visible;
  }
  >>> .el-table--group, >>> .el-table--border{
    border-top:none;
  }
  >>> .el-table--group:after, >>> .el-table--border:after, >>> .el-table:before{
    display: none;
  }
  >>> .el-table__header{
    border-top: 1px solid var(--theme-base-border-color-primary);
  }
</style>
