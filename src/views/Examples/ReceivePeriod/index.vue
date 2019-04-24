<template>
  <!-- 签收周期分析页面 -->
  <div class="analysis-content">
    <div class="instructions-content">
      <div class="instructions-content__info">
        1.签收周期分析主要用于对物流公司的效率进行分析，报表呈现了从发货时间到签收时间的订单量分布情况（注意：0天表示当天签收，时间截止到晚上24:00，1天表示第二天签收，以此类推）；<br>
        2.一般来说，签收周期越短，说明合作物流公司的货品送达能力越强，客户更快收到货，体验更好；<br>
        3.报表支持将两个物流公司从发货到签收，每个时间间隔的订单分布情况做对比分析；<br>
        4.报表默认呈现最近3天的签收数据，如需更多的数据，请自定义时间段，时间段越长，报表呈现的时间将越长；<br>
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
            <el-radio-group v-model="radioValue">
              <el-radio :label="1">从发货到签收</el-radio>
              <el-radio :label="2">从揽件到签收</el-radio>
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
        :summary-method="getSummaries"
        show-summary
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="interval"
          label="下单~付款时间间隔"
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
  <!-- /签收周期分析页面 -->
</template>

<script>
import index from './src/index'
export default index
</script>

<style scoped>
  @import "@/style/small/variables.pcss";
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
