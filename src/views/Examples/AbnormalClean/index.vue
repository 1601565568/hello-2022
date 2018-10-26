<template>
  <!-- 异常清洗页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        异常清洗模型：使用客道独有的云监控技术管控营销活动执行过程并定位信息异常客户，针对信息异常客户营销活动不再执行，同时开启异常信息修复更新功能。<br>
        我们能做的：<br>
        1、清洗出异常客户并对异常客户终止营销行为，为您降低营销成本；<br>
        2、对清洗出的异常客户及时更新信息，为您下次营销提升触达率；<br>
      </div>
    </div>

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
          <el-row :gutter="5" type="flex">
            <el-col :span="12">
              <div class="template-table__info content-style">
                <div class="template-table__info-text">
                  <p>清洗人数：0</p>
                  <p>成功营销人数：9</p>
                  <p>营销清洗率：0%</p>
                </div>
                <div class="template-table__info-echart">
                  <business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="template-table__info content-style">
                <div class="template-table__info-text">
                  <p>已节约成本：0</p>
                  <p>营销成本：11.94</p>
                  <p>已节约成本占比：0%</p>
                </div>
                <div class="template-table__info-echart">
                  <business-echarts :options="option1" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
                </div>
              </div>
            </el-col>
          </el-row>
          <business-echarts :options="option2" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
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
          label="清洗时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="客户昵称">
        </el-table-column>
        <el-table-column
          prop="beforeTel"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="afterTel"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="state"
          align="center"
          label="更新状态">
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
  <!-- /异常清洗页面 -->
</template>

<script>
  import index from './src/index'
  export default index
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .analysis-content {
    >>> .template-table__main {
      box-shadow: var(--default-box-shadow-base);
      .echarts {
        background-color: var(--theme-color-white)!important;
        overflow: hidden;
      }
      >.el-row {
        margin-bottom: var(--default-margin-base);
        .el-col {
          .template-table__info {
            display: flex;
            height: 100%;
            padding: var(--default-padding-base) var(--default-padding-larger);
            .template-table__info-text {
              position: relative;
              width: 40%;
              padding: 30px;
              &:before {
                position: absolute;
                top: 5px;
                right: 0;
                bottom: 5px;
                content: ' ';
                border-right: 1px solid var(--theme-base-border-color-primary);
              }
              p {
                line-height: 30px;
              }
            }
            .template-table__info-echart {
              width: 60%;
              .echarts {
                height: 150px;
                overflow: visible;
              }
            }
          }
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
