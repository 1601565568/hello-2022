<template>
  <!-- 信息更新页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        信息更新模型：使用客道强大的云数据分析功能每天对客户数据扫描一次，检测出信息失效客户，并分析该客户的有效信息，执行信息更新。<br>
        我们能做的：<br>
        1、为您剔除客户的失效信息，减轻数据包袱；<br>
        2、及时分析出客户有效信息进行更新，让您的客户库始终真实有效；<br>
      </div>
    </div>

    <el-row :gutter="5" type="flex">
      <el-col :span="8">
        <div class="template-table__info content-style text-center">
          <el-countup
            class="template-table__info-num"
            :start="0"
            :end="5"
            :duration="4">
          </el-countup>
          <h3>今日更新客户数</h3>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="template-table__info content-style text-center">
          <el-countup
            class="template-table__info-num"
            :start="0"
            :end="100"
            :duration="2"
            :decimal="2">
          </el-countup>
          <h3>今日更新客户占比(%)</h3>
          <p class="text-right">今日扫描客户数：0</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="template-table__info content-style text-center">
          <el-countup
            class="template-table__info-num"
            :start="0"
            :end="100"
            :duration="3">
          </el-countup>
          <h3>更新客户总数</h3>
        </div>
      </el-col>
    </el-row>

    <ns-page-table :colButton="0">
      <template slot="searchSearch">
        <el-form :inline="true">
          <el-form-item label-width="0">
            <el-form-grid>
              <el-radio-group v-model="radio">
                <el-radio :label="1">30天</el-radio>
                <el-radio :label="2">60天</el-radio>
                <el-radio :label="3">自定义</el-radio>
              </el-radio-group>
            </el-form-grid>
            <el-form-grid v-if="radio === 3">
              <ns-datetime type="date"
                           v-model="time">
              </ns-datetime>
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
      </div>
      <el-table
        stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          width="120"
          label="更新日期"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="客户昵称">
        </el-table-column>
        <el-table-column
          prop="name"
          label="客户姓名">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地区">
        </el-table-column>
        <el-table-column
          prop="detailedAddress"
          label="详细地址">
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
  <!-- /信息更新页面 -->
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
        height: 100%;
        padding: var(--default-padding-base) var(--default-padding-larger);
        .template-table__info-num {
          color: var(--theme-color-danger);
          font-size: 40px;
          line-height: 50px;
        }
        h3 {
          font-weight: normal;
          color: var(--theme-font-color-secondary);
        }
        p {
          margin-top: -10px;
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
