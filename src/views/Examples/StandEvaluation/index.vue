<template>
  <!-- 评价行为分析页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.评价行为分析主要用于对客户主动评价的行为的类型进行分析；<br>
        2.一般来说，主动评价的比例越高，说明客户与店铺的互动性越强，互动性越强的店铺，客户的由此延伸出二次购买的可能性越高；<br>
        3.对于主动评价的内容还要通过评价分析做内容的进度一步追踪，确认正负面评价比例，从而对服务节点进行优化；<br>
      </div>
    </div>
    <ns-page-table :colButton="0">
      <template slot="advancedSearch">
        <el-form label-width="70px" class="surround-btn"
                 :inline="true">
          <el-form-item label="签收时间：">
            <ns-datetime type="date"
                         v-model="time">
            </ns-datetime>
          </el-form-item>
          <el-form-item label-width="0">
            <el-form-grid size="sm">
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
            <el-form-grid size="sm" v-if="selectValue === '1'">
              <el-select v-model="selectValue1" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
            <el-form-grid size="sm" v-if="selectValue === '2'">
              <el-select v-model="selectValue2" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
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
          <el-form-item label="物流公司：">
            <el-form-grid>
              <el-select v-model="selectValue1" placeholder="请选择">
              <el-option
                v-for="item in selectOptions1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-form-grid>
            <el-form-grid>
              <el-checkbox v-model="checked">对比</el-checkbox>
            </el-form-grid>
          </el-form-item>
          <el-form-item label="物流公司：" v-if="checked">
            <el-select v-model="selectValue1" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="目标省市：">
            <ns-area :props="key"
                     v-model="selectedOptions3">
            </ns-area>
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
            <el-col :span="6">
              <business-echarts :options="option" auto-resize></business-echarts>
            </el-col>
            <el-col :span="18">
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
  <!-- /评价行为分析页面 -->
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
