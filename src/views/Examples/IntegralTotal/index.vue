<template>
  <!-- 积分统计页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.积分统计按天计算店铺或店铺下某互动类型发放以及买家消费的积分数量；<br>
        2.积分的数据主要来源于爱互动中互动积分和客道CRM中交易相关积分；<br>
        3.数据统计到昨天，默认显示前7天，其中交易送积分已排除退款金额；<br>
      </div>
    </div>

    <el-row :gutter="5">
      <el-col :span="12">
        <div class="template-table__info content-style text-center">
          <el-countup
            class="template-table__info-num"
            :start="0"
            :end="80000"
            :duration="4">
          </el-countup>
          <h3>当前拥有积分客户数</h3>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="template-table__info content-style text-center">
          <el-countup
            class="template-table__info-num"
            :start="0"
            :end="7654819.00"
            :duration="4"
            :decimal="2">
          </el-countup>
          <h3>当前店铺可用积分数</h3>
        </div>
      </el-col>
    </el-row>
    <ns-page-table :colButton="0">
      <template slot="searchSearch">
        <el-form label-width="70px"
                 :inline="true">
          <el-form-item label="统计时间：">
            <ns-datetime type="date"
                         v-model="time">
            </ns-datetime>
          </el-form-item>
          <el-form-item label="互动渠道：">
            <el-form-grid size="md">
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
            <el-form-grid size="md">
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>
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
        :summary-method="getSummaries"
        show-summary
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          width="120"
          label="统计时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="distribution"
          label="积分发放"
          align="right">
        </el-table-column>
        <el-table-column
          prop="consume"
          label="积分消耗"
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
  <!-- /积分统计页面 -->
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
    >>> .el-col {
      .template-table__info {
        padding-bottom: var(--default-padding-base);
        .template-table__info-num {
          color: var(--theme-color-danger);
          font-size: 40px;
          line-height: 50px;
        }
        h3 {
          font-weight: normal;
        }
      }
    }
    >>> .template-table {
      margin-top: var(--default-margin-base);
    }
    .template-page__table {
      margin-top: var(--default-margin-base);
    }
  }
</style>
