<template>
  <!-- 店铺DSR页面 -->
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <div class="info-content">
          <h3>2018年08月30日 星期四</h3>
          <div class="score-item">
            <div class="score-item__icon">
              <i class="iconfont icon-miaoshu"></i>
            </div>
            <div class="score-item__text">
              <p>描述相符</p>
              <span class="text-info">0.035</span>
            </div>
          </div>
          <div class="score-item">
            <div class="score-item__icon">
              <i class="iconfont icon-fuwu"></i>
            </div>
            <div class="score-item__text">
              <p>服务态度</p>
              <span class="text-info">0.023</span>
            </div>
          </div>
          <div class="score-item">
            <div class="score-item__icon">
              <i class="iconfont icon-wuliu1"></i>
            </div>
            <div class="score-item__text">
              <p>发货速度</p>
              <span class="text-info">-0.01</span>
            </div>
          </div>
        </div>
      </div>
      <div class="template-page__row-right">
        <ns-page-table :colButton="0">
          <!-- 简单搜索 -->
          <template slot="searchSearch">
            <el-form :inline="true" label-width="80px">
              <el-form-item label="日期：">
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
          <!-- 简单搜索-结束 -->

          <!-- 表格 -->
          <template slot="table">
            <div class="template-table__main content-style">
              <business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
            </div>
          </template>
          <!-- 表格-结束 -->
        </ns-page-table>
      </div>
    </div>
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
          label="日期"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述相符">
        </el-table-column>
        <el-table-column
          prop="attitude"
          label="服务态度">
        </el-table-column>
        <el-table-column
          prop="speed"
          label="发货速度">
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
  <!-- /店铺DSR页面 -->
</template>

<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .template-page {
    .template-page__row-left {
      width: 180px;
      .info-content {
        height: 100%;
        border: 1px solid var(--theme-color-primary-light);
        h3 {
          padding-left: var(--default-padding-base);
          margin-bottom: var(--default-margin-base);
          line-height: var(--default-form-item-small-height);
          color: var(--theme-color-white);
          background-color: var(--theme-color-primary);
        }
        .score-item {
          display: flex;
          width: 100%;
          padding: 1px 8px;
          .score-item__icon {
            display: inline-block;
            width: 80px;
            height: 80px;
            text-align: center;
            line-height: 80px;
            i {
              padding: var(--default-padding-larger);
              font-size: 40px;
              border-radius: 50%;
              border: 1px solid var(--theme-base-border-color-primary);
            }
          }
          .score-item__text {
            flex: 1;
            padding: 17px 0;
            font-size: var(--default-font-size-base);
            p {
              margin-bottom: var(--default-margin-base);
            }
          }
        }
      }
    }
    .template-page__row-right {
      .template-table__main {
        >>> .echarts {
          height: 250px;
        }
      }
    }
    .template-page__table {
      margin-top: var(--default-margin-base);
      overflow: hidden;
    }
  }
</style>
