<template>
  <!-- 对比分析页面 -->
  <div class="template-page">
    <div class="template-page__row">
      <div class="template-page__row-left">
        <!-- 搜索条件 -->
        <el-form :inline="true" label-width="0">
          <el-form-item>
            <el-form-grid size="sm">
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-grid>：
            <el-form-grid size="md">
              <el-input type="text"></el-input>
            </el-form-grid>
          </el-form-item>
          <el-form-item>
            <el-checkbox>含下架</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox>含删除</el-checkbox>
          </el-form-item>
          <el-form-item>
            <ns-button type="primary">{{$t('operating.search')}}</ns-button>
          </el-form-item>
        </el-form>
        <!-- 搜索条件 -->
        <ul class="good-list">
          <div class="text-btn-group">
            <ns-button type="text" class="active"><i class="iconfont icon-topArr">价格</i></ns-button>
            <ns-button type="text"><i class="iconfont icon-downArr">销量</i></ns-button>
          </div>
          <!-- 排序按钮 -->
          <el-radio-group v-model="radioList">
            <li v-for="list in goodsLits">
              <el-radio :label="list.id">
                <div class="good-list-img">
                  <img :src="list.imgUrl">
                </div>
                <a :href="list.goodUrl" target="_blank">{{list.title}}</a>
              </el-radio>
            </li>
          </el-radio-group>
        </ul>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          :pager-count="5"
          layout="total, prev, pager, next"
          :next-click-unlimited="true"
          :total="400">
        </el-pagination>
      </div>
      <div class="template-page__row-right">
          <ns-page-table :colButton="0">
            <!-- 简单搜索 -->
            <template slot="searchSearch">
              <el-form :inline="true" label-width="80px">
                <el-form-item label="付款时间：">
                  <ns-datetime type="date"
                               v-model="time">
                  </ns-datetime>
                </el-form-item>
                <el-form-item>
                  <el-radio-group v-model="radio">
                    <el-radio :label="1">销售数据</el-radio>
                    <el-radio :label="2">收款数据</el-radio>
                  </el-radio-group>
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
                <div class="page-block__title">
                  <p class="el-inline-block">
                    数据图表
                  </p>
                  <el-radio-group v-model="radio">
                    <el-radio :label="1">当日有效付款</el-radio>
                    <el-radio :label="2">下单总额</el-radio>
                    <el-radio :label="3">当日有效订单数</el-radio>
                    <el-radio :label="4">下单订单数</el-radio>
                    <el-radio :label="5">当日有效收款</el-radio>
                    <el-radio :label="6">实际已付订单数</el-radio>
                  </el-radio-group>
                </div>
                <!-- 单图表模式 -->
                <business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>
                <!-- 单图表模式 -->

                <!-- 双图表模式 -->
                <!--<el-row>-->
                  <!--<el-col :span="12">-->
                    <!--<business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>-->
                  <!--</el-col>-->
                  <!--<el-col :span="12">-->
                    <!--<business-echarts :options="option" auto-resize v-loading.lock="loadingtable" :element-loading-text="$t('prompt.loading')"></business-echarts>-->
                  <!--</el-col>-->
                <!--</el-row>-->
                <!-- 双图表模式 -->
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
          <!-- 表格单元格显示商品图片，结构添加类名(img 标签)： table-picture -->
          <el-scrollbar>
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
                prop="num"
                label="当日有效付款"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num1"
                label="当日下单当日付款"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num2"
                label="下单总额"
                align="right">
              </el-table-column>
              <el-table-column
                prop="proportion"
                label="付款比例"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num3"
                label="当日有效订单数"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num4"
                label="当日有效件数"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num5"
                label="当日下单当日付款订单数"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num6"
                label="当日下单当日付款件数"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num7"
                label="下单总数"
                align="right">
              </el-table-column>
              <el-table-column
                prop="num8"
                label="下单总件数"
                align="right">
              </el-table-column>
              <el-table-column
                prop="proportion1"
                label="已付订单比例"
                align="right">
              </el-table-column>
            </el-table>
          </el-scrollbar>
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
    </div>
  </div>
  <!-- /对比分析页面 -->
</template>

<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "../../../style/small/variables.pcss";
  .template-page {
    .template-page__row {
      display: block;
    }
    .template-page__row-left {
      float: left;
      width: 320px;
      min-width: 320px;
      .good-list {
        position: relative;
        padding: 0;
        .text-btn-group {
          position: absolute;
          top: -32px;
          right: 3px;
          >>> .el-button--text {
            color: var(--theme-font-color-primary);
            &.active {
              color: var(--theme-color-primary);
            }
          }
          i {
            font-size: var(--default-font-size-small);
          }
        }
        li {
          display: inline-block;
          width: 49%;
          height: 150px;
          padding: var(--default-padding-base);
          list-style: none;
          overflow: hidden;
          >>> .el-radio {
            position: relative;
            width: 100%;
            padding-top: 105px;
            white-space: unset;
            a {
              line-height: 1.6;
            }
            .good-list-img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              text-align: center;
            }
          }
        }
      }
      >>> .el-pagination {
        padding: 5px 0;
        box-shadow: none;
      }
    }
    .template-page__row-right {
      margin-left: 325px;
      .template-table__main {
        >>> .el-row {
          display: flex;
        }
        >>> .echarts {
          height: 250px;
          overflow: hidden;
        }
      }
    }
    .template-page__table {
      margin-top: var(--default-margin-base);
      overflow: hidden;
      .append-average {
        display: flex;
        width: 100%;
        td {
          flex: 1;
          min-width: 80px;
          background-color: var(--theme-bg-color-base);
          &:first-child {
            min-width: 120px;
            text-align: center;
          }
        }
      }
    }
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
