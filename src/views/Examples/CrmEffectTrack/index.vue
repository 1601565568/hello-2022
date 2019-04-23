<template>
  <!-- 实施状态跟踪页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.本周：统计时间所在天7天内（包含当天）累计数据； 上周：统计时间前8~14天内的累计数据； 若要看自然周就选每个周日进行对比；<br>
        2.DSR变化：统计时间的前1天和前8天的DSR对比<br>
        3.催付、询单、归档、物流、营销都是取对应时段的累计新增数据；<br>
        4.客单价、客件数以下单时间判定，统计付款订单，不排除退款数据；<br>
        5.疑难件和超区件：以物流更新时间判断； 超3天未签收订单数：以发货时间判断； 比例=（疑难件+超区件+超3天未签收）/ 异常物流时间范围内总订单；<br>
        6.知识库是全部历史统计量；<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <template slot="searchSearch">
        <el-form label-width="70px"
                 :inline="true">
          <el-form-item label="跟踪时间：">
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
          <div class="template-page__table content-style">
            <div class="page-block__title">
              <p class="el-inline-block">
                数据报表
              </p>
              <ns-button type="text" class="float-right clearfix"><i class="el-icon-download"></i>导出报表</ns-button>
            </div>
            <h3 class="text-center">客道CRM实施状况周报</h3>
            <div class="padding-base">
              <el-table
                stripe
                :data="tableData"
                :span-method="objectSpanMethod"
                style="width: 100%">
                <el-table-column
                  align="center"
                  width="120"
                  prop="title">
                </el-table-column>
                <el-table-column label="事务处理进度" align="center">
                  <el-table-column
                    prop="progress"
                    align="right"
                    label="未处理">
                  </el-table-column>
                  <el-table-column
                    prop="progress1"
                    align="right"
                    label="处理中">
                  </el-table-column>
                  <el-table-column
                    prop="progress2"
                    align="right"
                    label="已处理">
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="DSR变化">
                  <el-table-column
                    prop="dsrNum"
                    align="right"
                    label="描述相符">
                  </el-table-column>
                  <el-table-column
                    prop="dsrNum1"
                    align="right"
                    label="服务态度">
                  </el-table-column>
                  <el-table-column
                    prop="dsrNum2"
                    align="right"
                    label="发货速度">
                  </el-table-column>
                </el-table-column>
                <el-table-column :render-header="renderContent">
                  <el-table-column
                    prop="statisticians"
                    label="统计人">
                  </el-table-column>
                  <el-table-column
                    prop="statisticalTime"
                    label="统计时间">
                  </el-table-column>
                </el-table-column>
              </el-table>
              <el-table
                stripe
                :data="tableData1"
                style="width: 100%">
                <el-table-column
                  align="center"
                  width="120"
                  prop="title">
                </el-table-column>
                <el-table-column label="催付情况" align="center">
                  <el-table-column
                    prop="order"
                    align="right"
                    label="催付订单">
                  </el-table-column>
                  <el-table-column
                    prop="returnOrder"
                    align="right"
                    label="回款订单">
                  </el-table-column>
                  <el-table-column
                    prop="redeem"
                    align="right"
                    label="挽回金额">
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="关联指标">
                  <el-table-column
                    prop="price"
                    align="right"
                    label="客单价">
                  </el-table-column>
                  <el-table-column
                    prop="objects"
                    align="right"
                    label="客件数">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="询单转化统计" align="center">
                  <el-table-column
                    prop="inquiries"
                    align="right"
                    label="询单量">
                  </el-table-column>
                  <el-table-column
                    prop="payment"
                    align="right"
                    label="询单付款数">
                  </el-table-column>
                  <el-table-column
                    prop="rate"
                    align="right"
                    label="询单转化率">
                  </el-table-column>
                </el-table-column>
              </el-table>
              <el-table
                stripe
                :data="tableData2"
                style="width: 100%">
                <el-table-column
                  align="center"
                  width="120"
                  prop="title">
                </el-table-column>
                <el-table-column label="归档处理" align="center">
                  <el-table-column
                    prop="order"
                    align="right"
                    label="询单">
                  </el-table-column>
                  <el-table-column
                    prop="returnOrder"
                    align="right"
                    label="评价">
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="知识库">
                  <el-table-column
                    prop="redeem"
                    align="right"
                    label="公共知识">
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    align="right"
                    label="商品知识">
                  </el-table-column>
                </el-table-column>
                <el-table-column label="异常物流统计" align="center">
                  <el-table-column
                    prop="objects"
                    align="right"
                    label="疑难件">
                  </el-table-column>
                  <el-table-column
                    prop="inquiries"
                    align="right"
                    label="超区件">
                  </el-table-column>
                  <el-table-column
                    prop="payment"
                    align="right"
                    label="超3天未签收订单数">
                  </el-table-column>
                  <el-table-column
                    prop="rate"
                    align="right"
                    label="比例">
                  </el-table-column>
                </el-table-column>
              </el-table>
              <el-table
                stripe
                :data="tableData3"
                :span-method="objectSpanMethodSec"
                style="width: 100%">
                <el-table-column
                  align="center"
                  width="120"
                  prop="title">
                </el-table-column>
                <el-table-column
                  prop="progress"
                  align="right"
                  label="活动数">
                </el-table-column>
                <el-table-column label="成本" align="center">
                  <el-table-column
                    prop="progress"
                    align="right"
                    label="短信费">
                  </el-table-column>
                  <el-table-column
                    prop="progress1"
                    align="right"
                    label="邮件费">
                  </el-table-column>
                  <el-table-column
                    prop="progress2"
                    align="right"
                    label="总成本">
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="dsrNum"
                  align="right"
                  label="执行任务数">
                </el-table-column>
                <el-table-column
                  prop="dsrNum1"
                  align="right"
                  label="平均回购率">
                </el-table-column>
                <el-table-column
                  prop="dsrNum2"
                  align="right"
                  label="平均ROI">
                </el-table-column>
                <el-table-column
                  prop="statisticians"
                  align="right"
                  label="回购总额">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </template>
      <!-- 表格-结束 -->
    </ns-page-table>
  </div>
  <!-- /实施状态跟踪页面 -->
</template>

<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .template-page__table {
    h3 {
      height: 45px;
      line-height: 50px;
      font-size: var(--dafault-font-size-xlarge);
      font-weight: normal;
    }
    .padding-base {
      >>> .el-table--group, >>> .el-table--border {
        &:not(:first-child) {
          border-top: none;
        }
      }
    }
  }
</style>
