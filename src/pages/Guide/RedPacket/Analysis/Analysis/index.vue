<template>
  <div class='analysis'>
    <div class='analysis-content'>
      <el-form :inline="true" class='form-inline_top'>
        <el-form-item label="支付商户号：" class='el-form__change'>
          <el-select v-model="model.payConfigId" placeholder="请选择" @change='(value)=>{changeSearchfrom({payConfigId:value})}'>
            <el-option
              v-for="item in payList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class='analysis-content'>
      <h3>出入账统计</h3>
      <ColorfulDisplay />
    </div>
    <div class='analysis-content'>
      <div class='flex-box'>
        <DatePickerBar :dateList='dateList' :defaultPickDay='defaultPickDay'/>
        <ns-button>导出CSV文件</ns-button>
      </div>
    </div>
    <div class='analysis-content'>
      <h3>数据分析</h3>
      <business-echarts :options="saleOption" class="oscillogram" auto-resize></business-echarts>
    </div>
    <div class='analysis-content'>
      <div class='flex-box align-top'><h3>数据报表</h3><ns-button>导出CSV文件</ns-button>
      </div>
      <el-table
        :data="_data._table.data"
        class="new-table_border"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="state"
          label="今日转出金额（元）">
        </el-table-column>
        <el-table-column
          prop="total"
          label="员工转出金额（元）">
        </el-table-column>
        <el-table-column
          prop="remainder"
          label="裂变大师转出金额（元）">
        </el-table-column>
      </el-table>
      <el-pagination v-if="_data._pagination.enable"
                    class="template-table__pagination"
                    :page-sizes="_data._pagination.sizeOpts"
                    :total="_data._pagination.total"
                    :current-page="_data._pagination.page"
                    :page-size="_data._pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="$sizeChange$"
                    @current-change="$pageChange$">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Index from './src/index'
import ColorfulDisplay from '../components/ColorfulDisplay'
import DatePickerBar from '@/components/NewUi/DatePickerBar'
import businessEcharts from '@nascent/ecrp-ecrm/src/components/NsEcharts'
export default Index
Index.components = {
  ColorfulDisplay, DatePickerBar, businessEcharts
}
</script>
<style lang="scss" scoped>
@import "@components/NewUi/styles/reset.css";
.analysis {
  .analysis-content {
    padding: 16px;
    background: #fff;
    border-radius: 4px;
    margin-top: 16px;
    h3 {
      font-size: 16px;
      color: #262626;
      line-height: 24px;
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
}
</style>
<style scoped>
.analysis >>> .el-form-item.el-form__change {
  margin-bottom: 0px;
}
.align-top {
  align-items: flex-start;
}
.template-table__pagination {
  box-shadow: none !important;
}
</style>
